/*
  Copyright (C) 2011, 2012, 2015 by Roger E Critchlow Jr, Santa Fe, NM, USA.

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307 USA
*/
/* Iambic paddle to USB MIDI or USB HID via Teensy

   You must select MIDI or Keyboard from the "Tools > USB Type" menu

   This is a very trimmed and modified copy of the Buttons
   example from the Teensyduino add on to the Arduino.

   To use it, you need:

   1) to get a Teensy 2.0-3.1 from http://www.pjrc.com/teensy/
   or some other supplier, eg http://www.adafruit.com/products/199
   2) to follow the instructions for installing Teensyduino at
   http://www.pjrc.com/teensy/teensyduino.html
   3) on Ubuntu, you will need the gcc-avr and avr-libc packages
   for Arduino to use (which you can get by installing the Ubuntu
   arduino target.

   Do not reprogram your Teensy while ALSA and Jack have the MidiKey
   open as a MIDI device or you will get some system crashes.
*/

#define KEYBOARD 1
#define MAXPINS 4

#include "WProgram.h"
#include "debouncer.h"
#include "Keyer.h"

const int ditPin = 0;       // the dit pin number, is B0
const int dahPin = 1;       // the dah pin number, is B1

const int debounceFor = 4;  // four clock debounce

debouncer ditFilter(debounceFor);	    
debouncer dahFilter(debounceFor);

const int sample_period = 100;

byte dit;                   // the current dit value
byte dah;                   // the current dah value

void setup() {
  keysetup(2);
  pinMode(ditPin, INPUT_PULLUP);
  pinMode(dahPin, INPUT_PULLUP);
  dit = digitalRead(ditPin);
  dah = digitalRead(dahPin);
}

void loop() {
  byte send_now = 0;
  byte new_dit = ditFilter.debounce(digitalRead(ditPin));
  if (new_dit != dit) {
    if ((dit = new_dit) != 0) {
      keyup(0);
    } else {
      keydown(0);
    }
    send_now += 1;
  }
  byte new_dah = dahFilter.debounce(digitalRead(dahPin));
  if (new_dah != dah) {
    if ((dah = new_dah) != 0) {
      keyup(1);
    } else {
      keydown(1);
    }
    send_now += 1;
  }
  if (send_now) {
    keysend();
  }
}
