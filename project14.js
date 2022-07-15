// < > , ?
let counterQuestions = 0
let rightAnswer
let objects
let numberRightReponses = 0
function getQuestions() {
    let questionsObject
    let myReg = new XMLHttpRequest()
    myReg.open("GET","questions.json",true)
    myReg.send()
    
    myReg.onreadystatechange = () => {
        if(myReg.readyState == 4 && myReg.status == 200){
            questionsObject = JSON.parse(myReg.responseText)
            randomQuestionsObject(questionsObject)
            getNumberQuestions(questionsObject.length)
            
        }else if(myReg.readyState == 4 && myReg.status == 404){
            document.querySelector(".quiz").innerHTML = "<h1 style='color:red;'>ERROR 404<h1>"
        }
    }
}
getQuestions()


function randomQuestionsObject(objects) {
    let randomQuestionsArray = []
    let length = objects.length
    for(let i = 0;i < length ;i++){
        let randomNumber = Math.floor(Math.random() * (length - i))
        randomQuestionsArray.push(objects[randomNumber])
        objects.splice(randomNumber,1)
    }
    addQuestionsInBody(randomQuestionsArray)
}
let question = document.querySelector(".quiz .question")
let answer1 = document.querySelector(".quiz .answer #answer-1 + label")
let answer2 = document.querySelector(".quiz .answer #answer-2 + label")
let answer3 = document.querySelector(".quiz .answer #answer-3 + label")
let answer4 = document.querySelector(".quiz .answer #answer-4 + label")
function addQuestionsInBody(randomQuestionsArray){
    let item = randomQuestionsArray[counterQuestions]
    question.innerText = item.title
    answer1.innerText = item.answer_1
    answer2.innerText = item.answer_2
    answer3.innerText = item.answer_3
    answer4.innerText = item.answer_4
    getRightAnswer(randomQuestionsArray,item.right_answer)
}

function getRightAnswer(randomQuestionsArray,right_answer) {
    rightAnswer = right_answer
    objects = randomQuestionsArray
    
}
let btnSubmit = document.querySelector(".submit-Button")
btnSubmit.onclick = () => {
    checkReponse()
    clearTimeout(setTimeOut)
    controlTime()
}
function checkReponse(){
    if(counterQuestions < objects.length){
        let userReponse = document.querySelector("input:checked + label").innerText
        // console.log(rightAnswer)
        if(userReponse == rightAnswer){
            console.log("true")
            numberRightReponses++
            console.log(numberRightReponses)
        }else{
            console.log("false")
        }
        counterQuestions++
        addQuestionsInBody(objects)
        document.querySelector(`.spans-count span:nth-child(${counterQuestions+1})`).classList.add("active")
        document.querySelector(".answers-area .answer #answer-1").checked=true
    }else{
            clearTimeout(setTimeOut)
            btnSubmit.classList.add("finish")
        }
        checkFinish()
}





let questionsCount = document.querySelector(".count span")
let spansCount = document.querySelector(".spans-count")
// let numberFrom = document.querySelector(".result .from")
let result = document.querySelector(".result")
function getNumberQuestions(leng) {
    // Number Questions in QuestionsCount
    questionsCount.innerText = objects.length
    // Create spans Count
    for(let i = 0;i < objects.length ;i++){
        if(i==0){
            spansCount.innerHTML += "<span class='active'></span>"
        }else{
            spansCount.innerHTML += "<span></span>"
        }
        
    }
}


let minutes = document.querySelector(".counter .minutes")
let seconds = document.querySelector(".counter .seconds")
let setTimeOut
function controlTime(min=1,sec=10){
    if(counterQuestions < 9){
    setTimeOut = setInterval(() => {
        
        if(sec >= 0){
            sec < 10 ? seconds.innerText = `0${sec}`:seconds.innerText = sec
            sec--
            min < 10 ? minutes.innerText = `0${min}`:minutes.innerText = min
        }else{
            if(min > 0){
            sec = 59
            seconds.innerText = sec
            min--
            min < 10 ? minutes.innerText = `0${min}`:minutes.innerText = min
            
            }
        }
        if(min == 0&&sec == 0){
            setTimeout(() => {

            btnSubmit.classList.add("finish")
        },1000)
            setTimeout(() => {

                checkReponse()
                controlTime()
                btnSubmit.classList.remove("finish")
            },2000)
            
        }
        

    },1000)
}
}

controlTime()

function checkFinish(){
    if(counterQuestions+1 == objects.length){
        document.querySelector(".quiz").remove()
        document.querySelector(".footer .parent").remove()
        if(counterQuestions === objects.length){
            result.innerHTML=` <span class="perfect">Perfect :</span> You Answered <span class="to">${counterQuestions+1}</span> from <span class="from">${objects.length}</span>`
        }else if(counterQuestions < objects.length/2 && counterQuestions !== objects.length){
            result.innerHTML=` <span class="goog">Good :</span> You Answered <span class="to">${counterQuestions+1}</span> from <span class="from">${objects.length}</span>`
        }else{
            result.innerHTML=` <span class="bad">Bad :</span> You Answered <span class="to">${counterQuestions+1}</span> from <span class="from">${objects.length}</span>`
        }
    }
}