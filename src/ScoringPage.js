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
      substitutionA: {
        substitutedPlayer: '',
        enteringPlayer: ''
      },
      substitutionB: {
        substitutedPlayer: '',
        enteringPlayer: ''
      }
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
      let newScore = A - 1;
    let newRotation = RotationA; // Restore rotation
    newRotation.unshift(newRotation.pop());
    this.setState({
      ...this.state,
      scores: {
        ...scores,
        A: newScore,
      },
      rotations: {
        ...rotations,
        A: newRotation,
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
      let newScore = B - 1;
    let newRotation = RotationB; // Restore rotation
    newRotation.unshift(newRotation.pop());
    this.setState({
      ...this.state,
      scores: {
        ...scores,
        B: newScore,
      },
      rotations: {
        ...rotations,
        B: newRotation,
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

  handleSubstitutionA = () => {
    const { substitutionA, rotations } = this.state;
    const { substitutedPlayer, enteringPlayer } = substitutionA;
  
    const newRotationA = rotations.A.map(player => {
      if (player === substitutedPlayer) {
        return enteringPlayer;
      }
      return player;
    });
  
    this.setState({
      rotations: {
        ...rotations,
        A: newRotationA
      }
    });
  };
  
  handleSubstitutionB = () => {
    const { substitutionB, rotations } = this.state;
    const { substitutedPlayer, enteringPlayer } = substitutionB;
  
    const newRotationB = rotations.B.map(player => {
      if (player === substitutedPlayer) {
        return enteringPlayer;
      }
      return player;
    });
  
    this.setState({
      rotations: {
        ...rotations,
        B: newRotationB
      }
    });
  };

  render() {
    const { 
      substitutionA, 
      substitutionB,
      scores: { A: ScoreA, B: ScoreB },
      setOver,
      rotations: { A: RotationA, B: RotationB },
      currentlyServing,
      sets: { A: SetsA, B: SetsB },
      matchOver
    } = this.state;

    

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
                  <span>{RotationA[3]}</span>
                  <span>{RotationA[2]}</span>
                  <span>{RotationA[1]}</span>
                </div>
                <div className="rotation-row">
                  <span>{RotationA[4]}</span>
                  <span>{RotationA[5]}</span>
                  <span>{RotationA[0]}</span>
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
            <div className="substitution-container">
              <h2>Substitution for Team A:</h2>
              <div className="substitution-flex">
              <input
                type="text"
                placeholder="Substituted Player"
                value={substitutionA.substitutedPlayer}
                onChange={(e) => this.setState({
                  substitutionA: {
                    ...substitutionA,
                    substitutedPlayer: e.target.value
                  }
                })}
              />
              <button onClick={this.handleSubstitutionA}><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-repeat"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" /></svg></button>
              <input
                type="text"
                placeholder="Entering Player"
                value={substitutionA.enteringPlayer}
                onChange={(e) => this.setState({
                  substitutionA: {
                    ...substitutionA,
                    enteringPlayer: e.target.value
                  }
                })}
              />
              </div>
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
                  <span>{RotationB[3]}</span>
                  <span>{RotationB[2]}</span>
                  <span>{RotationB[1]}</span>
                </div>
                <div className="rotation-row">
                  <span>{RotationB[4]}</span>
                  <span>{RotationB[5]}</span>
                  <span>{RotationB[0]}</span>
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
            <div className="substitution-container">
              <h2>Substitution for Team B:</h2>
              <div className="substitution-flex">
              <input
                type="text"
                placeholder="Substituted Player"
                value={substitutionB.substitutedPlayer}
                onChange={(e) => this.setState({
                  substitutionB: {
                    ...substitutionB,
                    substitutedPlayer: e.target.value
                  }
                })}
              />
              <button onClick={this.handleSubstitutionB}><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-repeat"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" /></svg></button>
              <input
                type="text"
                placeholder="Entering Player"
                value={substitutionB.enteringPlayer}
                onChange={(e) => this.setState({
                  substitutionB: {
                    ...substitutionB,
                    enteringPlayer: e.target.value
                  }
                })}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

  export default ScoringPage;