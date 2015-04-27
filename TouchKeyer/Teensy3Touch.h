/*
** Scan touch inputs and maintain touch state.
** Set up a set of inputs to scan.
** Scanning proceeds continuously in the background.
** Poll to see if the current scan has completed.
** Request the touch state will either pull a new state
** or return the current state.
*/
#ifndef Teensy3Touch_h
#define Teensy3Touch_h

#include "WProgram.h"

class Teensy3Touch
{
 private:
  /* no instance */
  Teensy3Touch() {}
  // These settings give approx 0.02 pF sensitivity and 1200 pF range
  // Lower current, higher number of scans, and higher prescaler
  // increase sensitivity, but the trade-off is longer measurement
  // time and decreased range.
  static const int CURRENT = 2;	// 0 to 15 - current to use, value is 2*(current+1)
  static const int NSCAN = 9; // number of times to scan, 0 to 31, value is nscan+1
  static const int PRESCALE = 2; // prescaler, 0 to 7 - value is 2^(prescaler+1)

  // output is approx pF * 50
  // time to measure 33 pF is approx 0.25 ms
  // time to measure 1000 pF is approx 4.5 ms

 public:
  /* The number of potential channels, only 12 actually exist */ 
  static const int nchannels = 16;
  /* Check a channel mask for validity */
  static bool validChannels(uint16_t channels) {
    for (int i = 0; i < nchannels; i += 1)
      if (channels & (1<<i))
	if (channelPin(i) == 255)
	  return 0;
    return 1;
  }
  /* Set the channel mask */
  static void setChannels(uint16_t channels) {
    /*
     * the bits set in the "pins" word specify which channels are active
     * from least significant bit to most they correspond to teensy 3.0
     * Arduino pin numbers 0,1,15,16,17,18,19,22,23,25,32,33
     */
    _channels = channels;
    if (_channels == 0)
      return;
    _first_channel = nchannels;
    for (int i = 0; i < nchannels; i += 1) {
      if (validChannel(i)) {
	if (channelPin(i) == 255) {
	  // not a channel
	  _channels ^= (1<<i);
	  continue;
	}
	if (i < _first_channel) _first_channel = i;
	uint8_t pin = channelPin(i);
	*portConfigRegister(pin) = PORT_PCR_MUX(0);
	_value[i] = 65535;
	_minValue[i] = 65535;
	_maxValue[i] = 0;
      }
    }
    _channel = _first_channel;
    if ((SIM_SCGC5 & SIM_SCGC5_TSI) == 0)
      SIM_SCGC5 |= SIM_SCGC5_TSI;	/* gate clock to TSI */
    _start_scan();
  }
  /* poll for new values */
  static bool poll() {
    if (_channels != 0 && (TSI0_GENCS & TSI_GENCS_EOSF) != 0) {
      _readValue();
      return 1;
    }
    return 0;
  }
  /* retrieve and clear error */
  static uint16_t error() {
    uint16_t e = _error;
    _error = 0;
    return e;
  }
  /* translate arduino pin number to touch channel */
  static uint8_t pinChannel(uint8_t pin) {
    switch (pin) {
    case 0: return 9;
    case 1: return 10;
    case 15: return 13;
    case 16: return 0;
    case 17: return 6;
    case 18: return 8;
    case 19: return 7;
    case 22: return 14;
    case 23: return 15;
    case 25: return 12;
    case 32: return 11;
    case 33: return 5;
    default: return 255;
    }
  }
  static uint8_t channelPin(uint8_t channel) {
    switch (channel) {
    case 0: return 16;
    case 5: return 33;
    case 6: return 17;
    case 7: return 19;
    case 8: return 18;
    case 9: return 0;
    case 10: return 1;
    case 11: return 32;
    case 12: return 25;
    case 13: return 15;
    case 14: return 22;
    case 15: return 23;
    default: return 255;
    }
  }
  /* idenfity valid channels */
  static bool validChannel(uint8_t channel) { return channel < nchannels && (_channels & (1<<channel)) != 0; }
  /* identify valid values */
  static bool validValue(uint8_t channel) { return validChannel(channel) && _minValue[channel] <= _maxValue[channel]; }
  /* max value seen on channel */
  static uint16_t maxValue(uint8_t channel) { return validChannel(channel) ? _maxValue[channel] : 0; }
  /* min value seen on channel */
  static uint16_t minValue(uint8_t channel) { return validChannel(channel) ? _minValue[channel] : 65535; }
  /* last value seen on channel */
  static uint16_t value(uint8_t channel) { return validChannel(channel) ? _value[channel] : 65535; }
  /* threshold value seen for channel */
  static uint16_t threshold(uint8_t channel) { return validChannel(channel) ? _threshold[channel] : 65535; }
  /* bit map of touched pins */
  static uint16_t touched() { return _touched; }
  /* does the value count as a touch */
  static uint16_t touched(uint8_t channel) {
    return validChannel(channel) && validValue(channel) ? _value[channel] > _threshold[channel] : 0;
  }
  /* bit map of partially touched pins */
  static uint16_t partial() { return _partial; }
  /* partial touch value for pin */
  static uint16_t partial(uint8_t channel) {
    return validChannel(channel) && validValue(channel) ? (_value[channel] - _minValue[channel]) / ((_maxValue[channel] - _minValue[channel])/4) : 0;
  }
  static uint8_t nextChannel(uint8_t channel) {
    for (channel += 1; channel < nchannels; channel += 1)
      if (validChannel(channel))
	return channel;
    return _first_channel;
  }
 private:
  /* data */
  static uint16_t _first_channel;	/* first channel in mask */
  static uint16_t _channel;		/* current channel */
  static uint16_t _channels;		/* channel active mask */
  static uint16_t _value[12];		/* channel value */
  static uint16_t _minValue[12];	/* channel minimum value */
  static uint16_t _maxValue[12];	/* channel maximum value */
  static uint16_t _threshold[12];	/* channel threshold */
  static uint16_t _touched;		/* channel touched bit mask */
  static uint16_t _partial;		/* channel partial touch bit mask */
  static uint16_t _error;		/* electrode/overflow error status */

  /* read new values */
  static void _readValue() {
    int i = _channel;
    delayMicroseconds(1);
    uint16_t value = *((volatile uint16_t *)(&TSI0_CNTR1) + i);
    if (value != 65535) {
      _value[i] = value;
      if (value > _maxValue[i]) {
	_maxValue[i] = value;
	_threshold[i] = _minValue[i] + (_maxValue[i]-_minValue[i])/2;
      }
      if (value < _minValue[i]) {
	_minValue[i] = value;
	_threshold[i] = _minValue[i] + (_maxValue[i]-_minValue[i])/2;
      }
      if (touched(i)) _touched |= (1<<i); else _touched &= ~(1<<i);
      if (partial(i) > 0) _partial |= (1<<i); else _partial &= ~(1<<i);
    }
    //_channel = nextChannel(i);
    _start_scan();
  }
  static void _start_scan() {
    /* TSI0_GENCS = LPCLKS | LPSCNITV |
		NSCN | PS |
		EOSF | OUTRGF | EXTERF | OVRF | SCNIP | SWTS |
		TSIEN | TSIIE | ERIE | ESOR | STM | STPE */
    /* TSI0_SCANC = REFCHRG | EXTCHRG | SMOD | AMCLKS | AMPSC */
    /* disable TSI */
    TSI0_GENCS = 0;
    /* set scan channel mask */
    TSI0_PEN = 1<<_channel;
    /* reference and external oscillator current */
    TSI0_SCANC = TSI_SCANC_REFCHRG(3) | TSI_SCANC_EXTCHRG(CURRENT);
    /* number of scans, prescale, periodic trigger, enable TSI, trigger scan */
    TSI0_GENCS = TSI_GENCS_NSCN(NSCAN) | TSI_GENCS_PS(PRESCALE) | TSI_GENCS_TSIEN | TSI_GENCS_SWTS;
    /* pause */
    delayMicroseconds(10);
  }
 public:
  static int touchReadStart(int pin, int refchrg=3, int extchrg=2) {
    /* get channel for pin */
    int channel = pinChannel(pin);
    /* invalid pin */
    if (channel == 255) return 0;
    /* configure pin for touch */
    *portConfigRegister(pin) = PORT_PCR_MUX(0);
    /* gate clock to TSI */
    SIM_SCGC5 |= SIM_SCGC5_TSI;
    /* disable TSI */
    TSI0_GENCS = 0;
    /* set scan channel mask */
    TSI0_PEN = 1<<channel;
    /* reference and external oscillator current */
    TSI0_SCANC = TSI_SCANC_REFCHRG(3) | TSI_SCANC_EXTCHRG(CURRENT) | TSI_SCANC_SMOD(1);
    /* number of scans, prescale, periodic trigger, enable TSI, trigger scan */
    TSI0_GENCS = TSI_GENCS_NSCN(NSCAN) | TSI_GENCS_PS(PRESCALE) | TSI_GENCS_TSIEN | TSI_GENCS_SWTS | TSI_GENCS_EOSF | TSI_GENCS_EXTERF | TSI_GENCS_OVRF;
    /* pause */
    delayMicroseconds(10);
    /* return success */
    return 1;
  }
  static int touchReadReady(uint8_t pin) {
    /* get channel for pin */
    uint8_t channel = pinChannel(pin);
    /* invalid pin */
    if (channel == 255) return 0;
    return (TSI0_GENCS & TSI_GENCS_EOSF) != 0;
  }
  static int touchReadBusy(uint8_t pin) {
    /* get channel for pin */
    uint8_t channel = pinChannel(pin);
    /* invalid pin */
    if (channel == 255) return 0;
    return (TSI0_GENCS & TSI_GENCS_SCNIP) == 0;
  }
  static uint16_t touchReadFinish(uint8_t pin) {
    /* get channel for pin */
    uint8_t channel = pinChannel(pin);
    /* invalid pin */
    if (channel == 255) return 0;
    /* momentary delay */
    delayMicroseconds(1);
    /* return value */
    return ((volatile uint16_t *)(&TSI0_CNTR1))[channel];
  }
  /*
  ** set up to continuously scan any subset of the 12 touch scan interface pins
  ** only required argument is the mask of touch channels to scan
  ** optional arguments are defaulted to the values used in hardware/teensy/cores/teensy3/touch.c
  */
  static uint16_t touchStartContinuous(uint16_t mask, uint8_t refchrg = 3, uint8_t extchrg = 2, uint8_t nscan = 9, uint8_t prescale = 2) {
    for (int i = 0; i < 16; i += 1) {
      if (mask & (1<<i)) {
	/* configure pin for touch */
	if (channelPin(i) == 255)
	  mask ^= (1<<i);
	else
	  *portConfigRegister(channelPin(i)) = PORT_PCR_MUX(0);
      }
    }
    /* gate clock to TSI */
    SIM_SCGC5 |= SIM_SCGC5_TSI;
    /* disable TSI */
    TSI0_GENCS = 0;
    /* set scan channel mask */
    TSI0_PEN = mask;
    /* reference and external oscillator current */
    TSI0_SCANC = TSI_SCANC_REFCHRG(refchrg) | TSI_SCANC_EXTCHRG(extchrg);
    /* number of scans, prescale, periodic trigger, enable TSI, trigger scan */
    TSI0_GENCS = TSI_GENCS_NSCN(nscan) | TSI_GENCS_PS(prescale) | TSI_GENCS_TSIEN | TSI_GENCS_STM | TSI_GENCS_EOSF | TSI_GENCS_EXTERF | TSI_GENCS_OVRF;
    return mask;
  }
  /* return true if the end of scan flag has appeared */
  static int touchReadyContinuous() {
    /* wait for scan to complete */
    if ((TSI0_GENCS & TSI_GENCS_EOSF) != 0) {
      /* clear scan flags */
      TSI0_GENCS |= TSI_GENCS_EOSF|TSI_GENCS_OVRF|TSI_GENCS_EXTERF;
      return 1;
    } else {
      return 0;
    }
  }
  /* retrieve the value of the specified touch channel */
  static uint16_t touchReadContinuous(uint8_t channel) {
    return (channel < 16) ? ((volatile uint16_t *)(&TSI0_CNTR1))[channel] :  0;
  }
};

#endif // TeensyTouch_h
