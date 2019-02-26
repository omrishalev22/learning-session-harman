import React, {Component} from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";

const socket = socketIOClient("/");

class SearchSection extends Component {
    state = {
        pearl: false,
        userInput: '',
        searchedValues: []
    };

    constructor() {
        super();
        socket.emit('request', {action: 'getAllSearchedValues'});
    }

    render() {
        return (
            <div>
                <div className="title">
                    <h3 className="primary-heading">
                        Search <span className="title__icon">&#128269;</span>
                    </h3>
                </div>

                <form onSubmit={this.handleSubmit}>
                    <p className="examples ul-small-margin-bottom">Examples for searches: omri, ido ,raz , anat , matthew , ron ,guyw , guys , yafit </p>

                    <input
                        className="form__input"
                        value={this.state.userInput}
                        placeholder="Enter a team member name"
                        onChange={event => this.setState({userInput: event.target.value, pearl: false})}
                    />
                    <button>Submit</button>
                    <button type="button" onClick={this.deleteAll}>Delete All</button>
                </form>

                <div className="results">
                    <div className="results__pearl">
                        <h3 className="secondary-heading">Result:</h3>
                        {this.renderPearl()}
                    </div>
                </div>

                <div className="log">
                    <h3 className="log__title">People you already checked out:</h3>
                    <div className="log__terminal" key={this.state.searchedValues.toString()}>
                        {this.renderAllSearchedValues()}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.initListeners();
    }

    getLoader() {
        return [<div key="loading"> Loading...</div>]
    }

    getNoResult() {
        return [<div key="no-result-yet"> No Result Yet</div>]
    }


    deleteAll = () => {
        axios.get('/api/delete', {});
        this.setState({userInput: ''});
    }

    handleSubmit = event => {
        event.preventDefault();
        // get phrase by userName - server return working status or actual value.
        socket.emit('request', {
            action: 'getPearlByUserName',
            payload: {
                username: this.state.userInput
            }
        });
    };

    renderPearl() {
        const entries = [];
        if (this.state.pearl) {
            entries.push(
                <div className="results__item" key={this.state.userInput}>
                    <p>Shit {this.state.userInput} will say: </p>
                    <p className="box-item-value" key={this.state.userInput}>{this.state.pearl}</p>
                </div>
            );
            return entries;
        } else {
            return this.getNoResult();
        }

    }

    renderAllSearchedValues() {
        if (this.state.searchedValues) {
            return (
                <span className="log__list" key={this.state.searchedValues.toString()}>
                    {this.state.searchedValues.join(", ")}
                </span>
            );
        }
        return [];

    }

    initListeners() {
        socket.on('searchResult', (res) => {
            if (res && res.resultCode === 200) {
                if (res.isWorking) {
                    this.setState({pearl: false})

                } else {
                    this.setState((prev) => ({
                            searchedValues: [...prev.searchedValues, this.state.userInput],
                            pearl: res.message
                        }
                    ));
                }
            }
        });

        socket.on('allValues', res => {
            if (res && res.resultCode === 200) {
                this.setState({searchedValues: res.message})
            }
        });
    }


}

export default SearchSection;
