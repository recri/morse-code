/*
** This works out the web MIDI examples from http://www.w3.org/TR/webmidi/
** The result is that Chrome isn't playing yet.  The interface needs to be
** enabled in chrome://flags, and it doesn't implement the onmidiinput event.
**
** I verified that the MIDI device is producing input events by simply
**    cat /dev/snd/midi*
** and watching the bytes go by.
**
** going to switch to a HID device for now.
*/

var midiOptions = { };
var midi = null;  // global MIDIAccess object
var teensy_input = null;
var teensy_output = null;

function onMIDIMessage( event ) {
  var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
  for (var i=0; i<event.data.length; i++) {
    str += "0x" + event.data[i].toString(16) + " ";
  }
  console.log( str );
}

function onMIDISuccess( midiAccess ) {
    console.log( "MIDI ready!" );
    midi = midiAccess;
    // console.log("MIDI has "+ midi.inputs.size +" inputs");
    for (var x of midi.inputs.values()) {
	// console.log("MIDI input "+x.name);
	if (x.name == "Teensy MIDI MIDI 1") {
	    // console.log("found Teensy input");
	    teensy_input = x;
	    teensy_input.onmidimessage = onMIDIMessage;
	}
    }
    // console.log("MIDI has "+ midi.outputs.size +" outputs");
    for (var x of midi.outputs.values()) {
	// console.log("MIDI output "+x.name);
	if (x.name == "Teensy MIDI MIDI 1") {
	    // console.log("found Teensy output");
	    teensy_output = x;
	}
    }
}

function onMIDIFailure(msg) {
  console.log( "Failed to get MIDI access - " + msg );
}

navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );
