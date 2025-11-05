function show_time () {
    if (Count < 10) {
        LumexLDM6432.LDM_putString(
        "0" + convertToText(Count),
        LumexLDM6432.fontSize.bigSize,
        0,
        5,
        62
        )
        LumexLDM6432.LDM_putString(
        "00",
        LumexLDM6432.fontSize.bigSize,
        2,
        5,
        62
        )
    } else {
        LumexLDM6432.LDM_putString(
        convertToText(Count),
        LumexLDM6432.fontSize.bigSize,
        0,
        5,
        62
        )
        LumexLDM6432.LDM_putString(
        "00",
        LumexLDM6432.fontSize.bigSize,
        2,
        5,
        62
        )
    }
}
input.onButtonPressed(Button.A, function () {
	
})
input.onButtonPressed(Button.AB, function () {
	
})
input.onButtonPressed(Button.B, function () {
	
})
let Count = 0
led.enable(false)
pins.setPull(DigitalPin.P3, PinPullMode.PullUp)
LumexLDM6432.LDM_setSerial(SerialPin.P0, SerialPin.P1)
LumexLDM6432.LDM_on()
LumexLDM6432.LDM_setBrightness(1)
LumexLDM6432.LDM_playPage1(0)
let strip = neopixel.create(DigitalPin.P2, 60, NeoPixelMode.RGB)
strip.setBrightness(60)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
strip.showRainbow(1, 360)
Count = 0
while (pins.digitalReadPin(DigitalPin.P3) == 1) {
    strip.rotate(1)
    strip.show()
    basic.pause(100)
}
LumexLDM6432.LDM_playPage1(6)
strip.showColor(neopixel.rgb(0, 0, 0))
basic.forever(function () {
    Count += 1
    if (Count >= 24) {
        Count = 0
    }
    if (Count == 6) {
        LumexLDM6432.LDM_playPage1(1)
        strip.showColor(neopixel.rgb(255, 120, 30))
    } else if (Count == 9) {
        LumexLDM6432.LDM_playPage1(2)
        strip.showColor(neopixel.rgb(255, 200, 100))
    } else if (Count == 12) {
        LumexLDM6432.LDM_playPage1(3)
        strip.showColor(neopixel.rgb(255, 255, 255))
    } else if (Count == 15) {
        LumexLDM6432.LDM_playPage1(4)
        strip.showColor(neopixel.rgb(255, 220, 120))
    } else if (Count == 18) {
        LumexLDM6432.LDM_playPage1(5)
        strip.showColor(neopixel.rgb(255, 100, 20))
    } else if (Count == 21) {
        LumexLDM6432.LDM_playPage1(6)
        strip.showColor(neopixel.rgb(0, 0, 0))
    } else {
    	
    }
    show_time()
    basic.pause(1000)
})
