import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import SearchSection from './sections/SearchSection';
import AddSection from "./sections/AddSection";

class App extends Component {

    render() {
        return (
            <Router>
                <div className="App">
                    <header className="header">
                        <h1 className="header__title">Learning Sessions</h1>
                    </header>

                    <main className="main">
                        <section className="search-section">
                            <Route exact path="/" component={SearchSection}/>
                        </section>
                        <section className="add-section">
                            <Route exact path="/" component={AddSection}/>
                        </section>
                    </main>

                </div>
            </Router>
        );
    }
}

export default App;
