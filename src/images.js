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