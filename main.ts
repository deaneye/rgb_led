input.onButtonPressed(Button.A, function () {
    strip.setPixelColor(0, neopixel.rgb(255, 255, 255))
    strip.show()
})
input.onButtonPressed(Button.AB, function () {
    strip.showColor(neopixel.colors(NeoPixelColors.Black))
    strip.show()
})
input.onButtonPressed(Button.B, function () {
    strip.setPixelColor(1, neopixel.rgb(100, 100, 100))
    strip.show()
    LumexLDM6432.LDM_putString(
    "5678",
    LumexLDM6432.fontSize.smallSize,
    0,
    0,
    54
    )
})
let strip: neopixel.Strip = null
LumexLDM6432.LDM_setSerial(SerialPin.P0, SerialPin.P1)
LumexLDM6432.LDM_on()
LumexLDM6432.LDM_setBrightness(2)
LumexLDM6432.LDM_playPage1(1)
strip = neopixel.create(DigitalPin.P2, 60, NeoPixelMode.RGB)
strip.setBrightness(3)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
strip.showRainbow(1, 360)
let Count = 0
basic.forever(function () {
    strip.rotate(1)
    strip.show()
    basic.pause(100)
})
basic.forever(function () {
    Count += 1
    basic.showNumber(Count)
    if (Count >= 24) {
        Count = 0
    }
    if (Count > 6 && Count <= 9) {
        LumexLDM6432.LDM_playPage1(1)
    } else if (Count > 9 && Count <= 12) {
        LumexLDM6432.LDM_playPage1(2)
    } else if (Count > 12 && Count <= 15) {
        LumexLDM6432.LDM_playPage1(3)
    } else if (Count > 15 && Count <= 18) {
        LumexLDM6432.LDM_playPage1(4)
    } else {
        LumexLDM6432.LDM_playPage1(6)
    }
    basic.pause(1000)
})
