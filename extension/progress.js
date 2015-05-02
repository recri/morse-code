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

//
// make the object for maintaining progress
//
//  sessions/lessson either
//  1) Present a collection of new words for study
//	chosen in order of increasing difficulty
//  2) Present a collections of old words for review
//	chosen according to how well they are known
//  3) Present a mixter of new words and old words
//
//  in all cases, the words are presented in random order
//  and the student needs to echo the word back correctly
//  to progress to the next word in the session, or press
//  the [next] button.  The length of the answers to a
//  given prompt divided by the correct answer (in dits)
//  gives a score which is greater than or equal to 1 if
//  the correct answer is given.  If the next button is
//  pressed, then a penalty score needs to be awarded.
//
//  when the student is getting everything right then the
//  score can be weighted by the time taken to give the
//  answer divided by the time taken to present the original
//  prompt.
//

function study_progress(word_list, station) {
    var self = {
	word_list : word_list,	// the word list we are studying
	station : station,	// the tester we use to examine the student
	table : station.output.table,
	next_i : 0,		// how far through the list we've gotten
	words : {},		// the dictionary of words studied
				// number of times seen, recording percent correct, 
	current : "",		// current word
	session : {
	    words : ["e", "t", "i" ],
	    tests : []
	},		// current session, like words but for this session

	input_text : "",
	output_text : "",
	input_code : "",
	output_code : "",

	test_output_time : 0,
	test_input_time : 0,

	clear_output : function() {
	    self.output_text = "";
	    self.output_code = "";
	    self.test_output_time = Date.now(); // time in milliseconds since epoch
	},
	clear_input : function() {
	    self.input_text = "";
	    self.input_code = "";
	},
	send : function() {
	    self.station.output.send(self.current);
	},
	test : function(word) {
	    self.clear_input();
	    self.clear_output();
	    self.send();
	},
	onoutputletter : function(ltr, code) {
	    // console.log("onoutputletter("+ltr+", "+code+")");
	    self.output_text += ltr;
	    self.output_code += code;
	    var output = self.output_text.trim().toLowerCase();
	    if (output == self.current) {
		var now = Date.now()
		self.test_input_time = now;
		self.test_output_time = now - self.test_output_time;
		// console.log("send("+self.current+") completed in "+self.test_time+"ms");
	    }
	},
	oninputletter : function(ltr, code) {
	    self.input_text += ltr;
	    self.input_code += code;
	    // console.log("oninputletter "+self.input_text+" vs "+self.current);
	    if (self.input_text.trim().endsWith(self.current)) {
		self.next();
	    }
	},
	score_last : function() {
	    self.test_input_time = Date.now() - self.test_input_time;
	    var timescore = self.test_input_time/self.test_output_time;
	    var input = self.input_text.trim();
	    var score = Math.round(100*self.table.ditLength(input)/self.table.ditLength(self.current));
	    console.log("score_last "+input+" t "+timescore+" "+score+"");
	    self.session.tests.push([self.current, timescore, score]);
	},
	pick : function(list) {
	    return list[Math.floor(Math.random()*list.length)];
	},
	next_word : function() {
	    self.current = self.pick(self.session.words);
	    // console.log("next_word: "+self.current);
	},
	continue : function() {
	    // console.log("continue");
	    self.next_word();
	    self.test();
	},
	next : function() {
	    // console.log("next");
	    self.score_last();
	    self.continue();
	},
	again : function() {
	    // console.log("again");
	    self.clear_output();
	    self.send();
	},
	start : function() {
	    // console.log("start");
	    self.session = {
		words : self.word_list.next(10),
		tests : []
	    };
	    self.continue();
	},
	restart : function() {
	    // console.log("restart");
	    self.start();
	},
	stop : function() {
	    // console.log("stop");
	    self.current = null;
	},
	setSpeed : function(wpm) {
	    self.station.output.setWPM(wpm);
	    self.station.input.setWPM(wpm);
	    document.getElementById('speed').innerText = ""+wpm;
	},
	getSpeed : function() { return self.station.output.wpm },
	faster : function() { self.setSpeed(self.getSpeed()+2.5); },
	slower : function() { self.setSpeed(self.getSpeed()-2.5); },
	onagain : function() { self.again(); },
	onnext : function() { self.next(); },
	onstart : function() { self.start(); },
	onrestart : function() { self.restart(); },
	onstop : function() { self.stop(); },
	onslower : function() { self.slower(); },
	onfaster : function() { self.faster(); },
	
    };

    self.station.input_decoder.on('letter', function(ltr, code) { self.oninputletter(ltr, code); });
    self.station.output_decoder.on('letter', function(ltr, code) { self.onoutputletter(ltr, code); });
    self.setSpeed(self.getSpeed());
    return self;
}
