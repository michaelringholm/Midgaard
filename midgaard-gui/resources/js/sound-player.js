var soundPlayer = {};
$(function() {	
    soundPlayer = new SoundPlayer();
});

function SoundPlayer() {
    var _this = this;

    this.playSound = function(soundPath) {
        var audio = new Audio(soundPath);
        audio.play();
        return audio;
    };

    this.stop = function(audio) {
        audio.pause();
        audio.currentTime = 0;
    };
}