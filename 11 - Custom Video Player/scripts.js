// Selectors
const player = document.querySelector('.player')
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.player__button'); // should work
const ranges = document.querySelectorAll('.player__slider');
const skipButtons = player.querySelectorAll('button[data-skip]');

// Functions
function togglePlay() {
  if (video.paused) {
    video.play();
    toggle.textContent = '❚ ❚';

  } else {
    video.pause();
    toggle.textContent = '►';
    }
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function rangeUpdate() {
  console.log(this.name);
  console.log(this.value);
  video[this.name] = this.value;
}

function handleProgress() {
  advanceRate = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${advanceRate}%`;
}

// Event listeners
video.addEventListener('click', togglePlay); // allows to play/pause the vid if clicked anywhere on it
toggle.addEventListener('click', togglePlay);
skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', rangeUpdate));
// ranges.forEach(range => range.addEventListener('mousemove', rangeUpdate));
video.addEventListener('timeupdate', handleProgress);
