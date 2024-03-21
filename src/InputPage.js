// InputPage.js

import React, { Component } from 'react';
import './InputPage.css';

class InputPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfSets: 1,
      teamAName: '',
      teamBName: '',
      rotationA: ['', '', '', '', '', ''],
      rotationB: ['', '', '', '', '', ''],
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleRotationChange = (team, index, value) => {
    const rotation = team === 'A' ? [...this.state.rotationA] : [...this.state.rotationB];
    rotation[index] = value;
    this.setState({
      [`rotation${team}`]: rotation
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { numberOfSets, teamAName, teamBName, rotationA, rotationB } = this.state;
    this.props.onSubmit({ numberOfSets, teamAName, teamBName, rotationA, rotationB });
  };

  render() {
    const { teamAName, teamBName, rotationA, rotationB } = this.state;

    return (
      <div className="container1">
        <div className="form-container">
          <h1 className="form-title">Setup Volleyball Game</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="numberOfSets">Number of Sets:</label>
              <select
                id="numberOfSets"
                name="numberOfSets"
                value={this.state.numberOfSets}
                onChange={this.handleInputChange}
                className="form-input"
              >
                <option value={1}>1</option>
                <option value={2}>3</option>
                <option value={3}>5</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="teamAName">Team A Name:</label>
              <input
                type="text"
                id="teamAName"
                name="teamAName"
                value={teamAName}
                onChange={this.handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="teamBName">Team B Name:</label>
              <input
                type="text"
                id="teamBName"
                name="teamBName"
                value={teamBName}
                onChange={this.handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Rotation for Team A:</label>
              <div className="rotation-inputs">
                {rotationA.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    value={value}
                    onChange={(e) => this.handleRotationChange('A', index, e.target.value)}
                    className="rotation-input"
                    maxLength={2} // Restrict input to 2 digits
                    
                  />
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Rotation for Team B:</label>
              <div className="rotation-inputs">
                {rotationB.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    value={value}
                    onChange={(e) => this.handleRotationChange('B', index, e.target.value)}
                    className="rotation-input"
                    maxLength={2} // Restrict input to 2 digits
                    
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="form-button">Start Game</button>
          </form>
        </div>
      </div>
    );
  }
}

export default InputPage;
