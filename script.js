// ===== ORIGINAL VERSION =====
// const display = document.querySelector("#display");
// let timerId = null;
// let startTime = 0;
// let elapsedTime = 0;
// let isRunning = false;

// function start() {
//   if (!isRunning) {
//     startTime = Date.now() - elapsedTime;
//     timerId = setInterval(update, 10);
//     isRunning = true;
//   }
// }

// function stop() {
//   if (isRunning) {
//     elapsedTime = Date.now() - startTime;
//     clearInterval(timerId);
//     isRunning = false;
//     // let lapsContainer = document.querySelector("#laps");
//     // let ul = lapsContainer.querySelector("ul");
//     // if (ul) ul.innerHTML = "";
//   }
// }

// function reset() {
//   display.textContent = "00:00:00:00";
//   clearInterval(timerId);
//   timerId = null;
//   startTime = 0;
//   elapsedTime = 0;
//   isRunning = false;
//   let lapsContainer = document.querySelector("#laps");
//   let ul = lapsContainer.querySelector("ul");
//   if (ul) ul.innerHTML = "";
// }

// function lap() {
//   let lapsContainer = document.querySelector("#laps");
//   if (!lapsContainer.querySelector("h2")) {
//     let title = document.createElement("h2");
//     title.textContent = "Lap Times";
//     lapsContainer.appendChild(title);
//   }
//   if (!lapsContainer.querySelector("ul")) {
//     let ul = document.createElement("ul");
//     lapsContainer.appendChild(ul);
//   }
//   let ul = lapsContainer.querySelector("ul");
//   let lapTime = display.textContent;
//   let lapElement = document.createElement("li");
//   lapElement.textContent = `Lap ${ul.children.length + 1}: ${lapTime}`;
//   ul.appendChild(lapElement);
// }
// function update() {
//   elapsedTime = Date.now() - startTime;
//   let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
//   let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
//   let seconds = Math.floor((elapsedTime / 1000) % 60);
//   let milliseconds = Math.floor((elapsedTime % 1000) / 10);

//   display.textContent = `${addPadding(hours)}:${addPadding(minutes)}:${addPadding(seconds)}:${addPadding(milliseconds)}`;
// }

// function addPadding(num, size = 2) {
//   let s = num.toString();
//   return s.padStart(size, "0");
// }


//& ===== ENHANCED VERSION WITH ARRAY-BASED LAPS =====

const display = document.querySelector("#display");
let timerId = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let laps = [];

function start() {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime;
    timerId = setInterval(update, 10);
    isRunning = true;
  }
}

function stop() {
  if (isRunning) {
    elapsedTime = Date.now() - startTime;
    clearInterval(timerId);
    isRunning = false;
  }
}

function reset() {
  display.textContent = "00:00:00:00";
  clearInterval(timerId);
  timerId = null;
  startTime = 0;
  elapsedTime = 0;
  isRunning = false;
  laps = [];
  renderLaps();
}

function lap() {
  if (isRunning) {
    laps.push(elapsedTime);
    renderLaps();
  }
}

function clearLaps() {
  laps = [];
  renderLaps();
}

function renderLaps() {
  const ul = document.querySelector("#laps");
  ul.innerHTML = "";
  laps.forEach((lapTime, index) => {
    const li = document.createElement("li");
    li.textContent = `Lap ${index + 1} - ${formatTime(lapTime)}`;
    ul.appendChild(li);
  });
  // Color fastest and slowest
  if (laps.length > 1) {
    const minTime = Math.min(...laps);
    const maxTime = Math.max(...laps);
    const lis = ul.querySelectorAll("li");
    lis.forEach((li, index) => {
      if (laps[index] === minTime) {
        li.style.color = "green";
      } else if (laps[index] === maxTime) {
        li.style.color = "red";
      } else {
        li.style.color = "#34495e"; // default color
      }
    });
  }
}

function update() {
  elapsedTime = Date.now() - startTime;
  display.textContent = formatTime(elapsedTime);
}

function formatTime(time) {
  const hours = Math.floor(time / (1000 * 60 * 60));
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const seconds = Math.floor((time / 1000) % 60);
  const milliseconds = Math.floor((time % 1000) / 10);
  return `${addPadding(hours)}:${addPadding(minutes)}:${addPadding(seconds)}:${addPadding(milliseconds)}`;
}

function addPadding(num, size = 2) {
  const s = num.toString();
  return s.padStart(size, "0");
}

