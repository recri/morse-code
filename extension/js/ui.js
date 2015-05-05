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
        var e = document.getElementById(id);
        var is_left = id.charAt(0) == 'l' ? 1 : 0;
        // console.log('button_up('+id+') is_left '+is_left);
        if ('ontouchstart' in window) {
	        /* browser with Touch Events running on touch-capable device */
            e.addEventListener('touchstart', function(event) { station.input.keydown(is_left); });
            e.addEventListener('touchend', function(event) { station.input.keyup(is_left); });
        } else {
            e.addEventListener('mousedown', function(event) { station.input.keydown((event.button==0 ? 0 : 1) ^ is_left); });
            e.addEventListener('mouseup', function(event) { station.input.keyup((event.button==0 ? 0 : 1) ^ is_left); });
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
    var MIN_PITCH = "220", MAX_PITCH = "1760", DEF_IN_PITCH = "600", DEF_OUT_PITCH = "550";
    var MIN_GAIN = "-60", MAX_GAIN = "0", DEF_GAIN = "-24";
    var MIN_SPEED = "5", MAX_SPEED = "50", DEF_SPEED = "15";
    var MIN_TIME = "1", MAX_TIME = "10", DEF_TIME = "4";
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
        input_swap_paddles : function(name) {
            var value = document.getElementsByName(name)[0].checked;
            // console.log("input_swap_paddles "+value);
            station.input.setSwapped(value);
        },
        input_controls : function() {
	        slider("input_pitch", MIN_PITCH, MAX_PITCH, DEF_IN_PITCH, "Hz", station.input.setPitch, "  Pitch  ");
	        slider("input_gain", MIN_GAIN, MAX_GAIN, DEF_GAIN, "dB", station.input.setGain, "  Gain  ");
	        slider("input_speed", MIN_SPEED, MAX_SPEED, DEF_SPEED, "WPM", station.input.setWPM, "  Speed  ");
            slider("input_rise_time", MIN_TIME, MAX_TIME, DEF_TIME, "ms", station.input.setOnTime, "  Rise  ");
            slider("input_fall_time", MIN_TIME, MAX_TIME, DEF_TIME, "ms", station.input.setOffTime, "  Fall  ");
            self.key_midi_input_regenerate_list('key_midi_input');
            self.key_type_select('key_type');
        },
        input_keyboard : function() {
            // keydown/keyup events on html element
            var h = document.getElementsByTagName('html')[0];
            h.addEventListener('keydown', function(event) { station.input.keydown((event.keyCode&1)==0); });
            h.addEventListener('keyup', function(event) { station.input.keyup((event.keyCode&1)==0); });
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
	        slider("output_pitch", MIN_PITCH, MAX_PITCH, DEF_OUT_PITCH, "Hz", station.output.setPitch, "  Pitch  ");
	        slider("output_gain", MIN_GAIN, MAX_GAIN, DEF_GAIN, "dB", station.output.setGain, "  Gain  ");
	        slider("output_speed", MIN_SPEED, MAX_SPEED, DEF_SPEED, "WPM", station.output.setWPM, "  Speed  ");
            slider("output_rise_time", MIN_TIME, MAX_TIME, DEF_TIME, "ms", station.output.setOnTime, "  Rise  ")
            slider("output_fall_time", MIN_TIME, MAX_TIME, DEF_TIME, "ms", station.output.setOffTime, "  Fall  ")
        },
    };
    return self;
}
