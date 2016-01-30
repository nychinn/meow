(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var keycode = require('keycode');

var music = new Audio('sounds/Silly_Fun.mp3');
music.volume = 0.1;
music.loop = true;

var Sounds = function() {
	this.audios = [];
	this.index = 0;
};

Sounds.prototype.load = function(source, params) {
	params = params || {};
	times = params.times || 5;
	volume = params.volume || 1;
	playbackRate = params.playbackRate || 1;

	this.audios = [];
	for (var i = 0; i < times; i ++) {
		var audio = new Audio(source);
		this.audios.push(audio);
		audio.volume = volume;
		audio.playbackRate = playbackRate;
	}
};

Sounds.prototype.play = function() {
	this.audios[this.index].play();
	this.index ++;
	if(this.index === this.audios.length) {
		this.index = 0;
	}
};

var typewriter_sound = new Sounds();
typewriter_sound.load('sounds/typewriter.wav', {
	volume: 0.5, playbackRate: 2
});

var meow_sound = new Sounds();
meow_sound.load('sounds/mew-normal.ogg', {
	volume: 0.1,
	times: 10
});

var punch_sound = new Sounds();
punch_sound.load('sounds/punch.mp3', {
	volume: 0.5,
	playbackRate: 1.5
});

var needs_meow = false;

var canvas_speechBubble = document.getElementById('speech');
var canvas_cats = document.getElementById('cats');
var ctx_speechBubble = canvas_speechBubble.getContext('2d');
var ctx_cats = canvas_cats.getContext('2d');
ctx_speechBubble.imageSmoothingEnabled = false;
ctx_cats.imageSmoothingEnabled = false;

var frameRate = 24.0;

var cats = [];

var spawnRate = 1.0;
var spawnCounter = 0;

var tick = function() {
	spawnRate += 0.001;
	
	spawnCounter += spawnRate;
	if(spawnCounter > 100) {
		spawnCounter = 0;
		addCat();
	}

	ctx_cats.clearRect(0, 0, canvas_cats.width, canvas_cats.height);
	ctx_speechBubble.clearRect(0, 0, canvas_speechBubble.width, canvas_speechBubble.height);

	for(var i = 0; i < cats.length; i++) {
		cats[i].draw();
		cats[i].think();
	}

	setTimeout(tick, 1000 / frameRate);
};

var game_started = false;
var startGame = function() {
	game_started = true;
	$('#splash_text').remove();
	$('#splash').remove();
	var cat = addCat();
	cat.word = 'MEOW';
	cat.hasWord = true;

	music.play();
	tick();
};

var game_start_keys = ['M', 'E', 'O', 'W'];
var game_start_keys_index = -1;

document.addEventListener('keyup', function(e) {
	var key = keycode(e);

	if(!game_started) {
		var nextKey = game_start_keys[game_start_keys_index + 1];
		if(nextKey.toLowerCase() === key.toLowerCase()) {
			game_start_keys_index ++;
			if(game_start_keys_index === game_start_keys.length - 1) {
				meow_sound.play();
				setTimeout(startGame, 2000);
			}
		}
	}

	for(var i = 0; i < cats.length; i ++) {
		cats[i].hear(key);
	}

	typewriter_sound.play();

	if(needs_meow) {
		meow_sound.play();
		needs_meow = false;
	}
});

// require('./drawground');

var catsetImage = new Image();
var catsetAngryImage = new Image();
var speech_left_image = new Image();
var speech_right_image = new Image();
var speech_middle_image = new Image();
var speech_tail_image = new Image();
var mad_image = new Image();

catsetImage.src = 'images/cat-gray.png';
catsetAngryImage.src = 'images/cat-gray-angry.png';
speech_left_image.src = 'images/speech-left.png';
speech_right_image.src = 'images/speech-right.png';
speech_middle_image.src = 'images/speech-middle.png';
speech_tail_image.src = 'images/speech-tail.png';
mad_image.src = 'images/mad.png';

var images = [catsetImage, speech_left_image, speech_right_image, speech_middle_image, speech_tail_image, mad_image, catsetAngryImage];

var loadImages = function(images, callback) {
	var count = 0;
	var sum = images.length;
	for(var i = 0; i < images.length; i++) {
		var image = images[i];
		image.onload = function(){
			count ++;
			if(count == sum) {
				callback();
			}
		};
	}
};

var cats = [];

// Map to store grid that has cats
var catMap = {};

var getEmptyCoord = function() {
	var num_x = 8;
	var num_y = 3;
	var x = Math.floor(Math.random() * num_x);
	var y = Math.floor(Math.random() * num_y);

	var id = [x, y].join(',');
	if (catMap[id]) {
		return false;
	}

	return [x, y];
};

var addCat = function() {
	var x_space = 54;
	var y_space = 54;

	var coord = null;
	var maxTry = 5;

	var count = 0;
	while(count < maxTry) {
		coord = getEmptyCoord();
		if(coord !== false) {
			break;
		}
		count ++;
	}

	if(coord === false) {
		return;
	}

	var x = coord[0];
	var y = coord[1];

	var startX = 60;
	var startY = 140;

	var cat = new Cat();

	cat.x = x * x_space + startX;

	cat.y = y * y_space + startY;

	if(x % 2) {
		cat.y += y_space / 2;
	}

	cats.push(cat);

	catMap[[x, y].join(',')] = true;

	cat.coord = [x, y];

	return cat;
};

loadImages(images, function() { });

var vocab = [
	'MEOW',
	'MEEOW',
	'MEOOW',
	'MEOWW',
	'MMEEOOW',
	'MMEOOW',
	'MMEOWW',
	'MEEOOW',
	'MEEOWW',
	'MEOOWW',
	'MEEEOWW',
	'MEOWMEOW',
	'MMEEEOWW',
	'MMMEEOW',
	'MEEEOWW',
	'MEEOOOW',
	'MMEOWWW',
	'MEOWWWW',
	'MEEOOWW',
	'NYAN'
];

var Cat = function() {
	this.speech = null;
	this.x = 0;
	this.y = 0;
	this.index = 0;
	this.lastIndex = null;
	this.word = '';
	this.hasWord = false;
	// Has word after 24 frames
	this.wordThink = 24;
	this.isMad = false;
	this.animateCount = 0;
	this.animateStart = Math.floor(Math.random() * 100);

	this.patience = 120;
	this.startPatience = 120;
	this.numWords = 2;
};

Cat.prototype.draw = function() {
	var x = this.x;
	var y = this.y;
	var bubbleOffsetY = -40;
	var bubbleOffsetX = -10;
	var bubbleWidth = this.word.length * 11.0;
	var bubbleHeight = 44;
	var speechYOffset = 2;

	this.drawBody(x, y);
	if(this.hasWord) {
		this.drawSpeech(x + bubbleOffsetX - bubbleWidth / 2, y + bubbleOffsetY - bubbleHeight / 2 + speechYOffset, this.index);
		this.drawBubble(x + bubbleOffsetX, y + bubbleOffsetY, bubbleWidth);
	}

	if(this.isMad) {
		this.drawMad(x - 5, y - 40);
	}
};

Cat.prototype.think = function() {
	this.wordThink --;

	if(this.word.length > 0) {
		this.patience --;
	}

	if(this.wordThink <= 0) {
		if(!this.hasWord) {
			if(Math.random() < 0.08) {
				this.word = vocab[Math.floor(Math.random() * vocab.length)];;
				this.hasWord = true;
			}
		}
	}

	if(this.patience <= 0 && !this.isMad) {
		this.isMad = true;
		punch_sound.play();
	}

	this.animateCount ++;
};

Cat.prototype.hear = function(key) {
	this.wantToHear = this.word.substring(this.index, this.index + 1);

	if(this.wantToHear.toLowerCase() === key.toLowerCase() || 
		(this.wantToHear === ' ' && key === 'space')) {
		this.index ++;
	}

	if(this.index === this.word.length && this.word.length > 0) {
		this.numWords --;

		if(this.numWords === 0) {
			this.remove();
		} else {
			this.removeSpeech();
			this.hasWord = false;
			this.index = 0;
			this.wordThink = 72;
			this.word = '';
			this.patience = this.startPatience;
			this.isMad = false;

			needs_meow = true;
		}
	}
};

Cat.prototype.drawBody = function(x, y) {
	tileCol = this.animateCount % 2 + 1;

	var tileSize = 32;
	var tileCol = (this.animateCount % 25) < 15 ? 0 : 1;
	var tileRow = 0;
	var drawSize = 64;

	var image = this.isMad ? catsetAngryImage : catsetImage;

	ctx_cats.drawImage(image, tileCol * tileSize, tileRow * tileSize, tileSize, tileSize, x - drawSize / 2, y - drawSize / 2, drawSize, drawSize);
};

Cat.prototype.drawBubble = function(x, y, width) {
	var scale = 0.5;
	var height = 44;
	var leading_width = 12;
	var tail_width = 32;
	var tail_height = 16;
	var tail_offsety = -4;
	height *= scale;
	leading_width *= scale;
	tail_width *= scale;
	tail_height *= scale;
	tail_offsety *= scale;

	x -= width / 2;
	y -= height;

	ctx_speechBubble.drawImage(speech_left_image, x - leading_width, y, leading_width, height);
	ctx_speechBubble.drawImage(speech_middle_image, x, y, width, height);
	ctx_speechBubble.drawImage(speech_right_image, x + width, y, leading_width, height);
	ctx_speechBubble.drawImage(speech_tail_image, x + (width - tail_width) / 2, y + height + tail_offsety, tail_width, tail_height);
};

Cat.prototype.drawSpeech = function(x, y, index) {
	var word1 = this.word.substring(0, index);
	var word2 = this.word.substring(index);

	if(this.index !== this.lastIndex || this.speech == null) {
		if(this.speech != null) {
			this.speech.remove();
		}
		this.speech = $('<div><span style="color:#ff0000">' + word1 + '</span><span style="color:#000000">' + word2 + '</span></div>');
		this.speech.css({top: y, left: x, position:'absolute'});
		$('#text').append(this.speech);
	} else {
		this.speech.css({top: y, left: x, position:'absolute'});
	}

	this.lastIndex = this.index;
};

Cat.prototype.drawMad = function(x, y) {
	ctx_cats.drawImage(mad_image, x, y);
};

Cat.prototype.removeSpeech = function() {
	if(this.speech !== null) {
		this.speech.remove();
	}
};

Cat.prototype.remove = function() {
	this.removeSpeech();
	var id = this.coord.join(',');
	delete catMap[id];

	for(var i = 0; i < cats.length; i ++) {
		if(cats[i] === this) {
			cats.splice(i, 1);
			break;
		}
	}
};
},{"keycode":2}],2:[function(require,module,exports){
// Source: http://jsfiddle.net/vWx8V/
// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes



/**
 * Conenience method returns corresponding value for given keyName or keyCode.
 *
 * @param {Mixed} keyCode {Number} or keyName {String}
 * @return {Mixed}
 * @api public
 */

exports = module.exports = function(searchInput) {
  // Keyboard Events
  if (searchInput && 'object' === typeof searchInput) {
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
    if (hasKeyCode) searchInput = hasKeyCode
  }

  // Numbers
  if ('number' === typeof searchInput) return names[searchInput]

  // Everything else (cast to string)
  var search = String(searchInput)

  // check codes
  var foundNamedKey = codes[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // weird character?
  if (search.length === 1) return search.charCodeAt(0)

  return undefined
}

/**
 * Get by name
 *
 *   exports.code['enter'] // => 13
 */

var codes = exports.code = exports.codes = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause/break': 19,
  'caps lock': 20,
  'esc': 27,
  'space': 32,
  'page up': 33,
  'page down': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'command': 91,
  'right click': 93,
  'numpad *': 106,
  'numpad +': 107,
  'numpad -': 109,
  'numpad .': 110,
  'numpad /': 111,
  'num lock': 144,
  'scroll lock': 145,
  'my computer': 182,
  'my calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222,
}

// Helper aliases

var aliases = exports.aliases = {
  'windows': 91,
  '⇧': 16,
  '⌥': 18,
  '⌃': 17,
  '⌘': 91,
  'ctl': 17,
  'control': 17,
  'option': 18,
  'pause': 19,
  'break': 19,
  'caps': 20,
  'return': 13,
  'escape': 27,
  'spc': 32,
  'pgup': 33,
  'pgdn': 33,
  'ins': 45,
  'del': 46,
  'cmd': 91
}


/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

// numbers
for (var i = 48; i < 58; i++) codes[i - 48] = i

// function keys
for (i = 1; i < 13; i++) codes['f'+i] = i + 111

// numpad keys
for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

/**
 * Get by code
 *
 *   exports.name[13] // => 'Enter'
 */

var names = exports.names = exports.title = {} // title for backward compat

// Create reverse mapping
for (i in codes) names[codes[i]] = i

// Add aliases
for (var alias in aliases) {
  codes[alias] = aliases[alias]
}

},{}]},{},[1]);
