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