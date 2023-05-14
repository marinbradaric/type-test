let wordsArr = [];
let wordCount = 10;

const setWordsButtons = document.querySelectorAll(".wordCountBtn");
const setTimeButtons = document.querySelectorAll(".timeBtn");
const randomText = document.getElementById("random-text");
const userInput = document.getElementById("user-input");
const toggleSwitch = document.getElementById("flexSwitchCheckDefault");
const timeTab = document.getElementById("time-tab");
const wordsTab = document.getElementById("words-tab");
// function fetches words from text file
fetch("words.txt")
  .then((response) => response.text())
  .then((text) => {
    const wordsArray = text.split(/\r?\n/);
    wordsArr = [...wordsArray];
    displayWords();
  });

setWordsButtons.forEach((button) => {
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

let timer2 = null;
let countdownTimer = 15;
setTimeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    countdownTimer = parseInt(button.innerText);
    displayInfiniteWords();
    document.getElementById("countdown").innerText = `${countdownTimer} s`;
    userInput.value = "";
    userInput.focus();
    document.getElementById("accuracy").innerText = "Accuracy: ";
    document.getElementById("accuracy").style.color = "white";
    document.getElementById("words-per-minute").innerText = "WPM: ";
    clearInterval(timerInterval);
  });
});

timeTab.addEventListener("click", () => {
  displayInfiniteWords();
  // sets default time to 15 seconds
  document.getElementById("btnradio4").checked = true;
  countdownTimer = 15;
  document.getElementById("countdown").innerText = `${countdownTimer} s`;
});

const displayInfiniteWords = () => {
  wordCount = 10;
  displayWords();
};

wordsTab.addEventListener("click", () => {
  displayWords();
  document.getElementById("btnradio1").checked = true;
  wordCount = 10;
  document.getElementById("countdown").innerText = "";
});

// toggles dark mode
const switchTheme = () => {
  const body = document.body;
  const isDark = body.classList.contains("dark");
  const themeToggle = document.getElementById("flexSwitchCheckDefault");

  if (isDark) {
    body.classList.remove("dark");
    body.classList.add("light");

    const darkElems = document.querySelectorAll(".bg-dark");
    darkElems.forEach((darkElem) => {
      if (!darkElem.classList.contains("exclude-theme-toggle")) {
        darkElem.classList.remove("bg-dark");
        darkElem.classList.add("bg-light");
      }
    });
    // change text from white to black
    const whiteText = document.querySelectorAll(".text-light");
    whiteText.forEach((whiteText) => {
      if (!whiteText.classList.contains("exclude-theme-toggle")) {
        whiteText.classList.remove("text-light");
        whiteText.classList.add("text-dark");
      }
    });

    // change buttons from dark to light
    const darkBtn = document.querySelectorAll(".btn-dark, .btn-close-white");
    darkBtn.forEach((darkBtn) => {
      darkBtn.classList.remove("btn-dark");
      darkBtn.classList.add("btn-light");
      darkBtn.classList.remove("btn-close-white");
      darkBtn.classList.add("btn-close-black");
    });

    // change buttons outline from light to dark
    const darkBtnOutline = document.querySelectorAll(".btn-outline-light");
    darkBtnOutline.forEach((darkBtnOutline) => {
      if (!darkBtnOutline.classList.contains("exclude-theme-toggle")) {
        darkBtnOutline.classList.remove("btn-outline-light");
        darkBtnOutline.classList.add("btn-outline-dark");
      }
    });

    // change border from white to black
    const whiteBorder = document.querySelectorAll(".border-white");
    whiteBorder.forEach((whiteBorder) => {
      whiteBorder.classList.remove("border-white");
      whiteBorder.classList.add("border-black");
    });

    // change icon from sun to moon
    const sun = document.getElementById("sun");
    const moon = document.getElementById("moon");
    sun.classList.remove("d-none");
    moon.classList.add("d-none");
  } else {
    body.classList.remove("light");
    body.classList.add("dark");

    const lightElems = document.querySelectorAll(".bg-light");
    lightElems.forEach((lightElem) => {
      if (!lightElem.classList.contains("exclude-theme-toggle")) {
        lightElem.classList.remove("bg-light");
        lightElem.classList.add("bg-dark");
      }
    });

    // change text from black to white
    const blackText = document.querySelectorAll(".text-dark");
    blackText.forEach((blackText) => {
      if (!blackText.classList.contains("exclude-theme-toggle")) {
        blackText.classList.remove("text-dark");
        blackText.classList.add("text-light");
      }
    });

    // change buttons from light to dark
    const lightBtn = document.querySelectorAll(".btn-light, .btn-close-black");
    lightBtn.forEach((lightBtn) => {
      lightBtn.classList.remove("btn-light");
      lightBtn.classList.add("btn-dark");
      lightBtn.classList.remove("btn-close-black");
      lightBtn.classList.add("btn-close-white");
    });

    // change buttons outline from dark to light
    const lightBtnOutline = document.querySelectorAll(".btn-outline-dark");
    lightBtnOutline.forEach((lightBtnOutline) => {
      if (!lightBtnOutline.classList.contains("exclude-theme-toggle")) {
        lightBtnOutline.classList.remove("btn-outline-dark");
        lightBtnOutline.classList.add("btn-outline-light");
      }
    });

    // change border from black to white
    const blackBorder = document.querySelectorAll(".border-black");
    blackBorder.forEach((blackBorder) => {
      blackBorder.classList.remove("border-black");
      blackBorder.classList.add("border-white");
    });

    // change icon from moon to sun
    const sun = document.getElementById("sun");
    const moon = document.getElementById("moon");
    sun.classList.add("d-none");
    moon.classList.remove("d-none");
  }

  themeToggle.checked = isDark;
};

toggleSwitch.addEventListener("change", switchTheme);
switchTheme();

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
  let totalCharacters;
  let theAccuracy;
  // if wordstab is selected, calculate accuracy based on words
  if (wordsTab.getAttribute("aria-selected") === "true") {
    theAccuracy = calcAccuracy(userText, randomText.innerText);
    totalCharacters = userText.length;
  } else if (timeTab.getAttribute("aria-selected") === "true") {
    theAccuracy = calcAccuracy(typedWords, randomTextStored);
    totalCharacters = typedChars;
  }
  const grossWPM = totalCharacters / 5 / (time / 60);
  const netWPM = grossWPM * theAccuracy;
  const wordsPerMinute = Math.round(netWPM);
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

  let accuracy;
  // if wordstab is selected, calculate accuracy based on words
  if (wordsTab.getAttribute("aria-selected") === "true") {
    accuracy = Math.round(calcAccuracy(userText, randomTextVal) * 100);
  } else if (timeTab.getAttribute("aria-selected") === "true") {
    accuracy = Math.round(calcAccuracy(typedWords, randomTextStored) * 100);
  }

  const accuracyText = `Accuracy: ${accuracy}%`;

  let color = "";
  switch (true) {
    case accuracy >= 75:
      color = "#42ba96";
      break;
    case accuracy <= 25:
      color = "#df4759";
      break;
    default:
      color = "orange";
  }

  const accuracyElem = document.getElementById("accuracy");
  accuracyElem.style.color = color;
  accuracyElem.innerText = accuracyText;
}

// changes color of text based on user input
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
  clearInterval(countdownInterval);
  if (timeTab.getAttribute("aria-selected") === "true") {
    document.getElementById("countdown").innerText = `${countdownTimer} s`;
  }
  displayWords();
  userInput.value = "";
  userInput.focus();
  startTime = null;
  countdownInterval = null;
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
      userInput.focus();
    }
  });
  typedWords = "";
  randomTextStored = "";
};

let startTime, start, endTime, end, timerInterval;

// checks if user has typed all the words
const isLastChar = () => userInput.value.length === randomText.innerText.length;

let typedChars = 0;

let typedWords = "";
let randomTextStored = "";

userInput.addEventListener("input", (e) => {
  if (timeTab.getAttribute("aria-selected") === "true") {
    if (e.data === " ") {
      // remove typed word and store it in a variable
      typedWords += `${userInput.value}`;
      randomTextStored += `${randomText.innerText.split(" ")[0]} `;
      const firstWord = randomText.innerText.split(" ")[0];
      randomText.innerText = randomText.innerText.replace(`${firstWord} `, "");
      userInput.value = "";
      // add a new word to the end of the text
      const randomIndex = Math.floor(Math.random() * wordsArr.length);
      const newWord = wordsArr[randomIndex];
      randomText.innerText = `${randomText.innerText} ${newWord}`;
    }
  }

  changeColor(userInput);
  if (wordsTab.getAttribute("aria-selected") === "true") {
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
  } else if (timeTab.getAttribute("aria-selected") === "true") {
    // count typed characters
    typedChars = typedWords.length;
  }
});

let countdownInterval = null;

const startCountdown = () => {
  let countdownValue = countdownTimer;
  const countdownElement = document.getElementById("countdown");
  countdownInterval = setInterval(() => {
    countdownValue -= 0.01;
    countdownElement.innerText = `${countdownValue.toFixed(2)} s`;

    if (countdownValue <= 0) {
      userInput.disabled = true;
      finishWindow(countdownTimer);
      displayInfiniteWords();
      clearInterval(countdownInterval);
      countdownValue = countdownTimer;
      countdownElement.innerText = `${countdownValue} s`;
      userInput.disabled = false;
      countdownInterval = null;
    }
  }, 10);
};

userInput.addEventListener("keydown", (e) => {
  // check whether the time or words tab is selected
  if (wordsTab.getAttribute("aria-selected") === "true") {
    if (!startTime) {
      clearInterval(timerInterval);
      startTime = new Date();
      start = startTime.getTime();
      // start the timer interval
      timerInterval = setInterval(() => {
        let currentTime = new Date().getTime();
        let elapsedTime = (currentTime - start) / 1000;
        document.getElementById(
          "timer"
        ).innerText = `Time: ${elapsedTime.toFixed(2)} seconds`;
      }, 10);
      userInput.value = "";
    }

    // disable 2 spaces
    if (e.key === " " && userInput.value.slice(-1) === " ") {
      e.preventDefault();
    }
  } else if (timeTab.getAttribute("aria-selected") === "true") {
    if (!countdownInterval) {
      startCountdown();
    }
    document.getElementById(
      "timer"
    ).innerText = `Time: ${countdownTimer} seconds`;
  }
});
