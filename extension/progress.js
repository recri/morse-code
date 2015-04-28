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
function study_progress(word_list, station) {
    var progress = {
	word_list : word_list,	// the word list we are studying
	station : station,	// the tester we use to examine the student
	next_i : 0,		// how far through the list we've gotten
	words : {},		// the dictionary of words studied
				// number of times seen, recording percent correct, 
	worst : function(n) {
	    // find the worst n of the words we've studied
	},
	test : function(word) {
	},
	send : function(word) {
	    progress.station.output.send(word);
	},
	letterSent : function(letter) {
	},
    };

    return progress;
}

//
// teach a word list
//
function word_list_teach(word_list, tester, progress) {
    if (progress == null)
	progress = word_list_progress();
    word_list.startAt(progress.next_i);
    
    while (true) {
	var words;
	if (progress.needs_review)
	    words = progress.worst(10);
	// review or new study?
	// if review, use progress.word_list.worst(N)
	// if new study, pull word_list.next(N)
    }
    progress.next_i = word_list.next_i;
}
