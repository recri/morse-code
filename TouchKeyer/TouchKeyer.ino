/*
** implement a touch key on a Teensy
** implemented as a Keyboard that sends ALT and CTRL
** or as a Midi device that sends note on and off.
** The former will work, the latter may have better performance
** if it can be made to work with the software
*/

#define MAXPINS 12    // maximum number of touch pins
#define KEY_THRESHOLD  0x80
#define KEY_HYSTERESIS 0x20

#include <Teensy3Touch.h>
#include "Keyer.h"

void setupLED() {
  pinMode(13, OUTPUT);      // led
  digitalWrite(13, LOW);    // led
}

void toggleLED() {
  digitalWrite(13, digitalRead(13)^1);
}

void setLED(uint8_t value) {
  digitalWrite(13, value);
}

// uint8_t pins[] = { 15, 16, 17, 18, 19, 0, 1, 23, 22, 25, 32, 33 };
// uint8_t pins[] = { 15, 16, 17, 18, 19, 0, 1, 23, 22, 25 };
// uint8_t pins[] = { 19, 22, 23, 25, 15, 0 };
// uint8_t pins[] = { 19, 22, 25, 15 };
// uint8_t pins[] = { 0, 1 };
// uint8_t pins[] = { 1, 0 };
uint8_t pins[] = { 15, 16 };

#define NPINS sizeof(pins)

uint16_t maskpins = 0;
uint8_t channels[NPINS];

uint16_t minTouch[NPINS];
uint16_t maxTouch[NPINS];
uint16_t touch[NPINS];
uint16_t overflows[NPINS];
uint16_t electrodes[NPINS];
uint16_t rangeTouch[NPINS];
uint16_t normTouch[NPINS];

uint8_t key_value[NPINS];
uint16_t key_threshold_on[NPINS];
uint16_t key_threshold_off[NPINS];
long key_count;

void setupTouch() {
  for (int i = 0; i < NPINS; i += 1) {
    channels[i] = Teensy3Touch::pinChannel(pins[i]);
    maskpins |= (1<<channels[i]);
    minTouch[i] = 65535;
  }
  //Teensy3Touch::touchStartContinuous(maskpins,3,2,0.2);
  Teensy3Touch::touchStartContinuous(maskpins);
}

void setupKeys() {
  keysetup(NPINS);
  for (int i = 0; i < NPINS; i += 1) {
    key_threshold_on[i] = KEY_THRESHOLD;
    key_threshold_off[i] = KEY_THRESHOLD-KEY_HYSTERESIS;
  }
}

void setup()
{                
  Serial.begin(38400);
  setupLED();
  setupTouch();
  setupKeys();
}

long count;
long start;
long last;

void print_summary() {
  Serial.print(" count "); Serial.print(count);
  Serial.print(" usecs/read "); Serial.print((micros()-start)/count);
  Serial.print(" |");
  for (int i = 0; i < NPINS; i += 1) {
    Serial.print(" "); Serial.print(i); Serial.print(":"); Serial.print(touch[i]);
  }
  Serial.print(" |");
  Serial.println();
}
void print_pin_names() {
// pin name verification
   for (int i = 0; i < 34; i += 1) {
     uint8_t channel = Teensy3Touch::pinChannel(i);
     if (channel == 255) continue;
     uint8_t pin = Teensy3Touch::channelPin(channel);
     Serial.print(" pin "); Serial.print(i);
     Serial.print(" channel "); Serial.print(channel);
     Serial.print(" pin "); Serial.print(pin);
     Serial.println();
   }
}
void print_normalized_values() {
   // normalized values
   Serial.print("n=|");
   for (int i = 0; i < NPINS; i += 1) {
        unsigned val = normTouch[i];
        if (val < 0x10) Serial.print("0");
        Serial.print(val, 16);
        Serial.print("|"); 
     }
      Serial.println();
}
void print_note_on_off() {
  Serial.print("o=|");
  for (int i = 0; i < NPINS; i += 1) {
    Serial.print(key_value[i]); Serial.print("|"); 
  }
  Serial.println();
}
void print_pin(int c) {
  uint8_t i = c - '0';
  if (i >= 10) i = i + '0' - 'a' + 10;
  if (i >= NPINS) return;
  Serial.print(i);
  Serial.print(" pin "); Serial.print(pins[i]);
  // Serial.print(" channel "); Serial.print(channels[i]);
  Serial.print(" min "); Serial.print(minTouch[i]); 
  Serial.print(" max "); Serial.print(maxTouch[i]);
  // Serial.print(" rng "); Serial.print(rangeTouch[i]);
  Serial.print(" val "); Serial.print(touch[i]); 
  Serial.print(" nrm "); Serial.print(normTouch[i]);
  //Serial.print(" overflow "); Serial.print(overflows[i]); 
  //Serial.print(" electrode "); Serial.print(electrodes[i]); 
  Serial.println();
}
void reset_ranges() {
  for (int i = 0; i < NPINS; i += 1) {
    touch[i] = 0;
    maxTouch[i] = 0;
    minTouch[i] = 0xffff;
    rangeTouch[i] = 0;
    normTouch[i] = 0;
  }
}
void loop() {
  if (start == 0) start = micros();
  if (last == 0) last = micros();
  if (Serial.available()) {
    int c = Serial.read();
    switch (c) {
    case '0': case '1': case '2': case '3': case '4': // fall through
    case '5': case '6': case '7': case '8': case '9': // fall through
    case 'a': case 'b': case 'c': case 'd': case 'e': // fall through
    case 'f': print_pin(c); break;

    case 'n': print_normalized_values(); break;
    case 'o': print_note_on_off(); break;
    case 'p': print_pin_names(); break;
    case 'r': reset_ranges(); break;
    case 's': print_summary(); break;
    }
  }
  if (Teensy3Touch::touchReadyContinuous() && (micros()-last) >= 100) {
    last = micros();
    for (int i = 0; i < NPINS; i += 1) {
      int index = channels[i];
      uint16_t value = Teensy3Touch::touchReadContinuous(index);
      if (value == 0 || value == 65535) {
        electrodes[i] += 1;
        // TSI0_GENCS |= TSI_GENCS_EXTERF;
      } else {
        touch[i] = value;
        maxTouch[i] = max(maxTouch[i], value);
        minTouch[i] = min(minTouch[i], value);
        rangeTouch[i] = maxTouch[i]-minTouch[i];
        if (rangeTouch[i] <= 10) {
          normTouch[i] = 0;
        } else {
          normTouch[i] = 0xFF*(touch[i]-minTouch[i])/rangeTouch[i];
        }
      }
    }
    count += 1;
  }
  uint8_t do_send = 0;
  if (count != key_count) {
    key_count = count;
    for (int i = 0; i < NPINS; i += 1) {
      if (key_value[i]) {
        if (normTouch[i] < key_threshold_off[i]) {
           keyup(i);
           key_value[i] = 0;
           do_send += 1;
        }
      } else {
         if (normTouch[i] > key_threshold_on[i]) {
            keydown(i);
            key_value[i] = 1;
            do_send += 1;
         }
       }
     }
     if (do_send) {
       keysend();
     }
  }
  setLED((millis() & 1024) != 0);
}






