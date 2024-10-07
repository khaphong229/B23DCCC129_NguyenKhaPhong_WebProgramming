import React from 'react';

class Counter extends React.Component {
    constructor(props){
        super(props);
        this.state={ count: 3};
    }
    render() {
        return (
            <div>
                <p>{this.state.count}</p>
                <button onClick={() => this.setState({count: this.state.count + 1})}>Click</button>
            </div>
        )
    }
}

export default Counter
