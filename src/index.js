import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: '0',
      expression: ''
    }
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleNonOperators = this.handleNonOperators.bind(this);
  }

  handleOperators(operator) {
    function calculate(expression) {
      try {
        return `${Math.round(1e12 * eval(expression)) / 1e12}`;
      } catch (error) {
        console.log(error);
        return 'ERROR';
      }
    } 

    this.setState(state => {
      if (!state.expression) {
        return { display: '0', expression: state.display + operator }
      }
      switch (operator) {
        case '=':
          if (state.expression.endsWith('=')) {
            const expressionMatch = state.expression.match(/\d+(?:[.]\d+)?([+\-/*]\d+(?:[.]\d+)?)/);
            return { display: calculate(state.display + expressionMatch[1]), expression: state.display + expressionMatch[1] + '=' };
          }
          if (state.expression.match(/\d+(?:[.]\d+)?[+\-/*]/)) {
            return { display: calculate(state.expression + state.display ), expression: state.expression + state.display + '='};
          }
          break;
        case '-':
        case '+':
        case '*':
        case '/':
          if (operator === '-' && state.expression.search(/[+/*]/) !== -1 && !state.expression.includes('-') && state.display === '0') {
            return { expression: state.expression + operator };
          }
          if (state.expression.endsWith('=')) {
            return { display: '0', expression: state.display + operator };
          }
          if (state.expression.match(/\d+(?:[.]\d+)?[+/*][-]/)) {
            return { expression: state.expression.match(/(\d+(?:[.]\d+)?)/)[1] + operator };
          }
          return { display: '0', expression: calculate(state.expression + state.display) + operator };
      default:
        break;
      }
    });
  }

  handleNonOperators(value) {
    this.setState(state => {
      if (value === 'AC') {
        return { display: '0', expression: '' };
      }
      if (value === 'DEL') {
        return { display: state.display.length === 1 ? '0' : state.display.slice(0, -1) };
      }
      if (state.expression.endsWith('=')) {
        return { display: value === '.' ? '0.' : value, expression: '' }
      }
      if (value === '.' && state.display.includes('.')) {
        return { display: state.display };
      }
      return { display: state.display === '0' ? 
        value === '.' ? state.display + value : value : 
        state.display.length <= 16 ? state.display + value : state.display };
    })
  }

  handleButtonPress(value) {
    if (value.match(/[=+\-/*]/)) {
      return this.handleOperators(value);
    }

    this.handleNonOperators(value);
  }

  componentDidMount() {
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', event => {
        this.handleButtonPress(event.target.value);
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Expression expression={this.state.expression} />
        <Display display={this.state.display} />
        <Buttons />
      </div>
    );
  }
}

function Expression(props) {
  return (
    <div style={{ height: '2rem' }}>
      {props.expression}
    </div>
  )
}

function Display(props) {
  return (
    <div id='display'>
      {props.display}
    </div>
  )
}

function Buttons() {
  return (
    <div id='buttons'>
      <button id='clear' className='operator' value='AC'>AC</button>
      <button id='delete' className='operator' value='DEL'>DEL</button>
      <button id='divide' className='operator' value='/'>/</button>
      <button id='multiply' className='operator' value='*'>*</button>
      <button id='seven' value='7'>7</button>
      <button id='eight' value='8'>8</button>
      <button id='nine' value='9'>9</button>
      <button id='subtract' className='operator' value='-'>-</button>
      <button id='four' value='4'>4</button>
      <button id='five' value='5'>5</button>
      <button id='six' value='6'>6</button>
      <button id='add' className='operator' value='+'>+</button>
      <button id='one' value='1'>1</button>
      <button id='two' value='2'>2</button>
      <button id='three' value='3'>3</button>
      <button id='equals' className='vertical operator' value='='>=</button>
      <button id='zero' className='wide' value='0'>0</button>
      <button id='decimal' value='.'>.</button>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
