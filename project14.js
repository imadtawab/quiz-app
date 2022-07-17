// < > , ?
let question = document.querySelector(".quiz .question");
let answer1 = document.querySelector(".quiz .answer #answer-1 + label");
let answer2 = document.querySelector(".quiz .answer #answer-2 + label");
let answer3 = document.querySelector(".quiz .answer #answer-3 + label");
let answer4 = document.querySelector(".quiz .answer #answer-4 + label");
let btnSubmit = document.querySelector(".submit-Button");
let questionsCount = document.querySelector(".count span");
let spansCount = document.querySelector(".spans-count");
let result = document.querySelector(".result");
let minutes = document.querySelector(".counter .minutes");
let seconds = document.querySelector(".counter .seconds");
let counterQuestions = 0;
let rightAnswer;
let objects;
let setTimeOut;
let numberRightReponses = 0;
function getQuestions() {
  let questionsObject;
  let myReg = new XMLHttpRequest();
  myReg.open("GET", "questions.json", true);
  myReg.send();
  myReg.onreadystatechange = () => {
    if (myReg.readyState == 4 && myReg.status == 200) {
      questionsObject = JSON.parse(myReg.responseText);
      randomQuestionsObject(questionsObject);
      getNumberQuestions(questionsObject.length);
      controlTime();
    } else if (myReg.readyState == 4 && myReg.status == 404) {
      document.querySelector(".quiz").innerHTML =
        "<h1 style='color:red;'>ERROR 404<h1>";
    }
  };
}
getQuestions();
function randomQuestionsObject(objects) {
  let randomQuestionsArray = [];
  let length = objects.length;
  for (let i = 0; i < length; i++) {
    let randomNumber = Math.floor(Math.random() * (length - i));
    randomQuestionsArray.push(objects[randomNumber]);
    objects.splice(randomNumber, 1);
  }
  addQuestionsInBody(randomQuestionsArray);
}

function addQuestionsInBody(randomQuestionsArray) {
  let item = randomQuestionsArray[counterQuestions];
  if (counterQuestions < randomQuestionsArray.length) {
    question.innerText = item.title;
    answer1.innerText = item.answer_1;
    answer2.innerText = item.answer_2;
    answer3.innerText = item.answer_3;
    answer4.innerText = item.answer_4;
    getRightAnswer(randomQuestionsArray, item.right_answer);
  }
}

function getRightAnswer(randomQuestionsArray, right_answer) {
  rightAnswer = right_answer;
  objects = randomQuestionsArray;
}
btnSubmit.onclick = () => {
  checkReponse();
  clearTimeout(setTimeOut);
  controlTime();
};
function checkReponse() {
  if (counterQuestions < objects.length) {
    let userReponse = document.querySelector("input:checked + label").innerText;
    if (userReponse == rightAnswer) {
      numberRightReponses++;
    }
    counterQuestions++;
    addQuestionsInBody(objects);
    if (counterQuestions + 1 < objects.length) {
      document
        .querySelector(`.spans-count span:nth-child(${counterQuestions + 1})`)
        .classList.add("active");
    }
    document.querySelector(".answers-area .answer #answer-1").checked = true;
  } else {
    clearTimeout(setTimeOut);
  }
  setTimeout(() => {
    checkFinish();
  }, 500);
}
function getNumberQuestions(leng) {
  // Number Questions in QuestionsCount
  questionsCount.innerText = objects.length;
  // Create spans Count
  for (let i = 0; i < objects.length; i++) {
    if (i == 0) {
      spansCount.innerHTML += "<span class='active'></span>";
    } else {
      spansCount.innerHTML += "<span></span>";
    }
  }
}
function controlTime(min = 0, sec = 30) {
  if (counterQuestions < 9) {
    setTimeOut = setInterval(() => {
      if (sec >= 0) {
        sec--;
        sec < 10 ? (seconds.innerText = `0${sec}`) : (seconds.innerText = sec);

        min < 10 ? (minutes.innerText = `0${min}`) : (minutes.innerText = min);
      } else {
        if (min > 0) {
          sec = 59;
          seconds.innerText = sec;
          min--;
          min < 10
            ? (minutes.innerText = `0${min}`)
            : (minutes.innerText = min);
        }
      }
      if (min == 0 && sec == 0) {
        setTimeout(() => {
          btnSubmit.classList.add("finish");
        }, 1000);
        setTimeout(() => {
          btnSubmit.click();
          btnSubmit.classList.remove("finish");
        }, 2000);
      }
    }, 1000);
  }
}
function checkFinish() {
  if (counterQuestions == objects.length) {
    document.querySelector(".quiz").remove();
    document.querySelector(".footer .parent").remove();
    if (numberRightReponses === objects.length) {
      result.innerHTML = ` <span class="perfect">Perfect :</span> You Answered <span class="to perfect">${numberRightReponses}</span> from <span class="from perfect">${objects.length}</span>`;
    } else if (
      numberRightReponses > objects.length / 2 &&
      numberRightReponses < objects.length
    ) {
      result.innerHTML = ` <span class="good">Good :</span> You Answered <span class="to good">${numberRightReponses}</span> from <span class="from perfect">${objects.length}</span>`;
    } else {
      result.innerHTML = ` <span class="bad">Bad :</span> You Answered <span class="to bad">${numberRightReponses}</span> from <span class="from perfect">${objects.length}</span>`;
    }
    document.querySelector(".container").innerHTML +=
      "<button class='replay-btn'>Replay</button>";
  }
}
document.querySelector(".container").onclick = (eo) => {
  if (eo.target.classList == "replay-btn") {
    location.reload();
  }
};
