import React, {Component} from 'react';

const Channels = require('../shared/keys').channels;

class SearchSection extends Component {
    state = {
        pearl: false,
        userInput: '',
        searchedValues: []
    };

    componentDidMount() {
        this.socket = this.props.socket;
        this.socket.emit('request', {action: Channels.SEARCH_ALL});
        this.initListeners();
    }

    render() {
        return (
            <div>
                <div className="search-section__title">
                    <h3 className="primary-heading">
                        Search
                    </h3>
                </div>

                <form className="form" onSubmit={this.handleSubmit}>
                    <p className="examples ul-small-margin-bottom">Examples for searches: omri, ido ,raz , anat ,
                        matthew , ron ,guyw , guys , yafit </p>

                    <input
                        className="form__input"
                        value={this.state.userInput}
                        placeholder="Enter a team member name"
                        onChange={event => this.setState({userInput: event.target.value, pearl: false})}
                    />
                    <input type="submit" className="btn btn--submit" value="Submit"/>
                    <input type="submit" className="btn btn--delete" value="Delete" onClick={this.deleteAll}/>
                </form>

                <div className="search-section__results">
                    <div className="results__pearl">
                        {this.renderPearl()}
                    </div>
                </div>

                <div className="logger">
                    <h3 className="logger__title">People you already checked out:</h3>
                    <div className="logger__terminal" key={this.state.searchedValues.toString()}>
                        {this.renderAllSearchedValues()}
                    </div>
                </div>
            </div>
        );
    }

    deleteAll = (event) => {
        event.preventDefault();
        this.socket.emit('request', {action: Channels.DELETE});
    }

    handleSubmit = event => {
        event.preventDefault();
        // get phrase by userName - server return working status or actual value.
        this.socket.emit('request', {
            action: Channels.SEARCH,
            payload: {
                username: this.state.userInput
            }
        });
    };

    renderPearl() {
        const entries = [];
        if (this.state.pearl) {
            entries.push(
                <div>
                    <p>Shit {this.state.userInput} will say: </p>
                    <p className="box-item-value" key={this.state.userInput}>{this.state.pearl}</p>
                </div>
            );

        } else {
            entries.push(<div className="results__item ul-small-margin-bottom" key={this.state.userInput}>No Results
                Yet</div>);
        }

        return entries
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

    /**
     * Sets listeners which listens to websocket's events.
     */
    initListeners() {
        this.socket.on(Channels.SEARCH, (res) => {
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

        this.socket.on(Channels.SEARCH_ALL, res => {
            if (res && res.resultCode === 200) {
                this.setState({searchedValues: res.message})
            }
        });

        this.socket.on(Channels.DELETE, res => {
            if (res && res.resultCode === 200) {
                this.setState({userInput: '', searchedValues: false, pearl: res.message})
            }
        });
    }

}

export default SearchSection;
