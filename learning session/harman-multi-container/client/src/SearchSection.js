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
                <div>
                    <h3 className="primary-heading">Examples for searches:</h3>
                    <p className="examples">omri, ido ,raz , anat , matthew , ron ,guyw , guys , yafit </p>
                </div>

                <form onSubmit={this.handleSubmit}>
                    <p className="primary-heading">Enter a team member name: </p>
                    <input
                        className="form__input"
                        value={this.state.userInput}
                        onChange={event => this.setState({userInput: event.target.value, pearl: false})}
                    />
                    <button>Submit</button>
                    <button type="button" onClick={this.deleteAll}>Delete All</button>
                </form>

                <div className="checked">
                    <h3>People you already checked out:</h3>
                    {this.renderAllSearchedValues()}
                </div>
                <h3>Result:</h3>
                <div className="box">
                    {this.renderPearl()}
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
                <div className="box__results" key={this.state.userInput}>
                    <div className="box-item" key={this.state.userInput}>
                        <p>Shit {this.state.userInput} will say: </p>
                        <p className="box-item-value" key={this.state.userInput}>{this.state.pearl}</p>
                    </div>
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
                <div className="span" key={this.state.searchedValues.toString()}>
                    {this.state.searchedValues.join(", ")}
                </div>
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
