* morse code for chrome
  This is an implementation of several morse code functions that runs
  inside the Chrome browser with no native code extensions required.

  It's main purpose is to train me to copy and key morse code at useful
  speeds.  To do this it needs to send and to receive morse code, so it
  can send me examples, which I must recognize and remember long enough
  to send back, so it can compare what I sent back to the original message.

  To these ends:
  * it translates text into morse code and sends the code as a keyed oscillator;
  * it reads keyup/keydown events and translates them into a keyed oscillator;
  * it translates keyed oscillator events back into morse code and text;
  * it generates arbitrary tests.

* the keyer accessory
  Because keying morse code on a computer keyboard is less than an optimal experience,
  I've built a few USB keyer accessories which improve the experience.  These are
  programs for the Teensy variety of Arduino clones developed by http://pjrc.com/.

  The SwitchKeyer is a program written for the Teensy 2.0 processor.  A mechanical key,
  either a straight key or iambic paddle, plugs into the SwitchKeyer and it generates the
  keyboard events for the Alt and Control keys over a USB Keyboard interface.  The Teensy
  processor and key jack fit into a mini Altoids tin.

  The TouchKeyer is a program written for the Teensy 3.1 processor.  It uses a pair
  of touch sensitive paddles which generate the keyboard events for the Alt and Control
  keys over a USB Keyboard interface.  The Teensy processor is sandwiched between two pieces
  of perfboard which provide the substrate for the tocuch paddles.

* the functions implemented
** morse_code_table() - constructor for a morse code translation table
   Morse code is represented as character strings consisting of:
   * '.' the period or full stop representing a 'dit'
   * '-' the hyphen representing a 'dah'
   * ' ' the space representing the space between characters
   * '  ' the doubled space representing the space between words
#+BEGIN_EXAMPLE
   	// create a morse code translation table
	var table = morse_code_table();
	// select the code table to use
	table.setName('itu');
	// get the list of implemented code tables
	var names = table.getNames();
	// translate unicode string to string of dits, dahs, and spaces
	var encoded = table.encode('abc');
	// translate string of dits, dahs, and spaces to unicode string
	var decoded = table.decode('.- -... -.-.');
	// transliterates arabic, cyrillic, farsi, greek, hebrew, or wabun into roman letters
        var roman = table.transliterate('string');
#+END_EXAMPLE
** morse_code_player(context) - constructor for morse code player
#+BEGIN_EXAMPLE
	// create a morse code player
	var player = morse_code_player(audioContext);
	// set the tone frequency
	player.setPitch(hertz);	// default 600
	// set the level of the tone
	player.setGain(level);	// default 0.05
	// set the rise time of the key envelope
	player.setOnTime(seconds);	// default 0.004
	// set the fall time of the key envelope
	player.setOffTime(seconds);  // default 0.004
	// turn the tone on
	player.on();
	// turn the tone on
	player.off();
	// turn the tone on at a specified time
	player.onAt(time);
	// turn the tone off at a specified time
	player.offAt(time);
	// hold the current on/off state for a time
	player.holdFor(time);
	// set the transition event consumer for the player
	player.setTransitionConsumer(transitionConsumerFunction);
#+END_EXAMPLE
** morse_code_output(context) - constructor for morse code output
#+BEGIN_EXAMPLE
#+END_EXAMPLE
** morse_code_iambic_keyer(context) - constructor for morse code iambic keyer
#+BEGIN_EXAMPLE
#+END_EXAMPLE
** morse_code_straight_keyer(context) - constructor for morse code straight keyer
#+BEGIN_EXAMPLE
#+END_EXAMPLE
** morse_code_iambic_input(context) - constructor for morse code input
#+BEGIN_EXAMPLE
#+END_EXAMPLE
** morse_code_detone(context) - constructor for morse code tone to key event decoder
#+BEGIN_EXAMPLE
#+END_EXAMPLE
** morse_code_detime(context) - constructor for morse code key event to morse decoder
#+BEGIN_EXAMPLE
#+END_EXAMPLE
** morse_code_decode(context) - constructor for morse code to text decoder
#+BEGIN_EXAMPLE
#+END_EXAMPLE
** morse_code_station(context) -
#+BEGIN_EXAMPLE
#+END_EXAMPLE
