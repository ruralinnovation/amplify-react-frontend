import React from 'react';

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            userInput: ''
        };
        this.saveUserInput = this.saveUserInput.bind(this);
        this.updateScore = this.updateScore.bin(this);
    }

    saveUserInput () {}
    updateScore () {}
}
