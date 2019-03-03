import React, {Component} from 'react';

const Channels = require('../shared/keys').channels;

class AddSection extends Component {
    state = {
        name: "",
        pearl: '',
        addedList: ''
    };

    componentDidMount() {
        this.socket = this.props.socket;
        this.initListeners();
    }

    handleAddSubmit = event => {
        event.preventDefault();
        this.socket.emit('request', {
            action: Channels.ADD,
            payload: {
                name: this.state.name,
                pearl: this.state.pearl
            }
        });
    };

    renderAddedPeopleList() {
        if (this.state.addedList) {
            return (
                <span className="log__list" key={this.state.addedList.toString()}>
                    {this.state.addedList.join(", ")}
                </span>
            );
        }
        return [];
    }

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
                    <div className="logger__terminal" key={this.state.addedList.toString()}>
                        {this.renderAddedPeopleList()}
                    </div>
                </div>

            </div>
        );
    }


    /**
     * Sets listeners which listens to websocket's events.
     */
    initListeners() {
        this.socket.on(Channels.ADD, res => {
            if (res && res.resultCode === 200 && res.message) {
                this.setState((prev) => ({
                    addedList: [...prev.addedList, res.message],
                }));
            }
        });


    }
}

export default AddSection;
