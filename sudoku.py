import random
import copy


class Sudoku:

    def __init__(self):
        self.board = [[0 for _ in range(9)] for _ in range(9)]

    def is_valid(self, board, row, col, num):

        for i in range(9):
            if board[row][i] == num:
                return False

        for i in range(9):
            if board[i][col] == num:
                return False

        start_row = row - row % 3
        start_col = col - col % 3

        for i in range(3):
            for j in range(3):
                if board[start_row + i][start_col + j] == num:
                    return False

        return True

    def solve(self, board):

        for row in range(9):
            for col in range(9):

                if board[row][col] == 0:

                    numbers = list(range(1, 10))
                    random.shuffle(numbers)

                    for num in numbers:

                        if self.is_valid(board, row, col, num):

                            board[row][col] = num

                            if self.solve(board):
                                return True

                            board[row][col] = 0

                    return False

        return True

    def generate_solution(self):

        board = [[0 for _ in range(9)] for _ in range(9)]

        self.solve(board)

        return board

    def generate_puzzle(self, difficulty="easy"):

        solution = self.generate_solution()

        puzzle = copy.deepcopy(solution)

        difficulty_levels = {
            "easy": 35,
            "medium": 45,
            "hard": 55
        }

        cells_to_remove = difficulty_levels.get(difficulty, 35)

        positions = [
            (row, col)
            for row in range(9)
            for col in range(9)
        ]

        random.shuffle(positions)

        for i in range(cells_to_remove):

            row, col = positions[i]
            puzzle[row][col] = 0

        return puzzle, solution
