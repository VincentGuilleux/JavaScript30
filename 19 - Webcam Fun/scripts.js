// NB: USE NPM START ON YOUR TERMINAL TO LAUNCH THE PAGE //

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error(`OH NO!!!`, err);
    })
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height); // pixels.data is an huge array of numbers for all rgba values of all pixels. For every pixel, 4 entries for rgba. So 0, 1, 2, 3 correspond to rgba of first pixel then 4,5,6,7 for second pixel...
    // console.log(pixels);
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 16);

}

function takePhoto() {
  // plays the snap sound
  snap.currentTime = 0;
  snap.play();

  // takes the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  // The HTMLCanvasElement.toDataURL() method returns a data URI containing a representation of the image in the format specified by the type parameter (defaults to PNG). The returned image is in a resolution of 96 dpi.
  // => data = txt string storing the image starting with data:image/jpeg:base64,...
  const link = document.createElement('a'); // creates hyperlink tag
  link.href = data;
  link.setAttribute('download', 'handsome'); // handsome is the name of the file to downlad
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`; // inserts the image in the hyperlink tag (so there is an img src tag inside the a tag)
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) { // looping over all pixels (4 values rgba for each thats why its incremented by 4 every round). Need to loop over pixels.data and not pixels because pixels is not an array
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {}; // will hold minimum and maximum green

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out if all conditions are met by setting alpha (transparency) to 0!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();
video.addEventListener('canplay', paintToCanvas);
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
// The canplay event is fired when the user agent can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
