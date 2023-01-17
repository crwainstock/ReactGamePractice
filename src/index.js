import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

//SQUARE COMPONENT AS A FUNCTION
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// SQUARE COMPONENT AS A CLASS
// class Square extends React.Component {
//   //No constructor necessary here because the state is defined in the parent component (board)
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick()}
//         //arrow function version -- tells react to re-render the square when it's
//         //Using this.props.setState uses the function passed down from the parent component
//         //
//         // onClick={function () {
//         //   console.log(`click`);
//         //function is defined here -- console logs click, long version
//         // }}
//       >
//         {this.props.value}
//         {/* This is what will be printed on the page */}
//       </button>
//     );
//     //this.props.value links the value prop from Board component here
//   }
// }
//PARENT COMPONENT
class Board extends React.Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       squares: Array(9).fill(null), //setting initial state
  //       //And declaring squares array
  //       xIsNext: true,
  //     };
  //   }
  //CONSTRUCTOR NOT NEEDED BECAUSE THE GAME COMPONENT (PARENT) WILL PASS THIS INFO AS A PROP INSTEAD
  //   handleClick(i) {
  //     const history = this.state.history;
  //     const current = history[history.length - 1];
  //     const squares = this.state.squares.slice(); //.slice creates a copy of the squares array here to modify
  //     if (calculateWinner(squares) || squares[i]) {
  //       return;
  //     }
  //     squares[i] = this.state.xIsNext ? `X` : `O`;
  //     //Ternary operator reading boolean xIsNext to determine if X or O will be displayed
  //     this.setState({
  //       history: history.concat([
  //         //This method doesn't mutate the original array like .push
  //         {
  //           squares: squares,
  //         },
  //       ]),
  //       xIsNext: !this.state.xIsNext,
  //     });
  //     //Updating these variables when the function runs
  //   }
  //State is stored in the parent (board) component
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        //Function passed from board to square to use when a square is clicked
      />
    );
    //Passing a prop called value -- reads current state of squares array
  }

  render() {
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = `Winner: ` + winner;
    // } else {
    //   status = `Next player: ` + (this.state.xIsNext ? `X` : `O`);
    // }
    //This now lives in the parent component (game) and is passed as a prop

    // const status = `Next player: ` + (this.state.xIsNext ? `X` : `O`);
    //Automates display which player is next based on xIsNext variable state
    return (
      <div>
        {/* <div className="status">{status}</div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); //.slice creates a copy of the squares array here to modify
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? `X` : `O`;
    //Ternary operator reading boolean xIsNext to determine if X or O will be displayed
    this.setState({
      history: history.concat([
        //This method doesn't mutate the original array like .push
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    //Updating these variables when the function runs
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #` + move : `Go to game start`;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ` + winner;
    } else {
      status = `Next player: ` + (this.state.xIsNext ? `X` : `O`);
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
//HELPER FUNCTION TO DETERMINE WINNER
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
