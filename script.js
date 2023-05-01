let wordsArr = [];
let wordCount = 10;

const setButtons = document.querySelectorAll(".wordCountBtn");
const randomText = document.getElementById("random-text");
const userInput = document.getElementById("user-input");
const modalClose = document.getElementById("modal-close");
// function fetches words from text file
fetch("words.txt")
  .then((response) => response.text())
  .then((text) => {
    const wordsArray = text.split(/\r?\n/);
    wordsArr = [...wordsArray];
    displayWords();
  });

setButtons.forEach((button) => {
  button.addEventListener("click", () => {
    wordCount = parseInt(button.innerText);
    displayWords();
    userInput.value = "";
    userInput.focus();
    document.getElementById("accuracy").innerText = "Accuracy: ";
    document.getElementById("accuracy").style.color = "white";
    document.getElementById("words-per-minute").innerText = "WPM: ";
    clearInterval(timerInterval);
    document.getElementById("timer").innerText = "Time: ";
  });
});

// generates random words
function generateWords() {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    let randomIndex = Math.floor(Math.random() * wordsArr.length);
    words.push(wordsArr[randomIndex]);
  }
  return words;
}

// displays random words
function displayWords() {
  let words = generateWords();
  randomText.innerText = words.join(" ");
}

displayWords();

// calculates Words Per Minute
const calculateWPM = (time) => {
  const userText = userInput.value;
  const totalCharacters = userText.length;
  const grossWPM = totalCharacters / 5 / (time / 60);
  const netWPM = grossWPM * calcAccuracy(userText, randomText.innerText);
  wordsPerMinute = Math.round(netWPM);
  document.getElementById(
    "words-per-minute"
  ).innerText = `WPM: ${wordsPerMinute}`;
};

// prevents user from selecting text
randomText.addEventListener("selectstart", (e) => {
  e.preventDefault();
});

// calculates accuracy using Levenshtein distance algorithm
const calcAccuracy = (s1, s2) => {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  let longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
};

const editDistance = (s1, s2) => {
  let costs = new Array();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
};

function calculateAccuracy() {
  const [userText, randomTextVal] = [userInput.value, randomText.innerText];

  let accuracy = Math.round(calcAccuracy(userText, randomTextVal) * 100);
  if (accuracy >= 75) {
    document.getElementById("accuracy").style.color = "#42ba96";
  } else if (accuracy <= 25) {
    document.getElementById("accuracy").style.color = "#df4759";
  } else if (accuracy > 25 && accuracy < 75) {
    document.getElementById("accuracy").style.color = "orange";
  }
  document.getElementById("accuracy").innerText = "Accuracy: " + accuracy + "%";
}

// change color of each letter as user types
userInput.addEventListener("input", () => {
  changeColor(userInput);
});

const changeColor = (input) => {
  const arrayText = randomText.textContent.split("");
  const arrayValue = input.value.split("");

  let newInnerHTML = "";
  arrayText.forEach((character, index) => {
    let colorClass = "";
    if (index < arrayValue.length) {
      colorClass = character === arrayValue[index] ? "correct" : "incorrect";
    }

    newInnerHTML += `<span class="${colorClass}">${character}</span>`;
  });

  randomText.innerHTML = newInnerHTML;
};

// resets text and timer
const resetText = () => {
  clearInterval(timerInterval);
  displayWords();
  userInput.value = "";
  userInput.focus();
  startTime = null;
};

// displays "results" modal after user finishes typing
const finishWindow = (totalTime) => {
  clearInterval(timerInterval);
  calculateAccuracy();
  calculateWPM(totalTime);
  userInput.value = "";
  document.getElementById("modal-button").click();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
};

let startTime, start, endTime, end, timerInterval;

// checks if user has typed all the words
const isLastChar = () => {
  if (userInput.value.length === randomText.innerText.length) {
    return true;
  }
  return false;
};

const closeModal = () => {
  userInput.focus();
};

userInput.addEventListener("input", () => {
  if (isLastChar()) {
    userInput.disabled = true;
    clearInterval(timerInterval);
    endTime = new Date();
    end = endTime.getTime();
    let totalTime = (end - start) / 1000;
    finishWindow(totalTime);
    displayWords();
    userInput.value = "";
    userInput.disabled = false;
    startTime = null;
  }
});

userInput.addEventListener("keydown", (e) => {
  if (!startTime) {
    clearInterval(timerInterval);
    startTime = new Date();
    start = startTime.getTime();
    // start the timer interval
    timerInterval = setInterval(() => {
      let currentTime = new Date().getTime();
      let elapsedTime = (currentTime - start) / 1000;
      document.getElementById("timer").innerText = `Time: ${elapsedTime.toFixed(
        2
      )} seconds`;
    }, 10);
    userInput.value = "";
  }

  // disable 2 spaces
  if (e.key === " " && userInput.value.slice(-1) === " ") {
    e.preventDefault();
  }
});
