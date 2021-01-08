import React, { useState } from "react";
import ReactDOM from "react-dom";

const Header = ({ title }) => {
  return <h1>{title}</h1>;
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = (good + neutral * 0 + bad * -1) / total;
  const positive = (good / total) * 100;

  if (total) {
    return (
      <div>
        <Header title={"statistics"} />
        <table>
          <Statistic text={"good"} value={good} />
          <Statistic text={"neutral"} value={neutral} />
          <Statistic text={"bad"} value={bad} />
          <Statistic text={"total"} value={total} />
          <Statistic text={"average"} value={average} />
          <Statistic text={"positive"} value={positive} />
        </table>
      </div>
    );
  } else {
    return (
      <div>
        <Header title={"statistics"} />
        <p>No feedback given</p>
      </div>
    );
  }
};

const Statistic = ({ text, value }) => {
  if (text == "positive") {
    return (
      <tr>
        <td>{text}</td>
        <td>{value} %</td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <Header title={"give feedback"} />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
