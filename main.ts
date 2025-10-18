input.onButtonPressed(Button.A, function () {
    strip.setPixelColor(0, neopixel.rgb(255, 255, 255))
    strip.show()
    LumexLDM6432.LDM_putString(
    "1234",
    LumexLDM6432.fontSize.smallSize,
    0,
    0,
    51
    )
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
LumexLDM6432.LDM_setBrightness(3)
LumexLDM6432.LDM_playPage1(0)
strip = neopixel.create(DigitalPin.P2, 60, NeoPixelMode.RGB)
strip.setBrightness(5)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
strip.showRainbow(1, 360)
basic.forever(function () {
    strip.rotate(1)
    strip.show()
    basic.pause(100)
})
