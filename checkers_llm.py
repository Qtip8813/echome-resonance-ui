import random
import sys

# Simple checkers board representation and game logic
# Board coordinates: row 0 at top, column 0 at left
# Only dark squares (where (row+col) % 2 == 1) are playable

EMPTY = "."
BLACK = "b"
RED = "r"

# Initialize board with starting pieces


def init_board():
    board = [[EMPTY for _ in range(8)] for _ in range(8)]
    for row in range(3):
        for col in range(8):
            if (row + col) % 2 == 1:
                board[row][col] = RED
    for row in range(5, 8):
        for col in range(8):
            if (row + col) % 2 == 1:
                board[row][col] = BLACK
    return board


def print_board(board):
    print("  a b c d e f g h")
    for row in range(8):
        row_str = str(8 - row) + " "
        for col in range(8):
            row_str += board[row][col] + " "
        print(row_str + str(8 - row))
    print("  a b c d e f g h")


def parse_move(text):
    text = text.strip().lower()
    if len(text) != 5 or text[2] != "-":
        return None
    f_col = ord(text[0]) - ord("a")
    f_row = 8 - int(text[1])
    t_col = ord(text[3]) - ord("a")
    t_row = 8 - int(text[4])
    return (f_row, f_col, t_row, t_col)


def is_valid_pos(row, col):
    return 0 <= row < 8 and 0 <= col < 8


def generate_moves(board, color):
    moves = []
    direction = -1 if color == RED else 1
    for r in range(8):
        for c in range(8):
            if board[r][c] != color:
                continue
            nr = r + direction
            for dc in (-1, 1):
                nc = c + dc
                if is_valid_pos(nr, nc) and board[nr][nc] == EMPTY:
                    moves.append((r, c, nr, nc))
    return moves


def apply_move(board, move):
    fr, fc, tr, tc = move
    piece = board[fr][fc]
    board[fr][fc] = EMPTY
    board[tr][tc] = piece


class MiniMarkov:
    def __init__(self, corpus):
        words = corpus.split()
        self.lookup = {}
        for i in range(len(words) - 1):
            key = words[i]
            self.lookup.setdefault(key, []).append(words[i + 1])
        self.words = words

    def generate(self, length=10):
        if not self.words:
            return ""
        word = random.choice(self.words)
        output = [word]
        for _ in range(length - 1):
            choices = self.lookup.get(word)
            if not choices:
                word = random.choice(self.words)
            else:
                word = random.choice(choices)
            output.append(word)
        return " ".join(output)


CORPUS = open("README.md", "r", encoding="utf-8").read()
markov = MiniMarkov(CORPUS)


def main():
    board = init_board()
    user_color = RED
    ai_color = BLACK
    print("Welcome to Checkers with Mini LLM Conversation!")
    print("Enter moves in the form 'a3-b4'. Type 'quit' to exit.")
    print_board(board)
    while True:
        user_input = input("Your move or message: ")
        if user_input.lower() == "quit":
            print("Goodbye!")
            break
        move = parse_move(user_input)
        if move and move in generate_moves(board, user_color):
            apply_move(board, move)
            print("You moved: {}".format(user_input))
        else:
            print("(You said: {})".format(user_input))
        # AI turn
        ai_moves = generate_moves(board, ai_color)
        if not ai_moves:
            print("AI has no moves left. You win!")
            break
        ai_move = random.choice(ai_moves)
        apply_move(board, ai_move)
        move_str = "{}{}-{}{}".format(
            chr(ai_move[1] + 97), 8 - ai_move[0], chr(ai_move[3] + 97), 8 - ai_move[2]
        )
        print_board(board)
        convo = markov.generate(random.randint(6, 12))
        print("AI says: {} (moves {} )".format(convo, move_str))


if __name__ == "__main__":
    main()
