import React, {useState, useEffect} from "react";
import {QUESTIONS} from "./questions";
import "./index.css"

const STORAGE_KEY = 'QuizScores'

const App = () => {
  const [currentQuestionNo, setCurrentQuestionNo] = useState(1);
  const [score, setScore] = useState(0);
  const [isQuizDone, setIsQuizDone] = useState(false)
  const [averageScore, setAverageScore] = useState(0)
  

  const totalQuestions = Object.keys(QUESTIONS).length;

  const getStoredScores = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

  useEffect(() => {
    const persistedScores = getStoredScores();
    setAverageScore(calculateAvgScore(persistedScores));
  },[])

  useEffect(() => {
    if(isQuizDone){
      const persistedScores = getStoredScores();
      persistedScores.push(score);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedScores));
      setAverageScore(calculateAvgScore(persistedScores))
    }
  },[isQuizDone])

  const handleAnswer = (isYes) => {
    if(isYes){
      setScore(score+1)
    }

    if(currentQuestionNo<totalQuestions){
      setCurrentQuestionNo(currentQuestionNo+1)
    }else{
      setIsQuizDone(true)
    }
  }

  const onRestartQuiz = () => {
    setIsQuizDone(false);
    setCurrentQuestionNo(1);
    setScore(0)
  }

  const calculateAvgScore = (scores) => {
    if(scores.length === 0) return 0;

    const currentTotalScore = scores.reduce((acc, score) => acc+score,0)
    const availableTotalScore = scores.length*totalQuestions
    const currentAverage = currentTotalScore/availableTotalScore
    // console.log(currentTotalScore, availableTotalScore, 1111, Math.round(currentAverage*1000)/1000)
    return Math.round(currentAverage*1000)/1000;
  }
  // console.log(QUESTIONS, QUESTIONS["1"], averageScore*100)

  return (
      <div className="main__wrap">
        <main className="quiz-container">
          <header className="quiz-question">
          <h1>Question {currentQuestionNo} of {totalQuestions}</h1>
          <h2>
            {QUESTIONS[String(currentQuestionNo)]}
          </h2>
          </header>
          <div className="answer-buttons">
          <button className="answer-button" onClick={() => handleAnswer(true)} disabled={isQuizDone}>Yes</button>
          <button className="answer-button" onClick={() => handleAnswer(false)} disabled={isQuizDone}>No</button>
          <button className="answer-button" onClick={onRestartQuiz} disabled={!isQuizDone}>Restart Quiz</button>
          </div>
          
          <footer className="quiz-summary">
            <p>Your {isQuizDone ? 'Final' : 'Current'} Score: <mark>{score*100/totalQuestions}%</mark></p>
            <section>
              <p>Your Average Score: <mark>{Number(averageScore*100).toFixed(1)}%</mark></p>
              <em>Note average score will be only calculated/updated only after finishing current Quiz</em>
            </section>
            </footer>
        </main>
      </div>
    );
}

export default App;
