#define KEYBOARD 1

#ifdef MIDI

const uint8_t channel = 1;      // the MIDI channel number to send messages
const uint8_t base_note = 0;    // the base midi note
uint8_t key_note[MAXPINS];

void keysetup(int npins) {
  for (int i = 0; i < npins; i += 1) {
    key_note[i] = base_note + 2*(i%(NPINS/2)) + (i/(NPINS/2));  
  }
}
void keydown(uint8_t key) {
  usbMIDI.sendNoteOn(key_note[key], 99, channel);
}
void keyup(uint8_t key) {
  usbMIDI.sendNoteOff(key_note[key], 0, channel);
}
void keysend(void) {
  usbMIDI.send_now();
}

#else
#ifdef KEYBOARD

#define MODIFIERKEY_CTRL        ( 0x01 | 0x8000 )
#define MODIFIERKEY_SHIFT       ( 0x02 | 0x8000 )
#define MODIFIERKEY_ALT         ( 0x04 | 0x8000 )
#define MODIFIERKEY_GUI         ( 0x08 | 0x8000 )

uint16_t keycode[MAXPINS] = { MODIFIERKEY_CTRL, MODIFIERKEY_ALT, MODIFIERKEY_SHIFT, MODIFIERKEY_GUI };

void keysetup(int npins) {
}
void keydown(uint8_t key) {
  if (keycode[key]) Keyboard.press(keycode[key]);
}
void keyup(uint8_t key) {
  if (keycode[key]) Keyboard.release(keycode[key]);
}
void keysend(void) {
}

#else

#error "must define MIDI or KEYBOARD to define interface"

#endif
#endif

