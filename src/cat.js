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