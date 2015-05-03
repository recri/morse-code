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

function morse_code_ui(station) {
    function button_up(id) {
        var e = document.getElementById(id)
        if ('ontouchstart' in window) {
	        /* browser with Touch Events running on touch-capable device */
            e.addEventListener('touchstart', function(event) { station.input.ontouchstart(event); });
            e.addEventListener('touchend', function(event) { station.input.ontouchend(event); });
        } else {
            e.addEventListener('mousedown', function(event) { station.input.onmousedown(event); });
            e.addEventListener('mouseup', function(event) { station.input.onmouseup(event); });
            e.oncontextmenu = function() { return false; };
        }
    }
    function slider(id, min, max, value, units, target, ident) {
        // console.log("slider("+id+")");
        var inputid = id+"_input";
        var valueid = id+"_value";
        var identid = id+"_identity";
	    document.getElementById(id).innerHTML = '<span id="'+identid+'"></span><input id="'+inputid+'"></input><br/><span id="'+valueid+'"></span>';
        var inp = document.getElementById(inputid);
	    var val = document.getElementById(valueid);
        var tag = document.getElementById(identid);
        inp.type = "range";
	    inp.min = min;
	    inp.max = max;
        if (ident) tag.innerText = ident;
        var target_value = inp.value;
	    if (units == "dB") {
            inp.oninput = inp.onchange = function() {
                val.innerHTML = ""+inp.value+" "+units;
	            target(Math.pow(10, inp.value/20))
            }
        } else if (units == "ms") {
            inp.oninput = inp.onchange = function() {
                val.innerHTML = ""+inp.value+" "+units;
	            target(inp.value/1000)
            }
        } else {
            inp.oninput = inp.onchange = function() {
                val.innerHTML = ""+inp.value+" "+units;
	            target(inp.value)
            }
        }
	    inp.value = value;
        inp.onchange();
    }
    function find_item_checked(name) {
        var radios = document.getElementsByName(name);
        for (var i in radios)
            if (radios[i].checked)
	            return radios[i].value;
        return null;
    }
    function set_item_checked(name, value) {
        var radios = document.getElementsByName(name);
        for (var i in radios)
            radios[i].checked = (radios[i].value == value);
    }
    var self = {
        key_type_select : function() {
            var new_type = find_item_checked('key_type');
            if (new_type != station.key_type) {
                if (station.key_type && station.input[station.key_type])
	                station.input[station.key_type].onblur();
                station.key_type_select(new_type);
                if (station.key_type && station.input[station.key_type])
                    station.input[station.key_type].onfocus();
            }
        },
        key_midi_input_select : function(id) {
	        station.key_input_select(find_item_checked());
        },
        key_midi_input_regenerate_list : function(id) {
            // try to preserve the selected value if possible
            var key_input = document.getElementById(id);
            var checked = find_item_checked(id);
	        if (key_input) {
                key_input.innerHTML = "";
                var names = station.midi_key.names();
                for (var i in names) {
	                // console.log("adding "+names[i]+" to midi inputs");
                    key_input.innerHTML += "<input type='radio' name='"+id+"' value='"+names[i]+"' align='left'>"+names[i]+"<br/>";
                }
	            if (checked) set_item_checked('key_input', checked);
	        }
        },
        input_swap_paddles : function(id) {
            var value = find_item_checked(id) == 1;
            // console.log("input_swap_paddles "+value);
            station.input.setSwapped(value);
        },
        input_controls : function() {
	        slider("input_pitch", "220", "1760", "550", "Hz", station.input.setPitch, "  Pitch  ");
	        slider("input_gain", "-60", "0", "-24", "dB", station.input.setGain, "  Gain  ");
	        slider("input_speed", "5", "30", "15", "WPM", station.input.setWPM, "  Speed  ");
            slider("input_rise_time", "1", "10", "4", "ms", station.input.setOnTime, "  Rise  ");
            slider("input_fall_time", "1", "10", "4", "ms", station.input.setOffTime, "  Fall  ");
            self.key_midi_input_regenerate_list('key_midi_input');
            self.key_type_select('key_type');
        },
        input_keyboard : function() {
            // keydown/keyup events on html element
            var h = document.getElementsByTagName('html')[0];
            h.addEventListener('keydown', function(event) { station.input.onkeydown(event); });
            h.addEventListener('keyup', function(event) { station.input.onkeyup(event); });
        },
        input_touch : function(id) {
            // touch/mouse events on key buttons
            var d = document.getElementById(id);
            d.innerHTML = '<button class="button single" id="left-button">L</button>'+
                '<button class="button single" id="right-button">R</button>';
            button_up("left-button");
            button_up("right-button");
        },
        output_controls : function() {
	        slider("output_pitch", "220", "1760", "600", "Hz", station.output.setPitch, "  Pitch  ");
	        slider("output_gain", "-60", "0", "-24", "dB", station.output.setGain, "  Gain  ");
	        slider("output_speed", "5", "30", "15", "WPM", station.output.setWPM, "  Speed  ");
            slider("output_rise_time", "1", "10", "4", "ms", station.output.setOnTime, "  Rise  ")
            slider("output_fall_time", "1", "10", "4", "ms", station.output.setOffTime, "  Fall  ")
        },
    };
    return self;
}
