// ScoringPage.js

import React, { Component } from 'react';
import './ScoringPage.css';

class ScoringPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlyServing: 'A',
      scores: {
        A: 0,
        B: 0,
      },
      sets: {
        A: 0,
        B: 0,
      },
      rotations: {
        A: this.props.rotationA,
        B: this.props.rotationB,
      },
      setOver: false,
      setWinner: null,
      matchOver: false,
      setSummary: '',
      winner: '',
      numberOfSets: this.props.numberOfSets,
    };
  }

  nextSet = (setWinner) => {
    const { sets, sets: { A, B } } = this.state;
    let setWinnerScore = sets[setWinner];

    this.setState({
      sets: {
        ...sets,
        [setWinner]: setWinnerScore + 1,
      },
      scores: {
        A: 0,
        B: 0,
      },
      setOver: false,
      setWinner: null,
      matchOver: setWinnerScore + 1 >= this.props.numberOfSets,
      
    }, () => {
      if (this.state.matchOver) {
        this.handleMatchOver(); 
      }
      
    });
  };

  rotate = (team) => {
    const { rotations } = this.state;
    let newRotation = rotations[team];
    let server = newRotation.shift();
    newRotation.push(server);

    return newRotation;
  };

  onScoreboardChangeA = (operator) => {
    const {
      scores,
      scores: { A, B },
      currentlyServing,
      rotations,
      rotations: { A: RotationA },
    } = this.state;

    if (operator === '+') {
      let newScore = A + 1;
      let setOver = newScore >= 25 && newScore - B >= 2;
      let newRotation = currentlyServing === 'B' ? this.rotate('A') : RotationA;
      this.setState({
        ...this.state,
        scores: {
          ...scores,
          A: newScore,
        },
        setOver,
        currentlyServing: 'A',
        rotations: {
          ...rotations,
          A: newRotation,
        },
        setWinner: setOver ? 'A' : null,
      }, () => {
        if (setOver) {
          this.checkMatchOver(); 
        }
      });
    }
    if (operator === '-') {
      this.setState({
        ...this.state,
        scores: {
          ...scores,
          A: A - 1,
        },
      });
    }
  };

  onScoreboardChangeB = (operator) => {
    const {
      scores,
      scores: { A, B },
      currentlyServing,
      rotations,
      rotations: { B: RotationB },
    } = this.state;

    if (operator === '+') {
      let newScore = B + 1;
      let setOver = newScore >= 25 && newScore - A >= 2;
      let newRotation = currentlyServing === 'A' ? this.rotate('B') : RotationB;
      this.setState({
        ...this.state,
        scores: {
          ...scores,
          B: newScore,
        },
        setOver,
        currentlyServing: 'B',
        rotations: {
          ...rotations,
          B: newRotation,
        },
        setWinner: setOver ? 'B' : null,
      }, () => {
        if (setOver) {
          this.checkMatchOver(); // Check if the match is over after each score
        }
      });
    }
    if (operator === '-') {
      this.setState({
        ...this.state,
        scores: {
          ...scores,
          B: B - 1,
        },
      });
    }
  };

  checkMatchOver = () => {
    const { sets, numberOfSets } = this.state;
    const { teamAName, teamBName } = this.props;
    
    
    const matchOver = sets.A > 0 && sets.B > 0 && (sets.A + sets.B === numberOfSets);
    
    if (matchOver) {
      const winner = sets.A > sets.B ? teamAName : teamBName;
  
      this.setState({
        winner, // Set winner first
        matchOver: true,
      });
      
      console.log(`checked ${sets.A} - ${sets.B}  ${numberOfSets}`);
    }
  };
  
  

  handleMatchOver = () => {
    const { sets } = this.state;
    const { teamAName, teamBName } = this.props;
    const setSummary = `${sets.A} - ${sets.B}`
    console.log(setSummary);
    const winner = sets.A > sets.B ? teamAName : teamBName;
    return (
      <div className='result-container'>
        <div className="setpoint">{setSummary}</div>
        <div className="result">Winner: {winner}</div>
      </div>
    );
  };

  render() {
    const {
      scores: { A: ScoreA, B: ScoreB },
      setOver,
      rotations: { A: RotationA, B: RotationB },
      currentlyServing,
      sets: { A: SetsA, B: SetsB },
    } = this.state;

    // ;
    const { matchOver } = this.state;

    if (matchOver) {
      return (
        <div>
          {matchOver && this.handleMatchOver()}
        </div>
      );
    }
    
  
    return (
      <div>
        <h1 className='title'>Scoreboard</h1>
        <div className="container">
          <div className="team-container">
            <div className="scoreboard">
              <div className="team-label">{this.props.teamAName}</div>
              <div className="score">{ScoreA}</div>
              <div className="rotation">
                Rotation
                <hr />
                <div className="rotation-row">
                  <span>4: {RotationA[3]}</span>
                  <span>3: {RotationA[2]}</span>
                  <span>2: {RotationA[1]}</span>
                </div>
                <div className="rotation-row">
                  <span>5: {RotationA[4]}</span>
                  <span>6: {RotationA[5]}</span>
                  <span>1: {RotationA[0]}</span>
                </div>
              </div>
              <button className="button round" disabled={setOver} onClick={() => this.onScoreboardChangeA('+')}>
                +
              </button>
              <button id="a-minus" className="button round" disabled={setOver || ScoreA === 0} onClick={() => this.onScoreboardChangeA('-')}>
                -
              </button>
              {currentlyServing === 'A' && <img src="ball.png" alt="Ball" className="ball-icon ball-1" anchor="a-minus" />}
            </div>
          </div>
          <div>
            <div className="set-score">{SetsA} - {SetsB}</div>
            <div className="sets sets-container">
              {setOver && (
                <div className="set-over">
                  <div className="set-label">Set over</div>
                  <button className="button set-button" onClick={() => this.nextSet(this.state.setWinner)}>Next Set</button>
                </div>
              )}
            </div>
          </div>
          <div className="team-container">
            <div className="scoreboard">
              <div className="team-label">{this.props.teamBName}</div>
              <div className="score">{ScoreB}</div>
              <div className="rotation">
                Rotation
                <hr />
                <div className="rotation-row">
                  <span>4: {RotationB[3]}</span>
                  <span>3: {RotationB[2]}</span>
                  <span>2: {RotationB[1]}</span>
                </div>
                <div className="rotation-row">
                  <span>5: {RotationB[4]}</span>
                  <span>6: {RotationB[5]}</span>
                  <span>1: {RotationB[0]}</span>
                </div>
              </div>
              <button className="button round" disabled={setOver} onClick={() => this.onScoreboardChangeB('+')}>
                +
              </button>
              <button id="b-minus" className="button round" disabled={setOver || ScoreB === 0} onClick={() => this.onScoreboardChangeB('-')}>
                -
              </button>
              {currentlyServing === 'B' && <img src="ball.png" alt="Ball" className="ball-icon ball-2" anchor="b-minus" />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

  export default ScoringPage;