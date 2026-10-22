// Code 01

import React from 'react';

// Step 1: Define the type of props the component receives.
// The name property must be a string.
interface GreetingProps {
  name: string;
}

// Step 2: Create the Greeting component.
function Greeting(props: GreetingProps) {
  // Step 3: Return JSX that displays the name.
  return <div>Hello, {props.name}!</div>;
}

// Step 4: Export the component for use in other files.
export default Greeting;



import React, { Component } from 'react';

// Step 1: Define the shape of the component's state.
// The count property stores a number.
interface CounterState {
  count: number;
}

// Step 2: Define the Counter class.
// The first generic type represents props ({} means no props).
// The second generic type represents the component's state.
class Counter extends Component<{}, CounterState> {
  // Step 3: Initialize the state.
  state: CounterState = {
    count: 0,
  };

  // Step 4: Increment the count.
  // Using previous state avoids relying on a potentially stale value.
  increment = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  };

  // Step 5: Render the component's UI.
  render() {
    // Return the JSX as one expression.
    return (
      <div>
        {/* Display the current count. */}
        <p>Count: {this.state.count}</p>

        {/* Call increment whenever the button is clicked. */}
        <button onClick={this.increment}>
          Increment
        </button>
      </div>
    );
  }
}

// Step 6: Export the component.
export default Counter;
