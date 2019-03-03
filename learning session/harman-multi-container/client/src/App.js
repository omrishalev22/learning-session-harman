import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import SearchSection from './sections/SearchSection';
import AddSection from "./sections/AddSection";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("/");

class App extends Component {

    render() {
        return (
            <Router>
                <div className="App">
                    <header className="header">
                        <h1 className="header__title">Learning Session</h1>
                    </header>

                    <main className="main">
                        <div className="row main__sections">
                            <section className="col-1-of-2 search-section">
                                <SearchSection socket={socket}/>
                            </section>
                            <section className="col-1-of-2  add-section">
                                <AddSection socket={socket}/>
                            </section>
                        </div>

                    </main>
                    <footer className="footer"></footer>
                </div>
            </Router>
        );
    }
}

export default App;
