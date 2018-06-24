import React, { Component } from 'react';

import SvgInput from './SvgInput';

import './App.css';

class App extends Component {
  render() {
    return (
        <div className="instructions">
            <h1>Web Effects</h1>
            <div className="input-group">
                <SvgInput width={ 100 } />
                <SvgInput width={ 410 } />
                <SvgInput width={ 1000 } />
                <SvgInput width={ 800 } />
            </div>
        </div>
    );
  }
}

export default App;
