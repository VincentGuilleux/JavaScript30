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

function progressBarUpdate(e) {
  advanceTime = (event.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = parseFloat(advanceTime);
}

function fullScreen() {
  video.requestFullscreen();
}
// Event listeners
video.addEventListener('click', togglePlay); // allows to play/pause the vid if clicked anywhere on it


video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', rangeUpdate));
// ranges.forEach(range => range.addEventListener('mousemove', rangeUpdate));

// le boolean mousedown stocke le fait que le clic souris soit enfoncé ou non.
let mousedown = false;
progress.addEventListener('click', progressBarUpdate);
// L'event listener sur le mousemove sur la barre d'avancement ne se déclenche que si mousedown est true (sans cette cond° additionnelle, dès qu'on passe la souris sur la barre d'avancement (=mousemove) la fonction progressBarUpdate est appelée)
// Comme la fonction progressBarUpdate a besoin de l'event, ce paramètre doit être passé dans l'arrow function ci-dessous
progress.addEventListener('mousemove', (e) => mousedown && progressBarUpdate(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
fullscreen.addEventListener('click', fullScreen);
