var keycode = require('keycode');

var music = new Audio('sounds/Silly_Fun.mp3');
music.volume = 0.1;
music.loop = true;
music.play();

var Sprite = function() {
	this.element = $('<div></div>');
	$('body').append(this.element);
	this.element.css('background-color', 'red');

	this.x = 0;
	this.y = 0;
	this.width = 100;
	this.height = 100;
};

Sprite.prototype.setSize = function(width, height) {
	this.width = width;
	this.height = height;
	this.element.width(width).height(height);
};

Sprite.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
	this.element.css({top: y, left: x, position:'absolute'});
};

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
	spawnRate *= 1.001;
	
	spawnCounter += spawnRate;
	if(spawnCounter > 50) {
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

tick();

document.addEventListener('keyup', function(e) {
	var key = keycode(e);
	for(var i = 0; i < cats.length; i ++) {
		cats[i].hear(key);
	}

	var typewriter = new Audio('sounds/typewriter.wav');
	typewriter.volume = 0.5;
	typewriter.playbackRate = 2;
	typewriter.play();
});

// require('./drawground');

var catsetImage = new Image();
var speech_left_image = new Image();
var speech_right_image = new Image();
var speech_middle_image = new Image();
var speech_tail_image = new Image();
var mad_image = new Image();

catsetImage.src = 'images/cat-gray.png';
speech_left_image.src = 'images/speech-left.png';
speech_right_image.src = 'images/speech-right.png';
speech_middle_image.src = 'images/speech-middle.png';
speech_tail_image.src = 'images/speech-tail.png';
mad_image.src = 'images/mad.png';

var images = [catsetImage, speech_left_image, speech_right_image, speech_middle_image, speech_tail_image, mad_image];

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

	return cat;
};

loadImages(images, function() {
	var cat = addCat();
	cat.word = 'MEOW';
	cat.hasWord = true;
});

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
	var speechYOffset = 0;

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

	if(this.patience <= 0) {
		this.isMad = true;
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
		}
	}
};

Cat.prototype.drawBody = function(x, y) {
	tileCol = this.animateCount % 2 + 1;

	var tileSize = 32;
	var tileCol = (this.animateCount % 25) < 15 ? 0 : 1;
	var tileRow = 0;
	var drawSize = 64;

	ctx_cats.drawImage(catsetImage, tileCol * tileSize, tileRow * tileSize, tileSize, tileSize, x - drawSize / 2, y - drawSize / 2, drawSize, drawSize);
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

	for(var i = 0; i < cats.length; i ++) {
		if(cats[i] === this) {
			cats.splice(i, 1);
			break;
		}
	}
};