import React, { Component } from 'react';
import axios from 'axios';

class AddSection extends Component {
  state = {
    seenIndexes: [],
    value: "",
    phrase: ''
  };

  componentDidMount() {

  }

  async fetchValues() {

  }

  async fetchIndexes() {

  }


  handleAddSubmit = async event => {
    event.preventDefault();

    await axios.post('/api/values', {
      index: this.state.index
    });
    this.fetchValues();
    this.fetchIndexes();
  };


  renderSeenIndexes() {
    return this.state.seenIndexes.map((teamMember) => {
      return teamMember.name;
    }).join(', ');
  }

  renderResultFromServer() {
    const entries = [];

    for (let key in this.state.values) {
      if(key === this.state.index){
        entries.push(
            <div className="box-item" key={key}>
              <p>Shit {key} will say: </p>
              <p className="box-item-value">{this.state.values[key]}</p>
            </div>
        );
      }
    }

    return entries;
  }


  render() {
    return (
      <div>
        <h3 className="primary-heading">
          Add a person and a cool phrase on him:
        </h3>

        <form onSubmit={this.handleAddSubmit}>
          <input
              className="form__input"
              value={this.state.value}
              placeholder="Please enter a teammate name"
              onChange={event => this.setState({ value: event.target.value })}
          />
          <br/>
          <input
              className="form__input"
              value={this.state.phrase}
              placeholder="Please enter a phrase"
              onChange={event => this.setState({ phrase: event.target.value })}
          />
          <br/>
          <button>Submit</button>
        </form>

      </div>
    );
  }
}

export default AddSection;
