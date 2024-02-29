const URL = `tm-my-image-model/`;


let model, webcam, maxPredictions, Fresh, Rotten, progressBar, predictionResult, videoFeed;

let refresh = true;

// Load the image model and setup the webcam
async function init() {
  if (refresh) {
    refresh = false;
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();

    // Access updated elements using their IDs from index.html
    videoFeed = document.getElementById("videoFeed");
    predictionResult = document.getElementById("predictionResult");
    progressBar = document.querySelector(".progress-bar");
    Fresh = document.getElementById("Fresh");
    Rotten = document.getElementById("Rotten");

    videoFeed.appendChild(webcam.canvas); // Append canvas to video element
    window.requestAnimationFrame(loop);
  } else {
    location.reload();
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// Run the webcam image through the image model
async function predict() {
  predictionResult.textContent = "Analyzing...";
  progressBar.style.width = "0%"; // Reset progress bar

  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].className == "Fresh") {
      const freshProgress = document.getElementById("Fresh-progress");
      const freshValue = document.getElementById("Fresh");

      // Add animated classes to trigger animations
      freshProgress.classList.add("progress-bar-animated");
      freshValue.classList.add("probability-value-animated");

      // Set progress values, animating the bars and values
      freshProgress.value = prediction[i].probability.toFixed(2);
      freshValue.innerHTML = prediction[i].probability.toFixed(2);
    }

    if (prediction[i].className == "Rotten") {
      const staleProgress = document.getElementById("Rotten-progress");
      const staleValue = document.getElementById("Rotten");

      // Add animated classes to trigger animations
      staleProgress.classList.add("progress-bar-animated");
      staleValue.classList.add("probability-value-animated");

      // Set progress values, animating the bars and values
      staleProgress.value = prediction[i].probability.toFixed(2);
      staleValue.innerHTML = prediction[i].probability.toFixed(2);
    }
  }

  predictionResult.textContent = prediction[0].className; // Display top prediction
}


