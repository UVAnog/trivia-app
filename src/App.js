import React, { useState, useEffect } from "react";
import QuestionList from "./components/QuestionList";
import "./App.css";
export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [score, setScore] = useState(0);

  // note: sort(() => Math.random() - 0.5), returns with equal
  // probability that the first number is greater than the second,
  // or vice versa, which makes the shuffle work much better.
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10")
      .then((res) => res.json())
      .then((res) => {
        const questions = res.results.map((question) => ({
          ...question,
          answers: [
            question.correct_answer,
            ...question.incorrect_answers,
          ].sort(() => Math.random() - 0.5),
        }));
        setQuestions(questions);
      });
  }, []);

  //when someone selects an answer, if it is the correct one, raise the score.
  //set show answers to true regardless i.e if they miss it shows the correct answer
  const handleAnswer = (answer) => {
    if (!showAnswers) {
      if (answer === questions[currentIndex].correct_answer) {
        setScore(score + 1);
      }
    }
    setShowAnswers(true);
  };

  // moving to the next question, move the index up one, don't give away the answer
  const handleNextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setShowAnswers(false);
  };

  //to restart the game
  function refreshPage() {
    window.location.reload();
  }

  return currentIndex < 10 ? (
    <div className="container">
      {currentIndex >= questions.length ? (
        <div className="container">Loading Questions...</div>
      ) : (
        <QuestionList
          showScore={score}
          handleAnswer={handleAnswer}
          showAnswers={showAnswers}
          handleNextQuestion={handleNextQuestion}
          data={questions[currentIndex]}
        />
      )}
    </div>
  ) : (
    <div class="container">
      <h1 className="final">You scored {score} out of 10</h1>
      <button class="restart-button" onClick={refreshPage}>
        Play Again
      </button>
    </div>
  );
}
