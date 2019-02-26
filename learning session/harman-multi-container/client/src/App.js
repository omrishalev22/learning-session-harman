import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import OtherPage from './OtherPage';
import SearchSection from './SearchSection';
import AddSection from "./AddSection";

class App extends Component {

    render() {
        return (
            <Router>
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h1 className="App-title">Welcome to React</h1>
                        <Link className="nav-bar" to="/">Home</Link>
                    </header>
                    <div>
                        <Route exact path="/" component={SearchSection}/>
                        <Route exact path="/" component={AddSection}/>
                        <Route path="/otherpage" component={OtherPage}/>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
