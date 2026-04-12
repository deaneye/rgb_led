/**
 * RGB LED Strip Shooter Game – micro:bit Edition
 *
 * 1D 射擊遊戲。敵人從燈條底端（index 59）冒出，向上（index 0）移動。
 * 按下對應顏色的按鈕發射子彈，顏色吻合才能消滅敵人。
 *
 * 硬體接線：
 *   NeoPixel RGB 燈條 (60 顆) → P2
 *   按鈕 A（內建）            → 發射 紅色 子彈
 *   P3  外接按鈕（接 GND）    → 發射 綠色 子彈
 *   按鈕 B（內建）            → 發射 藍色 子彈
 *   A+B 同時按                → 顯示目前分數
 *
 * 遊戲規則：
 *   · 敵人（有色 LED）從底端生成並向玩家（top, index 0）前進
 *   · 按對應顏色按鈕從 index 0 發出同色子彈
 *   · 子彈撞到同色敵人 → 雙方消滅，+1 分
 *   · 子彈撞到異色敵人 → 子彈消失，敵人繼續
 *   · 敵人抵達 index 0 → 失去 1 條命（共 3 條）
 *   · 命歸零 → 遊戲結束；按 A 重新開始
 *   · 每擊殺 8 隻提升 1 級（共 5 級）
 */

// ─── 燈條 ───────────────────────────────────────────────────────────────────

const STRIP_LEN = 60
let strip = neopixel.create(DigitalPin.P2, STRIP_LEN, NeoPixelMode.RGB)
strip.setBrightness(80)

// ─── 顏色定義 ────────────────────────────────────────────────────────────────

// 子彈（亮）
const COL_RED   = 0xFF0000
const COL_GREEN = 0x00FF00
const COL_BLUE  = 0x0000FF

// 敵人（暗，約 40% 亮度）
const EN_RED    = 0x660000
const EN_GREEN  = 0x006600
const EN_BLUE   = 0x000066

// index 0=Red 1=Green 2=Blue
let BULLET_COLS = [COL_RED,  COL_GREEN,  COL_BLUE]
let ENEMY_COLS  = [EN_RED,   EN_GREEN,   EN_BLUE]

// ─── 關卡設定 ────────────────────────────────────────────────────────────────
// 每列：[敵人移動間隔ms, 子彈移動間隔ms, 生成間隔ms, 場上最大敵人數]
// 敵人路徑：index 59 → 0（從底往頂）
// 子彈路徑：index  0 → 59（從頂往底）

let LEVEL_CFG = [
    [800, 80, 4000, 2],   // 第 1 關 – 入門
    [550, 70, 3000, 2],   // 第 2 關
    [380, 60, 2500, 3],   // 第 3 關
    [260, 50, 2000, 3],   // 第 4 關
    [180, 45, 1500, 4],   // 第 5 關 – 地獄
]

const SCORE_PER_LEVEL = 8   // 每升一級所需擊殺數
const MAX_LIVES       = 3

// ─── 遊戲狀態 ────────────────────────────────────────────────────────────────

let gScore    = 0
let gLives    = MAX_LIVES
let gLevel    = 1
let gOver     = false
let prevLives = MAX_LIVES

// 敵人平行陣列（位置, 顏色 index）
let ePos: number[] = []
let eCol: number[] = []

// 子彈平行陣列（位置, 顏色 index）
let bPos: number[] = []
let bCol: number[] = []

// 各步驟計時器
let tEnemy  = 0
let tBullet = 0
let tSpawn  = 0

// ─── 工具函式 ────────────────────────────────────────────────────────────────

function levelCfg(): number[] {
    return LEVEL_CFG[Math.min(gLevel - 1, LEVEL_CFG.length - 1)]
}

function resetGame(): void {
    gScore    = 0
    gLives    = MAX_LIVES
    gLevel    = 1
    gOver     = false
    prevLives = MAX_LIVES
    ePos      = []
    eCol      = []
    bPos      = []
    bCol      = []
    let now   = input.runningTime()
    tEnemy    = now
    tBullet   = now
    tSpawn    = now
}

// ─── 射擊 ────────────────────────────────────────────────────────────────────

function fireBullet(colIdx: number): void {
    if (gOver) return
    // 同顏色子彈同時只能存在一顆
    for (let i = 0; i < bCol.length; i++) {
        if (bCol[i] === colIdx) return
    }
    bPos.push(0)
    bCol.push(colIdx)
}

// ─── 按鈕事件 ────────────────────────────────────────────────────────────────

pins.setPull(DigitalPin.P3, PinPullMode.PullUp)

input.onButtonPressed(Button.A, function () { fireBullet(0) })   // 紅
input.onPinPressed(TouchPin.P3, function () { fireBullet(1) })   // 綠
input.onButtonPressed(Button.B, function () { fireBullet(2) })   // 藍
input.onButtonPressed(Button.AB, function () {
    // 同時按 A+B 顯示分數
    basic.showString("Score:" + gScore + " Lv:" + gLevel)
})

// ─── 更新邏輯 ────────────────────────────────────────────────────────────────

function stepSpawn(now: number): void {
    let c = levelCfg()
    if (now - tSpawn < c[2]) return
    tSpawn = now
    if (ePos.length >= c[3]) return
    // 底端有敵人時不重疊生成
    for (let i = 0; i < ePos.length; i++) {
        if (ePos[i] >= STRIP_LEN - 2) return
    }
    ePos.push(STRIP_LEN - 1)
    eCol.push(Math.randomRange(0, 2))
}

function stepBullets(now: number): void {
    let c = levelCfg()
    if (now - tBullet < c[1]) return
    tBullet = now
    for (let i = bPos.length - 1; i >= 0; i--) {
        bPos[i]++
        if (bPos[i] >= STRIP_LEN) {
            bPos.splice(i, 1)
            bCol.splice(i, 1)
        }
    }
}

function stepEnemies(now: number): void {
    let c = levelCfg()
    if (now - tEnemy < c[0]) return
    tEnemy = now
    for (let i = ePos.length - 1; i >= 0; i--) {
        ePos[i]--
        if (ePos[i] <= 0) {
            gLives--
            ePos.splice(i, 1)
            eCol.splice(i, 1)
            if (gLives <= 0) gOver = true
        }
    }
}

function stepCollisions(): void {
    for (let b = bPos.length - 1; b >= 0; b--) {
        for (let e = ePos.length - 1; e >= 0; e--) {
            if (bPos[b] === ePos[e]) {
                let matched = (bCol[b] === eCol[e])
                // 子彈一律消耗
                bPos.splice(b, 1)
                bCol.splice(b, 1)
                if (matched) {
                    // 顏色吻合：消滅敵人，計分
                    ePos.splice(e, 1)
                    eCol.splice(e, 1)
                    gScore++
                    gLevel = Math.min(
                        Math.floor(gScore / SCORE_PER_LEVEL) + 1,
                        LEVEL_CFG.length
                    )
                }
                break
            }
        }
    }
}

// ─── 繪圖 ────────────────────────────────────────────────────────────────────

function drawGame(): void {
    strip.clear()
    // 玩家（頂端 index 0）– 暗白色指示燈
    strip.setPixelColor(0, 0x1A1A1A)

    // 子彈（亮色）
    for (let b = 0; b < bPos.length; b++) {
        let p = bPos[b]
        if (p > 0 && p < STRIP_LEN)
            strip.setPixelColor(p, BULLET_COLS[bCol[b]])
    }
    // 敵人（暗色）
    for (let e = 0; e < ePos.length; e++) {
        let p = ePos[e]
        if (p > 0 && p < STRIP_LEN)
            strip.setPixelColor(p, ENEMY_COLS[eCol[e]])
    }

    strip.show()
}

// ─── 演出動畫 ────────────────────────────────────────────────────────────────

function animStart(): void {
    strip.clear()
    for (let i = 0; i < STRIP_LEN; i++) {
        strip.setPixelColor(i, neopixel.hsl(i * 6, 99, 40))
    }
    strip.show()
    basic.pause(1200)
    strip.clear()
    strip.show()
}

function animLifeLost(): void {
    strip.showColor(0x440000)
    basic.pause(300)
    strip.clear()
    strip.show()
    basic.showIcon(IconNames.SmallHeart)
    basic.clearScreen()
}

function animGameOver(): void {
    for (let t = 0; t < 6; t++) {
        strip.showColor(COL_RED)
        basic.pause(200)
        strip.clear()
        strip.show()
        basic.pause(200)
    }
    basic.showString("DEAD! Score:" + gScore + " Lv:" + gLevel)
}

// ─── 主程式 ──────────────────────────────────────────────────────────────────

animStart()
basic.showString("A=Red P3=Grn B=Blu  GO!")
basic.pause(300)
resetGame()

basic.forever(function () {
    if (gOver) {
        animGameOver()
        strip.showColor(0x110000)
        basic.showString("A=Restart")
        basic.pause(200)
        if (input.buttonIsPressed(Button.A)) {
            resetGame()
            basic.clearScreen()
            strip.clear()
            strip.show()
            basic.pause(300)
        }
    } else {
        let now = input.runningTime()

        stepSpawn(now)
        stepBullets(now)
        stepCollisions()   // 子彈移動後碰撞判定
        stepEnemies(now)
        stepCollisions()   // 敵人移動後碰撞判定

        // 失命時閃爍提示
        if (gLives < prevLives) {
            prevLives = gLives
            animLifeLost()
        }

        drawGame()
        basic.pause(16)    // ~60 fps
    }
})
