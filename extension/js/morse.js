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

(function() {
    var root = this;
    var morse = {};
    // translate text into dit/dah strings
    morse.table = function(name) {
        // object defining a morse code translation
        var self = {
	        // the name of the encoding currently in use
	        name: null,
	        // the object dictionary table used for encoding
	        code: null,
	        // the object dictionary used to transliterate into roman
	        trans: null,
	        // the object dictionary used to decode morse back to unicode
	        invert: null,
	        // the object dictionary of dit lengths for each character
	        dits: null,
	        // encode the string into dit, dah, and space
	        // dit is a period, dah is a hyphen, space is a space that represents
	        // a nominal 2 dit clocks of space which is added to the 1 dit clock of space
	        // that terminates each dit or dah.
	        encode: function(string) {
	            var result = [];
	            if (string && self.code) {
		            for (var i = 0; i < string.length; i += 1) {
		                var c = string.charAt(i).toUpperCase();
		                if (self.code[c]) {
			                result.push(self.code[c]);
			                result.push(' ')
		                } else if (c == ' ') {
			                result.push('  ');
		                }
		            }
	            }
	            return result.join('');
	        },
	        decode : function(string) {
	            return self.invert[string];
	        },
	        // take a string in arabic, cyrillic, farsi, greek, hebrew, or wabun and transliterate into roman
	        transliterate: function(string) {
	            var result = [];
	            if (self.trans) {
		            for (var i = 0; i < string.length; i += 1) {
		                var c = string.charAt(i).toUpperCase();
		                if (self.trans[c]) {
			                result += self.trans[c];
		                } else if (c == ' ') {
			                result.push(' ');
		                }
		            }
	            } else {
		            result.push(string);
	            }
	            return result.join('');
	        },
	        // compute the dit length of a string
	        ditLength : function(string) {
	            var result = 0;
	            if (self.dits) {
		            for (var i = 0; i < string.length; i += 1) {
		                var c = string.charAt(i).toUpperCase();
		                if (self.code[c]) {
			                result += self.dits[c];
			                result += 2;
		                } else if (c == ' ') {
			                result += 4;
		                }
		            }
	            }
	            return result;
	        },
	        // select the code to use
	        setName: function(name) {
	            if (self.name != name) {
		            if (self.codes[name]) {
		                self.name = name;
		                self.code = self.codes[name];
		                self.trans = self.transliterations[name];
		                self.invert = {};
		                self.dits = {}
		                // there is a problem with multiple translations
                        // because some morse codes get used for more than one character
                        // ignored for now
		                for (var i in self.code) {
			                var code = self.code[i];
			                self.invert[code] = i; // deal with multiple letters sharing codes
			                self.dits[i] = 0
			                for (var j = 0; j < code.length; j += 1) {
			                    var c = code.charAt(j);
			                    if (c == '.') self.dits[i] += 2;
			                    else self.dits[i] += 4;
			                }
		                }
		            }
	            }
	        },
	        // return the list of valid name for codes
	        getNames: function() {
	            var names = [];
	            for (var i in self.codes) names.push(i);
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
	            // three prosigns assigned to ascii punctuation '!' : '...-.', '%' : '.-...', '*' : '...-.-'
	            // common latin extensions, some shared codes 'À' : '.--.-', 'Á' : '.--.-', 'Â' : '.--.-', 'Ä' : '.-.-', 'Ç' : '----', 'È' : '..-..', 'É' : '..-..', 'Ñ' : '--.--', 'Ö' : '---.', 'Ü' : '..--',
	            // other latin extensions exist
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
        self.setName(name || 'itu');
        return self;
    }

    morse.event = function() {
	    var self = {
	        /**
	         * events: installed event handlers
	         */
	        events : {},
	        /**
	         *  on: listen to events
	         */
	        on : function(type, func, ctx) {
		        (self.events[type] = self.events[type] || []).push({f:func, c:ctx})
	        },
	        /**
	         *  Off: stop listening to event / specific callback
	         */
	        off : function(type, func) {
		        type || (self.events = {})
		        var list = self.events[type] || [],
		        i = list.length = func ? list.length : 0
		        while(i-->0) func == list[i].f && list.splice(i,1)
	        },
	        /**
	         * Emit: send event, callbacks will be triggered
	         */
	        emit : function(){
		        var args = Array.apply([], arguments), list = self.events[args.shift()] || [], i=0, j;
		        while (j=list[i++]) j.f.apply(j.c, args)
	        },
	        events : {},
	    };
        return self;
    };

    // translate keyup/keydown into keyed sidetone
    morse.player = function(context) {
        // extend event
        var self = morse.event();
        // add an oscillator
        self.oscillator = context.createOscillator();
        // and a keying envelope
	    self.key = context.createGain();
        // the pitch of the oscillator
        Object.defineProperty(self, "pitch", {
            set : function(hertz) { self.oscillator.frequency.value = hertz; },
            get : function() { return self.oscillator.frequency.value; },
        });
	    self.pitch = 600;
        // the maximum gain of the envelope
        Object.defineProperty(self, "gain", {
            set : function(gain) { self.ramp_max = Math.min(Math.max(gain, 0.001), 1.0); }
        });
	    self.gain = 0.05;
        // the rise time of the envelope
        Object.defineProperty(self, "rise", {
            set : function(seconds) { self.ramp_rise = seconds || 0.004; }
        });
	    self.rise = 0.004;
        // the fall time of the envelope
        Object.defineProperty(self, "fall", {
            set : function(seconds) { self.ramp_fall = seconds || 0.004; }
        });
	    self.fall = 0.004;
        // where we are in the sample time stream
        Object.defineProperty(self, "cursor", {
            set : function(seconds) { self.curpos = seconds; },
            get : function() { return self.curpos = Math.max(self.curpos, context.currentTime); },
        });
	    self.cursor = 0;		// next time
        // connect our output samples to somewhere
	    self.connect = function(target) { self.key.connect(target); };
        // turn the key on now
	    self.keyOn = function() {
	        self.cancel();
	        self.keyOnAt(context.currentTime);
	    };
        // turn the key off now
	    self.keyOff = function() {
	        self.cancel();
	        self.offAt(context.currentTime);
	    };
        // schedule the key on at time
	    self.keyOnAt = function(time) {
	        self.key.gain.setValueAtTime(0.0, time);
	        self.key.gain.linearRampToValueAtTime(self.ramp_max, time+self.ramp_rise);
	        self.cursor = time;
	        self.emit('transition', 1, time);
	    };
        // schedule the key off at time
	    self.keyOffAt = function(time) {
	        self.key.gain.setValueAtTime(self.ramp_max, time);
	        self.key.gain.linearRampToValueAtTime(0.0, time+self.ramp_fall);
	        self.cursor = time;
	        self.emit('transition', 0, time);
	    };
        // hold the last scheduled key state for seconds
	    self.keyHoldFor = function(seconds) { return self.cursor += seconds; };
        // cancel all scheduled key transitions
	    self.cancel = function() {
	        self.key.gain.cancelScheduledValues(self.cursor = context.currentTime);
	        self.key.gain.value = 0;
	    };
        // initialize the oscillator
        self.oscillator.type = 'sine';
        self.oscillator.start();
        // initialize the gain
        self.key.gain.value = 0;
        self.oscillator.connect(self.key);
        return self;
    };

    // translate text into keyed sidetone
    morse.output = function(context) {
        var self = morse.player(context);
	    self.table = morse.table();
        Object.defineProperty(self, "wpm", {
            set : function(wpm) {
                wpm = Math.max(5, Math.min(100, wpm));
                self.dit = 60.0 / (wpm * 50);
            },
            get : function() { return 60 / (self.dit * 50); }
        });
	    self.wpm = 20;		// words per minute
	    self.dah = 3;		// dah length in dits
	    self.ies = 1;		// interelement space in dits
	    self.ils = 3;		// interletter space in dits
	    self.iws = 7.		// interword space in dits
	    self.send = function(string) {
	        var code = self.table.encode(string);
	        var time = self.cursor;
	        for (var i = 0; i < code.length; i += 1) {
		        var c = code.charAt(i);
		        if (c == '.' || c == '-') {
		            self.keyOnAt(time);
		            time = self.keyHoldFor((c == '.' ? 1 : self.dah) * self.dit);
		            self.keyOffAt(time);
		            time = self.keyHoldFor(self.ies * self.dit);
		        } else if (c == ' ') {
		            if (i+2 < code.length && code.charAt(i+1) == ' ' && code.charAt(i+2) == ' ') {
			            time = self.keyHoldFor((self.iws-self.ies) * self.dit);
			            i += 2;
		            } else {
			            time = self.keyHoldFor((self.ils-self.ies) * self.dit);
		            }
		        }
	        }
	    };
        return self;
    };

    //
    // translate keyed audio tone to keyup/keydown events
    // this doesn't seem to work correctly at present.
    //
    morse.detone = function(context) {
        /*
        ** The Goertzel filter detects the power of a specified frequency
        ** very efficiently.
        **
        ** This is based on http://en.wikipedia.org/wiki/Goertzel_algorithm
        ** and the video presentation of CW mode for the NUE-PSK modem
        ** at TAPR DCC 2011 by George Heron N2APB and Dave Collins AD7JT.
        */
        var self = {
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
		            self.center = center;
	            } else {
		            self.center = 600;
	            }
	            if (bandwidth > 0 && bandwidth > context.sampleRate/4) {
		            self.bandwidth = bandwidth;
	            } else {
		            self.bandwidth = 50;
	            }
	            self.coeff = 2 * Math.cos(2*Math.PI*self.center/context.sampleRate);
	            self.block_size = context.sampleRate / self.bandwidth;
	            self.i = self.block_size;
	            self.s[0] = self.s[1] = self.s[3] = self.s[4] = 0;
	        },
	        detone_process : function(x) {
	            self.s[self.i&3] = x + self.coeff * self.s[(self.i+1)&3] - self.s[(self.i+2)&3];
	            if (--self.i < 0) {
		            self.power = self.s[1]*self.s[1] + self.s[0]*self.s[0] - self.coeff*self.s[0]*self.s[1];
		            self.i = self.block_size;
		            self.s[0] = self.s[1] = self.s[2] = self.s[3] = 0.0;
		            return 1;
	            } else {
		            return 0;
	            }
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
		            if (self.detone_process(inputData[sample])) {
		                self.maxPower = Math.max(self.power, self.maxPower);
		                if (self.onoff == 0 && self.oldPower < 0.6*self.maxPower && self.power > 0.6*self.maxPower)
			                self.emit('transition', self.onoff = 1, time);
		                if (self.onoff == 1 && self.oldPower > 0.4*self.maxPower && self.power < 0.4*self.maxPower)
			                self.emit('transition', self.onoff = 0, time);
		            }
		            self.oldPower = self.power;
		            time += self.dtime;
	            }
	        },
	        connect : function(node) { self.scriptNode.connect(node) },
	        getTarget : function() { return self.scriptNode; },
	        // event handling
	        events : {},
	        on : function(type, func, ctx) {
	            (self.events[type] = self.events[type] || []).push({f:func, c:ctx})
	        },
	        off : function(type, func) {
	            type || (self.events = {})
	            var list = self.events[type] || [],
	            i = list.length = func ? list.length : 0
	            while(i-->0) func == list[i].f && list.splice(i,1)
	        },
	        emit : function(){
	            var args = Array.apply([], arguments), list = self.events[args.shift()] || [], i=0, j;
	            while (j=list[i++]) j.f.apply(j.c, args);
	        },
        };
        self.dtime = 1.0 / context.sampleRate;
        self.scriptNode.onaudioprocess = self.onAudioProcess;
        return self;
    }

    // translate keydown/keyup events to dit dah strings
    morse.detime = function(context) {
        /*
        ** from observations of on/off events
        ** deduce the CW timing of the morse being received
        ** and start translating the marks and spaces into
        ** dits, dahs, inter-symbol spaces, and inter-word spaces
        */
        var self = {
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
	            self.wpm = wpm > 0 ? wpm : 15;
	            self.word = 50;
	            self.estimate = (context.sampleRate * 60) / (self.wpm * self.word);
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
	            var observation = time - self.time;	/* float length of observed element or space */
	            self.time = time;
	            if (onoff == 0) {				/* the end of a dit or a dah */
		            var o_dit = observation;		/* float if it's a dit, then the length is the dit clock observation */
		            var o_dah = observation / 3;		/* float if it's a dah, then the length/3 is the dit clock observation */
		            var d_dit = o_dit - self.estimate;	/* float the dit distance from the current estimate */
		            var d_dah = o_dah - self.estimate;	/* float the dah distance from the current estimate */
		            if (d_dit == 0 || d_dah == 0) {
		                /* one of the observations is spot on, so 1/(d*d) will be infinite and the estimate is unchanged */
		            } else {
		                /* the weight of an observation is the observed frequency of the element scaled by inverse of
		                 * distance from our current estimate normalized to one over the observations made.
		                 */
		                var w_dit = 1.0 * self.n_dit / (d_dit*d_dit); /* raw weight of dit observation */
		                var w_dah = 1.0 * self.n_dah / (d_dah*d_dah); /* raw weight of dah observation */
		                var wt = w_dit + w_dah;			     /* weight normalization */
		                var update = (o_dit * w_dit + o_dah * w_dah) / wt;
		                //console.log("o_dit="+o_dit+", w_dit="+w_dit+", o_dah="+o_dah+", w_dah="+w_dah+", wt="+wt);
		                //console.log("update="+update+", estimate="+self.estimate);
		                self.estimate += update;
		                self.estimate /= 2;
		                self.wpm = (context.sampleRate * 60) / (self.estimage * self.word);
		            }
		            var guess = 100 * observation / self.estimate;    /* make a guess */
		            if (guess < 200) {
		                self.n_dit += 1; return '.';
		            } else {
		                self.n_dah += 1; return '-';
		            }
	            } else {					/* the end of an inter-element, inter-letter, or a longer space */
		            var o_ies = observation;
		            var o_ils = observation / 3;
		            var d_ies = o_ies - self.estimate;
		            var d_ils = o_ils - self.estimate;
		            var guess = 100 * observation / self.estimate;
		            if (d_ies == 0 || d_ils == 0) {
		                /* if one of the observations is spot on, then 1/(d*d) will be infinite and the estimate is unchanged */
		            } else if (guess > 500) {
		                /* if it looks like a word space, it could be any length, don't worry about how long it is */
		            } else {
		                var w_ies = 1.0 * self.n_ies / (d_ies*d_ies);
		                var w_ils = 1.0 * self.n_ils / (d_ils*d_ils);
		                var wt = w_ies + w_ils;
		                var update = (o_ies * w_ies + o_ils * w_ils) / wt;
		                //console.log("o_ies="+o_ies+", w_ies="+w_ies+", o_ils="+o_ils+", w_ils="+w_ils+", wt="+wt);
		                //console.log("update="+update+", estimate="+self.estimate);
		                self.estimate += update;
		                self.estimate /= 2;
		                self.wpm = (context.sampleRate * 60) / (self.estimage * self.word);
		                guess = 100 * observation / self.estimate;
		            }
		            if (guess < 200) {
		                self.n_ies += 1; return '';
		            } else if (guess < 500) {
		                self.n_ils += 1; return ' ';
		            } else {
		                self.n_iws += 1; return '\t';
		            }
	            }
	        },
	        // event handler
	        ontransition : function(onoff, time) { self.emit('element', self.detime_process(onoff, time), time); },
	        // event management
	        events : {},
	        on : function(type, func, ctx) {
	            (self.events[type] = self.events[type] || []).push({f:func, c:ctx})
	        },
	        off : function(type, func) {
	            type || (self.events = {})
	            var list = self.events[type] || [],
	            i = list.length = func ? list.length : 0
	            while(i-->0) func == list[i].f && list.splice(i,1)
	        },
	        emit : function(){
	            var args = Array.apply([], arguments), list = self.events[args.shift()] || [], i=0, j;
	            while (j=list[i++]) j.f.apply(j.c, args);
	        },
        }
        self.configure(15, 50);	// this is part suggestion (15 wpm) and part routine (50 dits/word is PARIS)
        return self;
    }

    // translate dit dah strings to text
    morse.decode = function(context) {
        var self = {
	        table : null,
	        elements : [],
	        elementTimeout : null,
	        elementTimeoutFun : function() {
	            self.elementTimeout = null;
	            if (self.elements.length > 0) {
		            var code = self.elements.join('');
		            self.emit('letter', self.table.decode(code) || '\u25a1', code);
		            self.elements = [];
	            }
	        },
	        onelement : function(elt, timeEnded) {
	            if (self.elementTimeout) {
		            clearTimeout(self.elementTimeout);
		            self.elementTimeout = null;
	            }
	            if (elt == '') {
		            return;
	            }
	            if (elt == '.' || elt == '-') {
		            self.elements.push(elt);
		            self.elementTimeout = setTimeout(self.elementTimeoutFun, 1000*(timeEnded-context.currentTime)+250)
		            return;
	            }
	            if (self.elements.length > 0) {
		            var code = self.elements.join('');
		            self.emit('letter', self.table.decode(code)  || '\u25a1', code);
		            self.elements = [];
	            }
	            if (elt == '\t') {
		            self.emit('letter', ' ', elt);
	            }
	        },
	        // event handling
	        events : {},
	        on : function(type, func, ctx) {
	            (self.events[type] = self.events[type] || []).push({f:func, c:ctx})
	        },
	        off : function(type, func) {
	            type || (self.events = {})
	            var list = self.events[type] || [],
	            i = list.length = func ? list.length : 0
	            while(i-->0) func == list[i].f && list.splice(i,1)
	        },
	        emit : function(){
	            var args = Array.apply([], arguments), list = self.events[args.shift()] || [], i=0, j;
	            while (j=list[i++]) j.f.apply(j.c, args);
	        },
        };
        return self;
    }

    // translate iambic paddle events into keyup/keydown events
    morse.iambic_keyer = function(player) {
        /*
        ** This has been stripped down to the minimal iambic state machine
        ** from the AVR sources that accompany the article in QEX March/April
        ** 2012, and the length of the dah and inter-element-space has been
        ** made into configurable multiples of the dit clock.
        **
        ** And then,
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
        var DIT =      1;  // making a dit or the space after
        var DAH =      2;  // making a dah or the space after

        // state variables
        var keyer_state = IDLE;	// the keyer state
        var dit_pending = false;	// memory for dit seen while playing a dah
        var dah_pending = false;	// memory for dah seen while playing a dit
        var timer = 0;		// seconds counting down to next decision

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
        // for reference a dit is
        //		80ms at 15wpm
        //		60ms at 20wpm
        //		48ms at 25wpm
        //		40ms at 30wpm
        //		30ms at 40wpm
        //		24ms at 50wpm
        function update() {
	        // second timing
	        _perDit = 60.0 / (_wpm * 50);
	        _perDah = _perDit * _dahLen;
	        _perIes = _perDit * _iesLen;
        }

        function transition(state, len) {
	        // mark the new state
	        keyer_state = state;
	        // reset the timer
	        if (timer < 0) timer = 0;
	        timer += len+_perIes;
	        // sound the element
	        var time = player.cursor;
	        player.keyOnAt(time);
	        player.keyOffAt(time+len);
	        player.keyHoldFor(_perIes);
        }

        function make_dit() { transition(DIT, _perDit); }
        function make_dah() { transition(DAH, _perDah); }
        var self = {
	        clock : function(raw_dit_on, raw_dah_on, ticks) {
	            var dit_on = _swapped ? raw_dah_on : raw_dit_on;
	            var dah_on = _swapped ? raw_dit_on : raw_dah_on;

	            // update timer
	            timer -= ticks;

	            // keyer state machine
	            if (keyer_state == IDLE) {
		            if (dit_on) make_dit();
		            else if (dah_on) make_dah();
	            } else if ( timer <= _perIes/2 ) {
		            if (keyer_state == DIT) {
		                if ( dah_pending || dah_on ) make_dah();
		                else if (dit_on) make_dit();
		                else keyer_state = IDLE;
		            } else if (keyer_state == DAH) {
		                if ( dit_pending || dit_on ) make_dit();
		                else if (dah_on) make_dah();
		                else keyer_state = IDLE;
		            }
	            }

	            //*****************  dit pending state machine   *********************
	            dit_pending = dit_pending ?
		            keyer_state != DIT :
		            (dit_on && keyer_state == DAH && timer < _perDah/3+_perIes);

	            //******************  dah pending state machine   *********************
	            dah_pending = dah_pending ?
		            keyer_state != DAH :
		            (dah_on && keyer_state == DIT && timer < _perDit/2+_perIes);

	        },
	        // swap the dit and dah paddles
	        setSwapped : function(swapped) { _swapped = swapped; },
	        getSwapped : function() { return _swapped; },
	        // set the words per minute generated
	        setWpm : function(wpm) { _wpm = wpm; update(); },
	        getWpm : function() { return _wpm; },
	        // set the dah length in dits
	        setDah : function(dahLen) { _dahLen = dahLen; update(); },
	        getDah : function() { return _dahLen; },
	        // set the inter-element length in dits
	        setIes : function (iesLen) { _iesLen = iesLen; update(); },
	        getIes : function() { return _iesLen; }
        };
        update();
        return self;
    }

    morse.straight_input = function(context) {
        var self = {
	        player : morse.player(context),
	        setPitch : function(hertz) { self.player.pitch = hertz; },
	        setGain : function(gain) { self.player.gain = gain; },
	        setOnTime : function(seconds) { self.player.rise = (seconds); },
	        setOffTime : function(seconds) { self.player.fall = (seconds); },
	        connect : function(target) { self.player.connect(target); },
	        raw_key_on : false,
	        isOn : false,
	        keyOn : function() {
	            self.raw_key_on = true;
	            if ( ! self.isOn) {
		            self.player.keyOnAt(self.player.cursor);
		            self.isOn = true;
	            }
	        },
	        keyOff : function() {
	            self.raw_key_on = false;
	            if (self.isOn) {
		            self.player.keyOffAt(self.player.cursor);
		            self.isOn = false;
	            }
	        },
            //
            keydown : function(key) { self.keyOn(); },
            keyup : function(key) { self.keyOff(); },
            //
	        onfocus : function() { },
	        onblur : function() { self.keyOff(); },
	        // handlers for MIDI
	        onmidievent : function(event) {
	            if (event.data.length == 3) {
		            // console.log("onmidievent "+event.data[0]+" "+event.data[1]+" "+event.data[2].toString(16));
		            switch (event.data[0]&0xF0) {
		            case 0x90: self.keyon(); break;
		            case 0x80: self.keyOff(); break;
		            }
	            }
	        },
        };
        return self;
    }

    morse.iambic_input = function(context) {
        var self = {
	        player : morse.player(context),
	        keyer : null,
	        setPitch : function(hertz) { self.player.pitch = hertz; },
	        setGain : function(gain) { self.player.gain = gain; },
	        setOnTime : function(seconds) { self.player.rise = (seconds); },
	        setOffTime : function(seconds) { self.player.fall = (seconds); },
	        setWPM : function(wpm) { self.keyer.setWpm(wpm); },
	        setDah : function(dah) { self.keyer.setDah(dah); },
	        setIes : function(ies) { self.keyer.setIes(ies); },
	        setSwapped : function(swapped) { self.keyer.setSwapped(swapped); },
	        connect : function(target) { self.player.connect(target); },

	        raw_dit_on : false,
	        raw_dah_on : false,
	        // handlers for focus
	        onfocus : function() { self.start(); },
	        onblur : function() { self.stop(); },
	        // handlers for MIDI
	        onmidievent : function(event) {
	            if (event.data.length == 3) {
		            // console.log("onmidievent "+event.data[0]+" "+event.data[1]+" "+event.data[2].toString(16));
		            switch (event.data[0]&0xF0) {
		            case 0x90: self.keydown(event.data[1]&1); break;
		            case 0x80: self.keyup(event.data[1]&1); break;
		            }
	            }
	        },
	        // common handlers
	        keydown : function(key) {
	            if (key) self.raw_dit_on = true; else self.raw_dah_on = true;
	            self.intervalFunction();
	        },
	        keyup : function(key) {
	            if (key) self.raw_dit_on = false; else self.raw_dah_on = false;
	            self.intervalFunction();
	        },
	        intervalLast : context.currentTime,
	        intervalFunction : function() {
	            var time = context.currentTime;
	            var tick = time - self.intervalLast;
	            self.intervalLength = (self.intervalLength + tick) / 2;
	            self.intervalLast = time;
	            self.keyer.clock(self.raw_dit_on, self.raw_dah_on, tick);
	        },
	        interval : null,
	        start : function() {
	            if (self.interval) {
		            self.stop();
	            }
	            self.interval = setInterval(self.intervalFunction, 1);
	        },
	        stop : function() {
	            if (self.interval) {
		            clearInterval(self.interval);
		            self.interval = null;
	            }
	            self.raw_dit_on = false;
	            self.raw_dah_on = false;
	            self.player.cancel();
	        }
        };
        self.keyer = morse.iambic_keyer(self.player);
        return self;
    }

    /*
    ** The MIDI interface may need to be enabled in chrome://flags,
    ** but even then it may not implement everything needed.
    **
    ** This mostly works in chrome-unstable as of 2015-04-16, Version 43.0.2357.18 dev (64-bit).
    ** but
    **  1) does not detect hot plugged MIDI devices, only those that are present when
    **  chrome is launched; or maybe it does, but not reliably;
    **  2) the supplied event timestamp has no value;
    **  3) the list of MIDI devices may become stale, ie they're there, they worked once, but they
    **  don't work now even though the browser continues to list them;
    */
    morse.midi_input = function() {
        var self = {
	        midiOptions : { },
	        midi : null,  // global MIDIAccess object
	        onMIDIMessage : function ( event ) {
	            var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
	            for (var i=0; i<event.data.length; i++) {
		            str += "0x" + event.data[i].toString(16) + " ";
	            }
	            console.log( str );
	        },
	        onMIDISuccess : function( midiAccess ) {
	            // console.log( "MIDI ready!" );
	            self.midi = midiAccess;
	        },
	        onMIDIFailure : function(msg) {
	            // console.log( "Failed to get MIDI access - " + msg );
	        },
	        names : function() {
	            var names = [];
	            if (self.midi)
		            for (var x of self.midi.inputs.values())
		                names.push(x.name);
	            return names;
	        },
	        connect : function(name, handler) {
	            if (self.midi) {
		            for (var x of self.midi.inputs.values()) {
		                if (x.name == name) {
			                x.onmidimessage = handler;
			                // console.log("installing handler for "+name);
		                }
		            }
	            }
	        },
	        disconnect : function(name) {
	            if (self.midi) {
		            for (var x of self.midi.inputs.values()) {
		                if (x.name == name) {
			                // console.log("uninstalling handler for "+name);
			                x.onmidimessage = null;
		                }
		            }
	            }
	        },
        };
        if (navigator.requestMIDIAccess) {
	        navigator.requestMIDIAccess().then( self.onMIDISuccess, self.onMIDIFailure );
        } else {
	        console.log("no navigator.requestMIDIAccess found");
        }
        return self;
    }

    // translate keyup/keydown into keyed oscillator sidetone
    morse.input = function(context) {
        var self = {
	        straight : morse.straight_input(context),
	        iambic : morse.iambic_input(context),
            pitch : 0,
	        setPitch : function(hertz) {
	            self.straight.setPitch(hertz);
	            self.iambic.setPitch(hertz);
                self.pitch = hertz;
	        },
            gain : 0,
	        setGain : function(gain) {
	            self.straight.setGain(gain);
	            self.iambic.setGain(gain);
                self.gain = gain;
	        },
            onTime : 0,
	        setOnTime : function(seconds) {
	            self.straight.setOnTime(seconds);
	            self.iambic.setOnTime(seconds);
                self.onTime = seconds;
	        },
            offtime : 0,
	        setOffTime : function(seconds) {
	            self.straight.setOffTime(seconds);
	            self.iambic.setOffTime(seconds);
                self.offTime = seconds;
	        },
            wpm : 0,
	        setWPM : function(wpm) {
                self.iambic.setWPM(wpm);
                self.wpm = wpm;
            },
            dah : 0,
	        setDah : function(dah) {
                self.iambic.setDah(dah);
                self.dah = dah;
            },
            ies : 0,
	        setIes : function(ies) {
                self.iambic.setIes(ies);
                self.ies = ies;
            },
            swapped : 0,
	        setSwapped : function(swapped) {
                self.iambic.setSwapped(swapped);
                self.swapped = swapped;
            },
	        connect : function(target) {
	            self.straight.connect(target);
	            self.iambic.connect(target);
	        },
        };
        return self;
    }

    // combine inputs and outputs
    morse.station = function(params) {
        var context = new (window.AudioContext || window.webkitAudioContext)();

        var self = {
	        key_type : null,
	        key_type_select : function(key_type) {
                if (self.key_type) self.input[self.key_type].onblur();
	            self.key_type = key_type;
	            self.input.onfocus=self.input[key_type].onfocus;
	            self.input.onblur=self.input[key_type].onblur;
	            self.input.onmidievent=self.input[key_type].onmidievent;
	            self.input.keydown=self.input[key_type].keydown;
	            self.input.keyup=self.input[key_type].keyup;
	            if (self.key_input) key_input_select(self.key_input);
	        },
	        key_input : null,
	        key_input_select : function(key_input) {
	            if (self.key_input != key_input)
		            self.midi_key.disconnect(self.key_input)
	            self.key_input = key_input;
	            self.midi_key.connect(key_input, self.input.onmidievent)
	        },

	        output : morse.output(context),
	        output_detoner : morse.detone(context),
	        output_detimer : morse.detime(context),
	        output_decoder : morse.decode(context),

	        input : morse.input(context),
	        input_detoner : morse.detone(context),
	        input_detimer : morse.detime(context),
	        input_decoder : morse.decode(context),
	        midi_key : morse.midi_input(),

            get_params : function() {
                var params = {
                    key_type : self.key_type,
                    key_input : self.key_input,

                    input_pitch : self.input.pitch,
                    input_gain : self.input.gain,
                    input_wpm : self.input.wpm,
                    input_onTime : self.input.onTime,
                    input_offTime : self.input.offTime,

                    swapped : self.input.swapped,

                    output_pitch : self.output.pitch,
                    output_gain : self.output.gain,
                    output_wpm : self.output.wpm,
                    output_onTime : self.output.onTime,
                    output_offTime : self.output.offTime,
                };
                return params;
            },
        };

        var TEST_DETONER = false;

        self.output.connect(context.destination);
        if (TEST_DETONER) {
	        self.output.connect(self.output_detoner.getTarget());
	        self.output_detoner.on('transition', self.output_detimer.ontransition);
        } else {
	        self.output.on('transition', self.output_detimer.ontransition);
        }
        self.output_detimer.on('element', self.output_decoder.onelement);

        self.input.connect(context.destination);
        if (TEST_DETONER) {
	        self.input.connect(self.input_detoner.getTarget());
	        self.input_detoner.on('transition', self.input_detimer.ontransition);
        } else {
	        self.input.straight.player.on('transition', self.input_detimer.ontransition);
        }
        self.input.iambic.player.on('transition', self.input_detimer.ontransition);

        self.input_detimer.on('element', self.input_decoder.onelement);

        self.table = self.output.table;
        self.output_decoder.table = self.table;
        self.input_decoder.table = self.table;

        if (params) {
            self.key_type_select(params.key_type);
            self.key_input_select(params.key_input);

            self.input.setPitch(params.input_pitch);
            self.input.setGain(params.input_gain);
            self.input.setWPM(params.input_wpm);
            self.input.setOnTime(params.input_onTime);
            self.input.setOffTime(params.input_offTime);

            self.input.setSwapped(params.swapped);

            self.output.setPitch(params.output_pitch);
            self.output.setGain(params.output_gain);
            self.output.setWPM(params.output_wpm);
            self.output.setOnTime(params.output_onTime);
            self.output.setOffTime(params.output_offTime);
        }

        return self;
    }

  // Export the morse object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add 'morse'` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = morse;
    }
    exports = morse;
  } else {
    root.morse = morse;
  }
  // AMD registration happens at the end
  if (typeof define === 'function' && define.amd) {
    define('morse', [], function() {
      return morse;
    });
  }
}.call(this));
