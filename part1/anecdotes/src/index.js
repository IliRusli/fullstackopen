import React, { useState } from "react";
import ReactDOM from "react-dom";

const Header = ({ title }) => {
  return <h1>{title}</h1>;
};

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

const App = props => {
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Array(6).fill(0));

  const addPoints = () => {
    const copy = [...points];
    // increment the value in selected position by one
    copy[selected] += 1;
    setPoints(copy);
  };

  const mostVotedIndex = points.indexOf(Math.max(...points));
  console.log({ selected, points, mostVotedIndex });

  return (
    <div>
      <Header title={"Anecdote of the day"} />
      {props.anecdotes[selected]}
      <div>has {points[selected]} votes</div>
      <div>
        <Button handleClick={() => addPoints(points)} text="vote" />
        <Button
          handleClick={() => setSelected(getRandomInt(6))}
          text="next anecdote"
        />
      </div>
      <Header title={"Anecdote with most votes"} />
      {props.anecdotes[mostVotedIndex]}
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it."
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
