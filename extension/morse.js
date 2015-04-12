/* -*- mode: js; tab-width: 8 -*- */
/*
  Copyright (C) 2015 by Roger E Critchlow Jr, Santa Fe, NM, USA.

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

/*
** the source and license for this package may be found at github/recri/morse-code
** see README.org at that repo for documentation.
*/

// translate text into dit/dah strings
function morse_code_table() {
    // object defining a morse code translation
    var table = {
	// the name of the encoding currently in use
	name: null,
	// the object dictionary table used for encoding
	code: null,
	// the object dictionary used to transliterate into roman
	trans: null,
	// the object dictionary used to decode morse back to unicode
	invert: null,
	// encode the string into dit, dah, and space
	// dit is a period, dah is a hyphen, space is a space that represents
	// a nominal 2 dit clocks of space which is added to the 1 dit clock of space
	// that terminates each dit or dah.
	encode: function(string) {
	    var result = [];
	    if (table.code) {
		for (var i = 0; i < string.length; i += 1) {
		    var c = string.charAt(i).toUpperCase();
		    if (table.code[c]) {
			result.push(table.code[c]);
			result.push(' ')
		    } else if (c == ' ') {
			result.push('  ');
		    }
		}
	    }
	    return result.join('');
	},
	decode : function(string) {
	    return table.invert[string];
	},
	// take a string in arabic, cyrillic, farsi, greek, hebrew, or wabun and transliterate into roman
	transliterate: function(string) {
	    var result = [];
	    if (table.trans) {
		for (var i = 0; i < string.length; i += 1) {
		    var c = string.charAt(i).toUpperCase();
		    if (table.trans[c]) {
			result += table.trans[c];
		    } else if (c == ' ') {
			result.push(' ');
		    }
		}
	    } else {
		result.push(string);
	    }
	    return result.join('');
	},
	// select the code to use
	setName: function(name) {
	    if (table.name != name) {
		if (table.codes[name]) {
		    table.name = name;
		    table.code = table.codes[name];
		    table.trans = table.transliterations[name];
		    table.invert = {};
		    // problem with multiple translations?
		    for (var i in table.code) table.invert[table.code[i]] = i;
		}
	    }
	},
	// return the list of valid name for codes
	getNames: function() {
	    var names = [];
	    for (var i in table.codes) names.push(i);
	    return names;
	},
	// morse code translation tables
	codes : {
	    'arabic' : {
		"\u0627" : '.-', "\u062f" : '-..', "\u0636" : '...-', "\u0643" : '-.-', "\ufe80" : '.', "\u0628" : '-...',
		"\u0630" : '--..', "\u0637" : '..-', "\u0644" : '.-..', "\u062a" : '-', "\u0631" : '.-.', "\u0638" : '-.--',
		"\u0645" : '--', "\u062b" : '-.-.', "\u0632" : '---.', "\u0639" : '.-.-', "\u0646" : '-.', "\u062c": '.---',
		"\u0633" : '...', "\u063a" : '--.', "\u0647" : '..-..', "\u062d" : '....', "\u0634" : '----', "\u0641" : '..-.',
		"\u0648" : '.--', "\u062e" : '---', "\u0635" : '-..-', "\u0642" : '--.-', "\u064a" : '..' },
	    'cyrillic' : {
		"\u0410" : '.-', "\u041b" : '.-..', "\u0425" : '....', "\u0411" : '-...', "\u041c" : '--', "\u0426" : '-.-.',
		"\u0412" : '.--', "\u041d" : '-.', "\u0427" : '---.', "\u0413" : '--.', "\u041e" : '---', "\u0428" : '----',
		"\u0414" : '-..', "\u041f" : '.--.', "\u0429" : '--.-', "\u0415" : '.', "\u0420" : '.-.', "\u042c" : '-..-',
		"\u0416" : '...-', "\u0421" : '...', "\u042b" : '-.--', "\u0417" : '--..', "\u0422" : '-', "\u042d" : '..-..',
		"\u0418" : '..', "\u0423" : '..-', "\u042e" : '..--', "\u0419" : '.---', "\u0424" : '..-.', "\u042f" : '.-.-',
		"\u041a" : '-.-' },
	    'farsi' : {
		"\u0627" : '.-', "\u062e" : '-..-', "\u0635" : '.-.-', "\u06a9" : '-.-', "\u0628" : '-...', "\u062f" : '-..',
		"\u0636" : '..-..', "\u06af" : '--.-', "\u067e" : '.--.', "\u0630" : '...-', "\u0637" : '..-', "\u0644" : '.-..',
		"\u062a" : '-', "\u0631" : '.-.', "\u0638" : '-.--', "\u0645" : '--', "\u062b" : '-.-.', "\u0632" : '--..',
		"\u0639" : '---', "\u0646" : '-.', "\u062c" : '.---', "\u0698" : '--.', "\u063a" : '..--', "\u0648" : '.--',
		"\u0686" : '---.', "\u0633" : '...', "\u0641" : '..-.', "\u0647" : '.', "\u062d" : '....', "\u0634" : '----',
		"\u0642" : '...---', "\u06cc" : '..' },
	    'greek' : {
		"\u0391" : '.-', "\u0399" : '..', "\u03a1" : '.-.', "\u0392" : '-...', "\u039a" : '-.-', "\u03a3" : '...',
		"\u0393" : '--.', "\u039b" : '.-..', "\u03a4" : '-', "\u0394" : '-..', "\u039c" : '--', "\u03a5" : '-.--',
		"\u0395" : '.', "\u039d" : '-.', "\u03a6" : '..-.', "\u0396" : '--..', "\u039e" : '-..-', "\u03a7" : '----',
		"\u0397" : '....', "\u039f" : '---', "\u03a8" : '--.-', "\u0398" : '-.-.', "\u03a0" : '.--.', "\u03a9" : '.--' },
	    'hebrew' : {
		"\u05d0" : '.-', "\u05dc" : '.-..', "\u05d1" : '-...', "\u05de" : '--', "\u05d2" : '--.', "\u05e0" : '-.',
		"\u05d3" : '-..', "\u05e1" : '-.-.', "\u05d4" : '---', "\u05e2" : '.---', "\u05d5" : '.', "\u05e4" : '.--.',
		"\u05d6" : '--..', "\u05e6" : '.--', "\u05d7" : '....', "\u05e7" : '--.-', "\u05d8" : '..-', "\u05e8" : '.-.',
		"\u05d9" : '..', "\u05e9" : '...', "\u05db" : '-.-', "\u05ea" : '-' },
	    'itu' : {
		'!' : '-.-.--', '"' : '.-..-.', '$' : '...-..-', '&' : '.-...', "'" : '.----.', '(' : '-.--.', ')' : '-.--.-',
		'+' : '.-.-.', ',' : '--..--', '-' : '-....-', '.' : '.-.-.-', '/' : '-..-.',
		'0' : '-----', '1': '.----', '2' : '..---', '3' : '...--', '4' : '....-', '5' : '.....', '6' : '-....', '7' : '--...', '8' : '---..', '9' : '----.',
		':' : '---...', ';' : '-.-.-.', '=' : '-...-', '?' : '..--..', '@' : '.--.-.',
		'A' : '.-', 'B' : '-...', 'C' : '-.-.', 'D' : '-..', 'E' : '.', 'F' : '..-.', 'G' : '--.', 'H' : '....', 'I' : '..', 'J' : '.---', 'K' : '-.-',
		'L' : '.-..', 'M' : '--', 'N' : '-.', 'O' : '---', 'P' : '.--.', 'Q' : '--.-', 'R' : '.-.', 'S' : '...', 'T' : '-', 'U' : '..-', 'V' : '...-',
		'W' : '.--', 'X' : '-..-', 'Y' : '-.--', 'Z' : '--..', '_' : '..--.-', },
	    'wabun' : {
		"\u30a2" : '--.--', "\u30ab" : '.-..', "\u30b5" : '-.-.-', "\u30bf" : '-.', "\u30ca" : '.-.', "\u30cf" : '-...',
		"\u30de" : '-..-', "\u30e4" : '.--', "\u30e9" : '...', "\u30ef" : '-.-', "\u25cc" : '..', "\u30a4" : '.-',
		"\u30ad" : '-.-..', "\u30b7" : '--.-.', "\u30c1" : '..-.', "\u30cb" : '-.-.', "\u30d2" : '--..-', "\u30df" : '..-.-',
		"\u30ea" : '--.', "\u30f0" : '.-..-', "\u25cc" : '..--.', "\u30a6" : '..-', "\u30af" : '...-', "\u30b9" : '---.-',
		"\u30c4" : '.--.', "\u30cc" : '....', "\u30d5" : '--..', "\u30e0" : '-', "\u30e6" : '-..--', "\u30eb" : '-.--.',
		"\u30f3" : '.-.-.', "\u25cc" : '.--.-', "\u30a8" : '-.---', "\u30b1" : '-.--', "\u30bb" : '.---.', "\u30c6" : '.-.--',
		"\u30cd" : '--.-', "\u30d8" : '.', "\u30e1" : '-...-', "\u30ec" : '---', "\u30f1" : '.--..', "\u3001" : '.-.-.-',
		"\u30aa" : '.-...', "\u30b3" : '----', "\u30bd" : '---.', "\u30c8" : '..-..', "\u30ce" : '..--', "\u30db" : '-..',
		"\u30e2" : '-..-.', "\u30e8" : '--', "\u30ed" : '.-.-', "\u30f2" : '.---', "\u3002": '.-.-..' }
	},
	// transliteration tables for non-roman alphabets
	transliterations : {
	    'arabic' : {
		"\u0627" : 'A', "\u062f" : 'D', "\u0636" : 'V', "\u0643" : 'K', "\ufe80" : 'E', "\u0628" : 'B', "\u0630" : 'Z', "\u0637" : 'U', "\u0644" : 'L',
		"\u062a" : 'T', "\u0631" : 'R', "\u0638" : 'Y', "\u0645" : 'M', "\u062b" : 'C', "\u0632" : 'Z', "\u0639" : 'Ä', "\u0646" : 'N', "\u062c" : 'J',
		"\u0633" : 'S', "\u063a" : 'G', "\u0647" : 'É', "\u062d" : 'H', "\u0634" : 'SH', "\u0641" : 'F', "\u0648" : 'W', "\u062e" : 'O', "\u0635" : 'X',
		"\u0642" : 'Q', "\u064a" : 'I'
	    },
	    'cyrillic' : {
		"\u0410" : 'A', "\u041b" : 'L', "\u0425" : 'H', "\u0411" : 'B', "\u041c" : 'M', "\u0426" : 'C', "\u0412" : 'W', "\u041d" : 'N', "\u0427" : 'Ö',
		"\u0413" : 'G', "\u041e" : 'O', "\u0428" : 'CH', "\u0414" : 'D', "\u041f" : 'P', "\u0429" : 'Q', "\u0415" : 'E', "\u0420" : 'R', "\u042c" : 'X',
		"\u0416" : 'V', "\u0421" : 'S', "\u042b" : 'Y', "\u0417" : 'Z', "\u0422" : 'T', "\u042d" : 'É', "\u0418" : 'I', "\u0423" : 'U', "\u042e" : 'Ü',
		"\u0419" : 'J', "\u0424" : 'F', "\u042f" : 'Ä', "\u041a" : 'K'
	    },
	    'farsi' : {
		"\u0627" : 'A', "\u062e" : 'X', "\u0635" : 'Ä', "\u06a9" : 'K', "\u0628" : 'B', "\u062f" : 'D', "\u0636" : 'É', "\u06af" : 'Q', "\u067e" : 'P',
		"\u0630" : 'V', "\u0637" : 'U', "\u0644" : 'L', "\u062a" : 'T', "\u0631" : 'R', "\u0638" : 'Y', "\u0645" : 'M', "\u062b" : 'C', "\u0632" : 'Z',
		"\u0639" : 'O', "\u0646" : 'N', "\u062c" : 'J', "\u0698" : 'G', "\u063a" : 'Ü', "\u0648" : 'W', "\u0686" : 'Ö', "\u0633" : 'S', "\u0641" : 'F',
		"\u0647" : 'E', "\u062d" : 'H', "\u0634" : 'Š', "\u0642" : '?', "\u06cc" : 'I'
	    },
	    'greek' : {
		"\u0391" : 'A', "\u0399" : 'I', "\u03a1" : 'R', "\u0392" : 'B', "\u039a" : 'K', "\u03a3" : 'S', "\u0393" : 'G', "\u039b" : 'L', "\u03a4" : 'T',
		"\u0394" : 'D', "\u039c" : 'M', "\u03a5" : 'Y', "\u0395" : 'E', "\u039d" : 'N', "\u03a6" : 'F', "\u0396" : 'Z', "\u039e" : 'X', "\u03a7" : 'CH',
		"\u0397" : 'H', "\u039f" : 'O', "\u03a8" : 'Q', "\u0398" : 'C', "\u03a0" : 'P', "\u03a9" : 'W'
	    },
	    'hebrew' : {
		"\u05d0" : 'A', "\u05dc" : 'L', "\u05d1" : 'B', "\u05de" : 'M', "\u05d2" : 'G', "\u05e0" : 'N', "\u05d3" : 'D', "\u05e1" : 'C', "\u05d4" : 'O',
		"\u05e2" : 'J', "\u05d5" : 'E', "\u05e4" : 'P', "\u05d6" : 'Z', "\u05e6" : 'W', "\u05d7" : 'H', "\u05e7" : 'Q', "\u05d8" : 'U', "\u05e8" : 'R',
		"\u05d9" : 'I', "\u05e9" : 'S', "\u05db" : 'K', "\u05ea" : 'T'
	    },
	    'wabun' : {
		"\u30a2" : 'a', "\u30ab" : 'ka', "\u30b5" : 'sa',  "\u30bf" : 'ta',  "\u30ca" : 'na', "\u30cf" : 'ha', "\u30de" : 'ma', "\u30e4" : 'ya', "\u30e9" : 'ra',
		"\u30a4" : 'i', "\u30ad" : 'ki', "\u30b7" : 'shi', "\u30c1" : 'chi', "\u30cb" : 'ni', "\u30d2" : 'hi', "\u30df" : 'mi', "\u30ea" : 'ri', "\u30f0" : 'wi',
		"\u30a6" : 'u', "\u30af" : 'ku', "\u30b9" : 'su',  "\u30c4" : 'tsu', "\u30cc" : 'nu', "\u30d5" : 'fu', "\u30e0" : 'mu', "\u30e6" : 'yu', "\u30eb" : 'ru',
		"\u30f3" : 'n',
		"\u30a8" : 'e', "\u30b1" : 'ke', "\u30bb" : 'se',  "\u30c6" : 'te',  "\u30cd" : 'ne', "\u30d8" : 'he', "\u30e1" : 'me', "\u30ec" : 're', "\u30f1" : 'we',
		"\u30aa" : 'o', "\u30b3" : 'ko', "\u30bd" : 'so',  "\u30c8" : 'to',  "\u30ce" : 'no', "\u30db" : 'ho', "\u30e2" : 'mo', "\u30e8" : 'yo', "\u30ed" : 'ro',  "\u30f2" : 'wo',
		// these end up as duplicate keys
		// "\u25cc" : 'Dakuten', "\u25cc" : 'Handakuten', "\u25cc" : 'Long vowel',
		"\u3001" : 'Comma', "\u3002" : 'Full stop'
	    }
	}
    };
    table.setName('itu');
    return table;
}

// translate keyup/keydown into keyed sidetone
function morse_code_player(context) {
    var player = {
	oscillator : context.createOscillator(),
	key : context.createGain(),
	limit : context.createGain(),
	onShape : null,		// key on ramp curve, see below
	offShape : null,	// key off ramp curve, see below
	pitch : 600,		// oscillator pitch
	gain : 0.05,		// limit on gain
	onTime : 0.004,		// key on ramp length in seconds
	offTime : 0.004,	// key off ramp length in seconds
	cursor : 0,		// next time
	setPitch : function(hertz) {
	    player.oscillator.frequency.value = hertz;
	},
	setGain : function(gain) {
	    player.limit.gain.value = player.gain = Math.min(Math.max(gain, 0.001), 1.0);
	},
	setOnTime : function(seconds) {
	    player.onTime = seconds || 0.004;
	    var n = Math.ceil(context.sampleRate*player.onTime)+1;
	    player.onShape = new Float32Array(n);
	    for (var i = 0; i < n; i += 1) {
		var t = Math.PI*(1+i/(n-1));
		player.onShape[i] = (Math.cos(t)+1)/2;
	    }
	},
	setOffTime : function(seconds) {
	    player.offTime = seconds || 0.004;
	    var n = Math.ceil(context.sampleRate*player.offTime)+1;
	    player.offShape = new Float32Array(n);
	    for (var i = 0; i < n; i += 1) {
		var t = Math.PI*(i/(n-1));
		player.offShape[i] = (Math.cos(t)+1)/2;
	    }
	},
	getCursor : function() { return player.cursor = Math.max(player.cursor, context.currentTime); },
	connect : function(target) {
	    player.limit.connect(target);
	},
	on : function() {
	    player.cancel();
	    player.onAt(context.currentTime);
	},
	off : function() {
	    player.cancel();
	    player.offAt(context.currentTime);
	},
	onAt : function(time) {
	    player.key.gain.setValueCurveAtTime(player.onShape, time, player.onTime);
	    player.cursor = time;
	    player.transition(1);
	},
	offAt : function(time) {
	    player.key.gain.setValueCurveAtTime(player.offShape, time, player.offTime);
	    player.cursor = time;
	    player.transition(0);
	},
	holdFor : function(seconds) {
	    return player.cursor += seconds;
	},
	cancel : function() {
	    player.key.gain.cancelScheduledValues(player.cursor = context.currentTime);
	    player.key.gain.value = 0;
	},
	transitionConsumer : null,
	setTransitionConsumer : function(transitionConsumer) {
	    player.transitionConsumer = transitionConsumer;
	},
	transition : function(onoff) {
	    if (player.transitionConsumer) {
		player.transitionConsumer.transition(onoff, player.cursor);
	    }
	},

    };
    // define the raised cosine gain curve for the on shape
    player.setOnTime(player.onTime);
    // define the raised cosine gain curve for the off shape
    player.setOffTime(player.offTime);
    // initialize the oscillator
    player.oscillator.type = 'sine';
    player.setPitch(player.pitch); // value in hertz
    player.oscillator.start();
    // initialize the gain
    player.key.gain.value = 0;
    player.setGain(player.gain);
    // wire up the oscillator and gain nodes
    player.oscillator.connect(player.key);
    player.key.connect(player.limit);
    return player;
}

// translate text into keyed sidetone
function morse_code_output(context) {
    var output = {
	player : morse_code_player(context),
	table : morse_code_table(),
	wpm : 20,		// words per minute
	dit : 60.0 / (20 * 50),	// dit length is seconds
	dah : 3,		// dah length in dits
	ies : 1,		// interelement space in dits
	ils : 3,		// interletter space in dits
	iws : 7,		// interword space in dits
	setWPM : function(wpm) {
	    output.wpm = wpm || 20;
	    output.dit = 60.0 / (output.wpm * 50);
	},
	setPitch : function(hertz) { output.player.setPitch(hertz); },
	setGain : function(gain) { output.player.setGain(gain); },
	setOnTime : function(seconds) { output.player.setOnTime(seconds); },
	setOffTime : function(seconds) { output.player.setOffTime(seconds); },
	connect : function(target) { output.player.connect(target); },
	onAt : function(time) { output.player.onAt(time); },
	offAt : function(time) { output.player.offAt(time); },
	holdFor : function(seconds) { return output.player.holdFor(seconds); },
	getCursor : function() { return output.player.getCursor(); },
	cancel : function() { output.player.cancel(); },
	send : function(string) {
	    var code = output.table.encode(string);
	    var time = output.getCursor();
	    for (var i = 0; i < code.length; i += 1) {
		var c = code.charAt(i);
		if (c == '.' || c == '-') {
		    output.onAt(time);
		    time = output.holdFor((c == '.' ? 1 : output.dah) * output.dit);
		    output.offAt(time);
		    time = output.holdFor(output.ies * output.dit);
		} else if (c == ' ') {
		    if (i+2 < code.length && code.charAt(i+1) == ' ' && code.charAt(i+2) == ' ') {
			time = output.holdFor((output.iws-output.ies) * output.dit);
			i += 2;
		    } else {
			time = output.holdFor((output.ils-output.ies) * output.dit);
		    }
		}
	    }
	},
    };
    return output;
}

//
// translate keyed audio tone to keyup/keydown events
// this doesn't seem to work correctly at present.
// 
function morse_code_detone(context) {
    /*
    ** The Goertzel filter detects the power of a specified frequency
    ** very efficiently.
    **
    ** This is based on http://en.wikipedia.org/wiki/Goertzel_algorithm
    ** and the video presentation of CW mode for the NUE-PSK modem
    ** at TAPR DCC 2011 by George Heron N2APB and Dave Collins AD7JT.
    */
    var filter = {
	scriptNode : context.createScriptProcessor(1024, 1, 1),
	center : 600,
	bandwidth : 100,
	coeff : 0,
	s : new Float32Array(4),
	block_size : 0,
	i : 0,
	power : 0,
	setCenterAndBandwidth : function(center, bandwidth) {
	    if (center > 0 && center > context.sampleRate/4) {
		filter.center = center;
	    } else {
		filter.center = 600;
	    }
	    if (bandwidth > 0 && bandwidth > context.sampleRate/4) {
		filter.bandwidth = bandwidth;
	    } else {
		filter.bandwidth = 50;
	    }
	    filter.coeff = 2 * Math.cos(2*Math.PI*filter.center/context.sampleRate);
	    filter.block_size = context.sampleRate / filter.bandwidth;
	    filter.i = filter.block_size;
	    filter.s[0] = filter.s[1] = filter.s[3] = filter.s[4] = 0;
	},
	detone_process : function(x) {
	    filter.s[filter.i&3] = x + filter.coeff * filter.s[(filter.i+1)&3] - filter.s[(filter.i+2)&3];
	    if (--filter.i < 0) {
		filter.power = filter.s[1]*filter.s[1] + filter.s[0]*filter.s[0] - filter.coeff*filter.s[0]*filter.s[1];
		filter.i = filter.block_size;
		filter.s[0] = filter.s[1] = filter.s[2] = filter.s[3] = 0.0;
		return 1;
	    } else {
		return 0;
	    }
	},
	transitionConsumer : null,
	setTransitionConsumer : function(transitionConsumer) {
	    filter.transitionConsumer = transitionConsumer;
	},
	maxPower : 0,
	oldPower : 0,
	dtime : 0,
	onoff : 0,
	onAudioProcess : function(audioProcessingEvent) {
	    var inputBuffer = audioProcessingEvent.inputBuffer;
	    var outputBuffer = audioProcessingEvent.outputBuffer;
	    var inputData = inputBuffer.getChannelData(0);
	    var outputData = outputBuffer.getChannelData(0);
	    var time = audioProcessingEvent.playbackTime;
	    for (var sample = 0; sample < inputBuffer.length; sample++) {
		outputData[sample] = inputData[sample];
		if (filter.detone_process(inputData[sample])) {
		    if (filter.transitionConsumer) {
			filter.maxPower = Math.max(filter.power, filter.maxPower);
			if (filter.onoff == 0 && filter.oldPower < 0.6*filter.maxPower && filter.power > 0.6*filter.maxPower)
			    filter.transitionConsumer.transition(filter.onoff = 1, time);
			if (filter.onoff == 1 && filter.oldPower > 0.4*filter.maxPower && filter.power < 0.4*filter.maxPower)
			    filter.transitionConsumer.transition(filter.onoff = 0, time);
		    }
		}
		filter.oldPower = filter.power;
		time += filter.dtime;
	    }
	},
	connect : function(node) { filter.scriptNode.connect(node) },
	getTarget : function() { return filter.scriptNode; },
    };
    filter.dtime = 1.0 / context.sampleRate;
    filter.scriptNode.onaudioprocess = filter.onAudioProcess;
    return filter;
}

// translate keydown/keyup events to dit dah strings
function morse_code_detime(context) {
    /*
    ** from observations of on/off events
    ** deduce the CW timing of the morse being received
    ** and start translating the marks and spaces into
    ** dits, dahs, inter-symbol spaces, and inter-word spaces
    */
    var detimer = {
	wpm : 0,		/* float words per minute */
	word : 50,		/* float dits per word */
	estimate : 0,		/* float estimated dot clock period */
	time : 0,		/* float time of last event */
	n_dit : 1,		/* unsigned number of dits estimated */
	n_dah : 1,		/* unsigned number of dahs estimated */
	n_ies : 1,		/* unsigned number of inter-element spaces estimated */
	n_ils : 1,		/* unsigned number of inter-letter spaces estimated */
	n_iws : 1,		/* unsigned number of inter-word spaces estimated */

	configure : function(wpm, word) {
	    detimer.wpm = wpm > 0 ? wpm : 15;
	    detimer.word = 50;
	    detimer.estimate = (context.sampleRate * 60) / (detimer.wpm * detimer.word);
	},

	/*
	** The basic problem is to infer the dit clock rate from observations of dits,
	** dahs, inter-element spaces, inter-letter spaces, and maybe inter-word spaces.
	**
	** Assume that each element observed is either a dit or a dah and record its
	** contribution to the estimated dot clock as if it were both T and 3*T in length.
	** Similarly, take each space observed as potentially T, 3*T, and 7*T in length.
	**
	** But weight the T, 3*T, and 7*T observations by the inverse of their squared
	** distance from the current estimate, and weight the T, 3*T, and 7*T observations
	** by their observed frequency in morse code.
	**
	** Until detime has seen both dits and dahs, it may be a little confused.
	*/
	detime_process : function(onoff, time) {
	    time *= context.sampleRate;			/* convert seconds to frames */ 
	    var observation = time - detimer.time;	/* float length of observed element or space */
	    detimer.time = time;
	    if (onoff == 0) {				/* the end of a dit or a dah */
		var o_dit = observation;		/* float if it's a dit, then the length is the dit clock observation */
		var o_dah = observation / 3;		/* float if it's a dah, then the length/3 is the dit clock observation */
		var d_dit = o_dit - detimer.estimate;	/* float the dit distance from the current estimate */
		var d_dah = o_dah - detimer.estimate;	/* float the dah distance from the current estimate */
		if (d_dit == 0 || d_dah == 0) {
		    /* one of the observations is spot on, so 1/(d*d) will be infinite and the estimate is unchanged */
		} else {
		    /* the weight of an observation is the observed frequency of the element scaled by inverse of
		     * distance from our current estimate normalized to one over the observations made.
		     */
		    var w_dit = 1.0 * detimer.n_dit / (d_dit*d_dit); /* raw weight of dit observation */
		    var w_dah = 1.0 * detimer.n_dah / (d_dah*d_dah); /* raw weight of dah observation */
		    var wt = w_dit + w_dah;			     /* weight normalization */
		    var update = (o_dit * w_dit + o_dah * w_dah) / wt;
		    //console.log("o_dit="+o_dit+", w_dit="+w_dit+", o_dah="+o_dah+", w_dah="+w_dah+", wt="+wt);
		    //console.log("update="+update+", estimate="+detimer.estimate);
		    detimer.estimate += update;
		    detimer.estimate /= 2;
		    detimer.wpm = (context.sampleRate * 60) / (detimer.estimage * detimer.word);
		}
		var guess = 100 * observation / detimer.estimate;    /* make a guess */
		if (guess < 200) {
		    detimer.n_dit += 1; return '.';
		} else {
		    detimer.n_dah += 1; return '-';
		}
	    } else {					/* the end of an inter-element, inter-letter, or a longer space */
		var o_ies = observation;
		var o_ils = observation / 3;
		var d_ies = o_ies - detimer.estimate;
		var d_ils = o_ils - detimer.estimate;
		var guess = 100 * observation / detimer.estimate;
		if (d_ies == 0 || d_ils == 0) {
		    /* if one of the observations is spot on, then 1/(d*d) will be infinite and the estimate is unchanged */	    
		} else if (guess > 500) {
		    /* if it looks like a word space, it could be any length, don't worry about how long it is */
		} else {
		    var w_ies = 1.0 * detimer.n_ies / (d_ies*d_ies);
		    var w_ils = 1.0 * detimer.n_ils / (d_ils*d_ils);
		    var wt = w_ies + w_ils;
		    var update = (o_ies * w_ies + o_ils * w_ils) / wt;
		    //console.log("o_ies="+o_ies+", w_ies="+w_ies+", o_ils="+o_ils+", w_ils="+w_ils+", wt="+wt);
		    //console.log("update="+update+", estimate="+detimer.estimate);
		    detimer.estimate += update;
		    detimer.estimate /= 2;
		    detimer.wpm = (context.sampleRate * 60) / (detimer.estimage * detimer.word);
		    guess = 100 * observation / detimer.estimate;
		}
		if (guess < 200) {
		    detimer.n_ies += 1; return '';
		} else if (guess < 500) {
		    detimer.n_ils += 1; return ' ';
		} else {
		    detimer.n_iws += 1; return '\t';
		}
	    }
	},
	elementConsumer : null,
	setElementConsumer : function(elementConsumer) {
	    detimer.elementConsumer = elementConsumer;
	},
	element : function(element) {
	    if (detimer.elementConsumer) detimer.elementConsumer.element(element);
	},
	transition : function(onoff, time) {
	    detimer.element(detimer.detime_process(onoff, time));
	},
    }
    detimer.configure(15, 50);	// this is part suggestion (15 wpm) and part routine (50 dits/word is PARIS)
    return detimer;
}

// translate dit dah strings to text
function morse_code_decode(context) {
    var decoder = {
	table : null,
	elements : [],
	elementTimeout : null,
	elementTimeoutFun : function() {
	    decoder.elementTimeout = null;
	    if (decoder.elements.length > 0) {
		var code = decoder.elements.join('');
		decoder.letter(decoder.table.decode(code), code);
		decoder.elements = [];
	    }
	},
	element : function(elt) {
	    if (decoder.elementTimeout) {
		clearTimeout(decoder.elementTimeout);
		decoder.elementTimeout = null;
	    }
	    if (elt == '') {
		return;
	    }
	    if (elt == '.' || elt == '-') {
		decoder.elements.push(elt);
		decoder.elementTimeout = setTimeout(decoder.elementTimeoutFun, 250)
		return;
	    }
	    if (decoder.elements.length > 0) {
		var code = decoder.elements.join('');
		decoder.letter(decoder.table.decode(code), code);
		decoder.elements = [];
	    }
	    if (elt == '\t') {
		decoder.letter(' ', elt);
	    }
	},
	letterConsumer : null,
	setLetterConsumer : function(letterConsumer) {
	    decoder.letterConsumer = letterConsumer;
	},
	letter : function(ltr, code) {
	    if (decoder.letterConsumer) decoder.letterConsumer(ltr, code);
	    // console.log("letter('"+ltr+"', '"+code+"')");
	},
    };
    return decoder;
}

// translate iambic paddle events into keyup/keydown events
function morse_code_iambic_keyer(context) {
    /*
    ** This has been stripped down to the minimal iambic state machine
    ** from the AVR sources that accompany the article in QEX March/April
    ** 2012, and the length of the dah and inter-element-space has been
    ** made into configurable multiples of the dit clock.
    */
    /*
     * newkeyer.c  an electronic keyer with programmable outputs 
     * Copyright (C) 2012 Roger L. Traylor   
     * 
     * This program is free software: you can redistribute it and/or modify
     * it under the terms of the GNU General Public License as published by
     * the Free Software Foundation, either version 3 of the License, or
     * (at your option) any later version.
     * 
     * This program is distributed in the hope that it will be useful,
     * but WITHOUT ANY WARRANTY; without even the implied warranty of
     * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     * GNU General Public License for more details.
     * 
     * You should have received a copy of the GNU General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     */
    
    // newkeyer.c    
    // R. Traylor
    // 3.19.2012
    // iambic keyer      

    // keyer states
    var IDLE =     0;  // waiting for a paddle closure 
    var DIT =      1;  // making a dit 
    var DAH =      2;  // making a dah  
    var DIT_DLY =  3;  // intersymbol delay, one dot time
    var DAH_DLY =  4;  // intersymbol delay, one dot time

    // state variables
    var keyer_state = IDLE;	// the keyer state 
    var dit_pending = false;	// memory for dits  
    var dah_pending = false;	// memory for dahs  
    var timer = 0;		// seconds counting down

    // seconds per feature
    var _perDit = 0;
    var _perDah = 0;
    var _perIes = 0;

    // parameters
    var _swapped = false;	// true if paddles are swapped
    var _wpm = 20;		// words per minute
    var _dahLen = 3;		// dits per dah
    var _iesLen = 1;		// dits per space between dits and dahs

    // update the clock computations
    function update() {
	// second timing
	_perDit = 60.0 / (_wpm * 50);
	_perDah = _perDit * _dahLen;
	_perIes = _perDit * _iesLen;
    }

    var keyer = {
	clock : function(raw_dit_on, raw_dah_on, ticks) {
	    var dit_on = _swapped ? raw_dah_on : raw_dit_on;
	    var dah_on = _swapped ? raw_dit_on : raw_dah_on;
	    var key_out = false;

	    // update timer
	    timer -= ticks;
	    var timer_expired = timer <= 0;

	    // keyer state machine   
	    if (keyer_state == IDLE) {
		key_out = false;
		if (dit_on) {
		    timer = _perDit; keyer_state = DIT;
		} else if (dah_on) {
		    timer = _perDah; keyer_state = DAH;
		}
	    } else if (keyer_state == DIT) {
		key_out = true; 
		if ( timer_expired ) {
		    timer = _perIes; keyer_state = DIT_DLY;
		}
	    } else if (keyer_state == DAH) {
		key_out = true; 
		if ( timer_expired ) {
		    timer = _perIes; keyer_state = DAH_DLY;
		}
	    } else if (keyer_state == DIT_DLY) {
		key_out = false;  
		if ( timer_expired ) {
		    if ( dah_pending ) {
			timer = _perDah; keyer_state = DAH;
		    } else {
			keyer_state = IDLE;
		    }
		}
	    } else if (keyer_state == DAH_DLY) {
		key_out = false; 
		if ( timer_expired ) {
		    if ( dit_pending ) {
			timer = _perDit; keyer_state = DIT;
		    } else {
			keyer_state = IDLE;
		    }
		}
	    }
	    
	    //*****************  dit pending state machine   *********************
	    dit_pending = dit_pending ?
		keyer_state != DIT :
		(dit_on && ((keyer_state == DAH && timer < _perDah/3) ||
			    (keyer_state == DAH_DLY && timer > _perIes/2)));
            
	    //******************  dah pending state machine   *********************
	    dah_pending = dah_pending ?
		keyer_state != DAH :
		(dah_on && ((keyer_state == DIT && timer < _perDit/2) ||
			    (keyer_state == DIT_DLY && timer > _perIes/2)));
	    
	    return key_out;
	},
	// set the words per minute generated
	setWpm : function(wpm) { _wpm = wpm; update(); },
	getWpm : function() { return _wpm; },
	// swap the dit and dah paddles
	setSwapped : function(swapped) { _swapped = swapped; },
	getSwapped : function() { return _swapped; },
	// set the dah length in dits
	setDah : function(dahLen) { _dahLen = dahLen; update(); },
	getDah : function() { return _dahLen; },
	// set the inter-element length in dits
	setIes : function (iesLen) { _iesLen = iesLen; update(); },
	getIes : function() { return _iesLen; }
    };
    _wpm = 20;
    _swapped = false;
    _dahLen = 3;
    _iesLen = 1;
    update();
    return keyer;
}

function morse_code_straight_input(context) {
    var straight = {
	player : morse_code_player(context),
	setPitch : function(hertz) { straight.player.setPitch(hertz); },
	setGain : function(gain) { straight.player.setGain(gain); },
	setOnTime : function(seconds) { straight.player.setOnTime(seconds); },
	setOffTime : function(seconds) { straight.player.setOffTime(seconds); },
	connect : function(target) { straight.player.connect(target); },
	isOn : false,
	on : function() {
	    if ( ! straight.isOn) {
		straight.player.onAt(straight.player.getCursor());
		straight.isOn = true;
	    }
	},
	off : function() {
	    if (straight.isOn) {
		straight.player.offAt(straight.player.getCursor());
		straight.isOn = false;
	    }
	},
	raw_key_on : false,
	onFocus : function() {
	    // console.log("straightFocus()");
	},
	onBlur : function() {
	    // console.log("straightBlur()");
	    if (straight.raw_key_on) {
		straight.raw_key_on = false;
		straight.off();
	    }
	},
	onKeydown : function(event) {
	    straight.raw_key_on = true;
	    straight.on();
	},
	onKeyup : function(event) {
	    straight.raw_key_on = false;
	    straight.off();
	},
    };
    return straight;
}

function morse_code_iambic_input(context) {
    var iambic = {
	player : morse_code_player(context),
	keyer : morse_code_iambic_keyer(context),
	setPitch : function(hertz) { iambic.player.setPitch(hertz); },
	setGain : function(gain) { iambic.player.setGain(gain); },
	setOnTime : function(seconds) { iambic.player.setOnTime(seconds); },
	setOffTime : function(seconds) { iambic.player.setOffTime(seconds); },
	connect : function(target) { iambic.player.connect(target); },
	setWPM : function(wpm) { iambic.keyer.setWpm(wpm); },
	setDah : function(dah) { iambic.keyer.setDah(dah); },
	setIes : function(ies) { iambic.keyer.setIes(ies); },

	isOn : false,
	on : function() {
	    if ( ! iambic.isOn) {
		iambic.player.onAt(iambic.player.getCursor());
		iambic.isOn = true;
	    }
	},
	off : function() {
	    if (iambic.isOn) {
		iambic.player.offAt(iambic.player.getCursor());
		iambic.isOn = false;
	    }
	},
	raw_dit_on : false,
	raw_dah_on : false,
	onFocus : function() {
	    iambic.start();
	},
	onBlur : function() {
	    iambic.stop();
	    iambic.raw_dit_on = false;
	    iambic.raw_dah_on = false;
	    iambic.player.cancel();
	    iambic.off();
	},
	onKeydown : function(event) {
	    var key = event.keyCode || event.which;
	    if ((key&1)==0) iambic.raw_dit_on = true;
	    else iambic.raw_dah_on = true;
	},
	onKeyup : function(event) {
	    var key = event.keyCode || event.which;
	    if ((key&1)==0) iambic.raw_dit_on = false;
	    else iambic.raw_dah_on = false;
	},
	intervalLast : context.currentTime,
	intervalFunction : function() {
	    var time = context.currentTime;
	    var tick = time - iambic.intervalLast;
	    iambic.intervalLength = (iambic.intervalLength + tick) / 2;
	    iambic.intervalLast = time;
	    if (iambic.isOn != iambic.keyer.clock(iambic.raw_dit_on, iambic.raw_dah_on, tick)) {
		if (iambic.isOn) { iambic.off(); } else { iambic.on(); }
	    }
	},
	interval : null,
	start : function() {
	    if (iambic.interval) {
		iambic.stop();
	    }
	    iambic.interval = setInterval(iambic.intervalFunction, 1);
	},
	stop : function() {
	    if (iambic.interval) {
		iambic.off();
		clearInterval(iambic.interval);
		iambic.interval = null;
	    }
	}
    };
    return iambic;
}

// translate keyup/keydown into keyed oscillator sidetone
function morse_code_input(context) {
    var input = {
	straight : morse_code_straight_input(context),
	iambic : morse_code_iambic_input(context),
	connect : function(target) {
	    input.straight.connect(target);
	    input.iambic.connect(target);
	},
    };
    return input;
}

// combine inputs and outputs
function morse_code_station() {
    var context = new (window.AudioContext || window.webkitAudioContext)();

    var station = {
	output : morse_code_output(context),
	output_detimer : morse_code_detime(context),
	output_decoder : morse_code_decode(context),
	input : morse_code_input(context),
	input_detimer : morse_code_detime(context),
	input_decoder : morse_code_decode(context),
    };

    station.output.connect(context.destination);
    station.output.player.setTransitionConsumer(station.output_detimer);

    station.output_detimer.setElementConsumer(station.output_decoder);

    station.input.connect(context.destination);

    station.input.straight.player.setTransitionConsumer(station.input_detimer);
    station.input.iambic.player.setTransitionConsumer(station.input_detimer);

    station.input_detimer.setElementConsumer(station.input_decoder);

    var table = station.output.table;
    station.output_decoder.table = table;
    station.input_decoder.table = table;

    return station;
}
