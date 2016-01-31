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