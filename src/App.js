import React, { Component } from 'react';
import InputPage from './InputPage';
import ScoringPage from './ScoringPage';
// import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfSets: 0,
      teamAName: '',
      teamBName: '',
      rotationA: [],
      rotationB: [],
      gameStarted: false
    };
  }

  handleStartGame = (data) => {
    this.setState({
      numberOfSets: data.numberOfSets,
      teamAName: data.teamAName,
      teamBName: data.teamBName,
      rotationA: data.rotationA,
      rotationB: data.rotationB,
      gameStarted: true
    });
  };

  render() {
    const { gameStarted, teamAName, teamBName, numberOfSets, rotationA, rotationB } = this.state;

    return (
      <div>
        {!gameStarted && (
          <InputPage onSubmit={this.handleStartGame} />
        )}

        {gameStarted && (
          <ScoringPage
            teamAName={teamAName}
            teamBName={teamBName}
            numberOfSets={numberOfSets}
            rotationA={rotationA}
            rotationB={rotationB}
          />
        )}
      </div>
    );
  }
}

export default App;
