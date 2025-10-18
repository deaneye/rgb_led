def on_button_pressed_a():
    strip.set_pixel_color(0, neopixel.colors(NeoPixelColors.WHITE))
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    strip.set_pixel_color(1, neopixel.colors(NeoPixelColors.WHITE))
input.on_button_pressed(Button.B, on_button_pressed_b)

strip: neopixel.Strip = None
strip = neopixel.create(DigitalPin.P2, 10, NeoPixelMode.RGB)
range2 = strip.range(0, 10)
strip.set_brightness(10)
strip.show_rainbow(1, 360)

def on_forever():
    pass
basic.forever(on_forever)
