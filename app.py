from flask import Flask, render_template, jsonify, request
from sudoku import Sudoku

app = Flask(__name__)

sudoku = Sudoku()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/play")
def play():
    return render_template("play.html")


@app.route("/stats")
def stats():
    return render_template("stats.html")


@app.route("/generate", methods=["POST"])
def generate():

    data = request.get_json()

    difficulty = data.get("difficulty", "easy")

    puzzle, solution = sudoku.generate_puzzle(difficulty)

    return jsonify({
        "puzzle": puzzle,
        "solution": solution,
        "difficulty": difficulty
    })


@app.route("/solve", methods=["POST"])
def solve():

    data = request.get_json()

    board = data.get("board")

    solver = Sudoku()

    if solver.solve(board):

        return jsonify({
            "success": True,
            "solution": board
        })

    return jsonify({
        "success": False,
        "message": "This puzzle cannot be solved."
    })


if __name__ == "__main__":
    app.run(debug=True)
