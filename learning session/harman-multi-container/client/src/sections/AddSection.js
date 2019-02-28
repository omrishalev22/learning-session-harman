import React, {Component} from 'react';
const channels = require('../shared/keys').channels;

class AddSection extends Component {
    state = {
        name: "",
        pearl: ''
    };

    componentDidMount() {
        this.socket = this.props.socket;
        this.initListeners();
    }

    handleAddSubmit = async event => {
        event.preventDefault();
        this.socket.emit('request', {
            action: channels.SEARCH,
            payload: {
                name: this.state.name,
                pearl: this.state.pearl
            }
        });
    };

    render() {
        return (
            <div className="title">
                <h3 className="primary-heading">
                    Add <span className="title__icon">&#10010;</span>
                </h3>

                <form onSubmit={this.handleAddSubmit}>
                    <input
                        className="form__input"
                        value={this.state.name}
                        placeholder="Please enter a teammate name"
                        onChange={event => this.setState({name: event.target.value})}
                    />
                    <br/>
                    <input
                        className="form__input"
                        value={this.state.pearl}
                        placeholder="Please enter a phrase"
                        onChange={event => this.setState({pearl: event.target.value})}
                    />
                    <br/>
                    <button className="btn btn--submit">Submit</button>
                </form>

                <div className="logger">
                    <h3 className="logger__title">People you Added:</h3>
                    <div className="logger__terminal" key={this.state.name.toString()}>
                    </div>
                </div>

            </div>
        );
    }


    /**
     * Sets listeners which listens to websocket's events.
     */
    initListeners() {
        this.socket.on(channels.DELETE, res => {
            if (res && res.resultCode === 200) {
                this.setState({userInput: '', searchedValues: false, pearl: false})
            }
        });
    }
}

export default AddSection;
