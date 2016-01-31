(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var keycode = require('keycode');
var Cat = require('./src/cat');
var sounds = require('./src/sounds');
var images = require('./src/images');

var music = new Audio('sounds/Silly_Fun.mp3');
music.volume = 0.1;
music.loop = true;

var canvas_speechBubble = document.getElementById('speech');
var canvas_cats = document.getElementById('cats');
var ctx_speechBubble = canvas_speechBubble.getContext('2d');
var ctx_cats = canvas_cats.getContext('2d');
ctx_speechBubble.imageSmoothingEnabled = false;
ctx_cats.imageSmoothingEnabled = false;

var end_screen_shown = false;
var hideEndScreen = function() {
	$('#splash_end').hide();
	$('#splash_end_text').hide();
	end_screen_shown = false;
};

hideEndScreen();

// Map to store grid that has cats
global.catMap = {};

global.cats = [];

var frameRate = 24.0;

var spawnRate = 1.0;
var spawnCounter = 0;

var app = {};
app.removeLife = function(amount) {
	life -= amount;
	if(life < 0) {
		life = 0;
	}

	if(life === 0) {
		if(!game_stopped) {
			stopGame();	
		}
	}
};

Cat.app = app;

var animate = function() {
	tick();
	setTimeout(animate, 1000 / frameRate);
};

var tick = function() {
	if(!game_started) {
		return;
	}
	if(!game_stopped) {
		spawnRate += 0.001;

	  spawnCounter += spawnRate;
	  if (spawnCounter > 100) {
	    spawnCounter = 0;
	    addCat();
	  }	
	}

  ctx_cats.clearRect(0, 0, canvas_cats.width, canvas_cats.height);
  ctx_speechBubble.clearRect(0, 0, canvas_speechBubble.width, canvas_speechBubble.height);

  for (var i = 0; i < cats.length; i++) {
    cats[i].draw();
    cats[i].think();
  }

  drawHearts();
};

animate();

var start_life = 10;
var life = start_life;

var drawHearts = function() {
	var startx = 4;
	var starty = 4;
	var gap = 18;
	for(var i = 0; i < life; i ++) {
		ctx_cats.drawImage(images['heart'], startx + gap * i, starty);
	}
};

var game_started = false;
var game_stopped = false;
var startGame = function() {
	life = start_life;
	game_stopped = false;
	for(var i = 0; i < cats.length; i++) {
		cats[i].remove();
	}
	cats = [];

  game_started = true;
  $('#splash_text').remove();
  $('#splash').remove();
  var cat = addCat();
  cat.word = 'MEOW';
  cat.hasWord = true;

  music.play();
};

var stopGame = function() {
	game_stopped = true;
	for(var i = 0; i < cats.length; i++) {
		cats[i].foreverMad();
	}

	setTimeout(showEndScreen, 1000);
};

var showEndScreen = function() {
	$('#splash_end').show();
	$('#splash_end_text').show();
	end_screen_shown = true;
};

var game_start_keys = ['M', 'E', 'O', 'W'];
var game_start_keys_index = 0;

document.addEventListener('keyup', function(e) {
  var key = keycode(e);

  if(end_screen_shown) {
  	hideEndScreen();
  	startGame();
  }

  if (!game_started) {
    var nextKey = game_start_keys[game_start_keys_index];
    if (!!nextKey && nextKey.toLowerCase() === key.toLowerCase()) {
      game_start_keys_index ++;
      if (game_start_keys_index === game_start_keys.length) {
        sounds['meow'].play();
        setTimeout(startGame, 2000);
      }
    }
  }

  for (var i = 0; i < cats.length; i++) {
    cats[i].hear(key);
  }

  sounds['typewriter'].play();

  if (sounds.needs_meow) {
    sounds['meow'].play();
    sounds.needs_meow = false;
  }
});

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
  while (count < maxTry) {
    coord = getEmptyCoord();
    if (coord !== false) {
      break;
    }
    count++;
  }

  if (coord === false) {
    return;
  }

  var x = coord[0];
  var y = coord[1];

  var startX = 60;
  var startY = 140;

  var cat = new Cat();

  cat.x = x * x_space + startX;

  cat.y = y * y_space + startY;

  if (x % 2) {
    cat.y += y_space / 2;
  }

  cats.push(cat);

  catMap[[x, y].join(',')] = true;

  cat.coord = [x, y];

  return cat;
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/cat":3,"./src/images":5,"./src/sounds":7,"keycode":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var vocab = require('./dictionary');
var sounds = require('./sounds');
var images = require('./images');

var canvas_speechBubble = document.getElementById('speech');
var canvas_cats = document.getElementById('cats');
var ctx_speechBubble = canvas_speechBubble.getContext('2d');
var ctx_cats = canvas_cats.getContext('2d');

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
	this.textWidth = 0;
	this.isForeverMad = false;
};

Cat.prototype.draw = function() {
	var x = this.x;
	var y = this.y;
	var bubbleOffsetY = -40;
	var bubbleOffsetX = -10;
	var bubbleWidth = this.word.length * 10.0;
	var bubbleHeight = 44;
	var speechYOffset = 2;

	this.drawBody(x, y);
	if(this.hasWord) {
		this.drawSpeech(x + bubbleOffsetX - bubbleWidth / 2, y + bubbleOffsetY - bubbleHeight / 2 + speechYOffset, this.index);
		bubbleWidth = this.textWidth;

		this.drawSpeech(x + bubbleOffsetX - bubbleWidth / 2, y + bubbleOffsetY - bubbleHeight / 2 + speechYOffset, this.index);
		this.drawBubble(x + bubbleOffsetX, y + bubbleOffsetY, bubbleWidth);
	}

	if(this.isMad) {
		this.drawMad(x - 5, y - 40);
	}
};

Cat.prototype.think = function() {
	this.animateCount ++;

	if(this.isForeverMad) {
		return;
	}

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
		sounds['punch'].play();
		Cat.app.removeLife(1);
	}
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
			sounds.needs_meow = true;
			this.remove();
		} else {
			this.removeSpeech();
			this.hasWord = false;
			this.index = 0;
			this.wordThink = 72;
			this.word = '';
			this.patience = this.startPatience;
			this.isMad = false;
			sounds.needs_meow = true;
		}
	}
};

Cat.prototype.drawBody = function(x, y) {
	tileCol = this.animateCount % 2 + 1;

	var tileSize = 32;
	var tileCol = (this.animateCount % 25) < 15 ? 0 : 1;
	var tileRow = 0;
	var drawSize = 64;

	var image = this.isMad ? images['catsetAngry'] : images['catset'];

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

	ctx_speechBubble.drawImage(images['speech_left'], x - leading_width, y, leading_width, height);
	ctx_speechBubble.drawImage(images['speech_middle'], x, y, width, height);
	ctx_speechBubble.drawImage(images['speech_right'], x + width, y, leading_width, height);
	ctx_speechBubble.drawImage(images['speech_tail'], x + (width - tail_width) / 2, y + height + tail_offsety, tail_width, tail_height);
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
	this.textWidth = this.speech.width();
};

Cat.prototype.drawMad = function(x, y) {
	ctx_cats.drawImage(images['mad'], x, y);
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

Cat.prototype.foreverMad = function() {
	this.isForeverMad = true;
	this.isMad = true;
	this.word = '';
	this.hasWord = false;
	this.removeSpeech();
};

module.exports = Cat;
},{"./dictionary":4,"./images":5,"./sounds":7}],4:[function(require,module,exports){
module.exports = [
  'grumpy cat',
  'maru',
  'shironeko',
  'banye',
  'salem',
  'chesire cat',
  'crookshanks',
  'snowbell',
  'garfield',
  'puss in boots',
  'mr bigglesworth',
  'sylvester',
  'tom cat',
  'felix the cat',
  'arlene',
  'artemis',
  'doraemon',
  'happy',
  'luna',
  'nyan cat',
  'hello kitty',
  'charmmy kitty',
  'marie',
  'meowth',
  'persian',
  'jiji',
  'lucifer',
  'scratchy',
  'mrs norris',
  'diana',
  'miu miu',
  'miao',
  'miauw miauw',
  'mew mew',
  'miaow',
  'meu meu',
  'nyaaa',
  'meow meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'meow', 'meow', 'meow', 'meow','meow','meow','meow','meow','meow','meow','meow','meow',
  'miau'
];
},{}],5:[function(require,module,exports){
var catsetImage = new Image();
var catsetAngryImage = new Image();
var speech_left_image = new Image();
var speech_right_image = new Image();
var speech_middle_image = new Image();
var speech_tail_image = new Image();
var mad_image = new Image();
var heart_image = new Image();

catsetImage.src = 'images/cat-gray.png';
catsetAngryImage.src = 'images/cat-gray-angry.png';
speech_left_image.src = 'images/speech-left.png';
speech_right_image.src = 'images/speech-right.png';
speech_middle_image.src = 'images/speech-middle.png';
speech_tail_image.src = 'images/speech-tail.png';
mad_image.src = 'images/mad.png';
heart_image.src = 'images/heart.png';

var images = {
	'catset': catsetImage, 
	'speech_left': speech_left_image, 
	'speech_right': speech_right_image, 
	'speech_middle': speech_middle_image, 
	'speech_tail': speech_tail_image, 
	'mad': mad_image, 
	'catsetAngry': catsetAngryImage,
	'heart': heart_image
};

module.exports = images;
},{}],6:[function(require,module,exports){
var Sound = function() {
	this.audios = [];
	this.index = 0;
};

Sound.prototype.load = function(source, params) {
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

Sound.prototype.play = function() {
	this.audios[this.index].play();
	this.index ++;
	if(this.index === this.audios.length) {
		this.index = 0;
	}
};

module.exports = Sound;
},{}],7:[function(require,module,exports){
var Sound = require('./sound');
var sounds = {};

var typewriter_sound = new Sound();
typewriter_sound.load('sounds/typewriter.wav', {
	volume: 0.5, playbackRate: 2
});

var meow_sound = new Sound();
meow_sound.load('sounds/mew-normal.ogg', {
	volume: 0.1,
	times: 10
});

var punch_sound = new Sound();
punch_sound.load('sounds/punch.mp3', {
	volume: 0.5,
	playbackRate: 1.5
});

sounds['typewriter'] = typewriter_sound;
sounds['meow'] = meow_sound;
sounds['punch'] = punch_sound;

sounds.needs_meow = false;

module.exports = sounds;
},{"./sound":6}]},{},[1]);
