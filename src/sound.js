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