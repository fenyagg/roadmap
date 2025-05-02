/**
 * @typedef {('horizontal'|'vertical'|'diagonal1'|'diagonal2')} WinnerDirection
 * @typedef {('X', '0')} PlayerMark
 * @typedef {{direction: WinnerDirection, startPoint: [number, number]}} WinnerLine
 */

class Game {
    LINES_COUNT = 3

    /**
     * @type {HTMLElement}
     */
    $game;
    /**
     * @type {HTMLElement[]}
     */
    $gameInputs;
    /**
     * @type {HTMLElement}
     */
    $gameResult;
    /**
     * @type {HTMLElement}
     */
    $gameReset;


    /**
     * @type {['X', '0']}
     */
    PLAYERS = ['X', '0'];

    DEFAULT_VALUES = [[], [], []];
    /**
     * @type {PlayerMark[][]}
     */
    values = [];

    /**
     * @type {['X', '0']}
     */
    players = ['X', '0'];

    currentPlayer = 0;
    markedCount = 0;

    constructor($game, $gameInputs, $gameResult, $gameReset) {
        this.$game = $game;
        this.$gameInputs = $gameInputs;
        this.$gameResult = $gameResult;
        this.$gameReset = $gameReset;
    }

    reset() {
        this.values = structuredClone(this.DEFAULT_VALUES);
        this.currentPlayer = 0;
        this.markedCount = 0;
        this.$game.dataset.currentPlayer = this.players[this.currentPlayer];

        this.$gameResult.innerHTML = 'Result';

        this.$gameInputs.forEach($gameInputItem => {
            $gameInputItem.removeAttribute('value');
            $gameInputItem.removeAttribute('disabled');
            $gameInputItem.checked = false;
            delete $gameInputItem.parentElement.dataset.lineDirection;
        })
    }

    /**
     * @param {string=} winner
     * @param {WinnerLine=} winnerLine
     */
    setWinner(winner, winnerLine) {
        if(winner) {
            this.$gameResult.innerHTML = `${winner} Win!!!`;

            if (winnerLine) {
                const {direction, startPoint} = winnerLine;
                const [x, y] = startPoint;
                const $gameField = this.$game.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                if ($gameField) {
                    $gameField.parentElement.dataset.lineDirection = direction;
                }
            }
        } else {
            this.$gameResult.innerHTML = `No winner`;
        }
        delete this.$game.dataset.currentPlayer;
        this.$gameInputs.forEach($gameInputItem => {
            $gameInputItem.setAttribute('disabled', 'disabled');
        })
    }

    init() {
        this.reset();
        this.$gameInputs.forEach($gameInputItem => {
            $gameInputItem.addEventListener('change', () => {
                $gameInputItem.value = this.players[this.currentPlayer];
                const {x, y} = $gameInputItem.dataset;
                this.values[+x][+y] = this.players[this.currentPlayer];

                const winnerLine = this.getWinner();
                if (winnerLine) {
                    console.log('qq winnerLine', winnerLine);
                    this.setWinner(this.players[this.currentPlayer], winnerLine);
                } else {
                    if (++this.markedCount === this.LINES_COUNT * this.LINES_COUNT) {
                        this.setWinner();
                        return;
                    }

                    // next
                    this.currentPlayer = +!this.currentPlayer;
                    this.$game.dataset.currentPlayer = this.players[this.currentPlayer];
                }
            });
        });
        this.$gameReset.addEventListener('click', () => this.reset());
    }

    /**
     * @returns {WinnerLine}
     */
    getWinner() {
        let diagonalCounter = 0;
        let diagonalCounter2 = 0;
        for (let i = 0; i < this.LINES_COUNT; i++) {
            let horizontalCounter = 0;
            let verticalCounter = 0;
            for (let j = 0; j < this.LINES_COUNT; j++) {
                // vertical
                if (this.values[i][j] === this.players[this.currentPlayer]) {
                    if (++verticalCounter === this.LINES_COUNT) {
                        return {
                            direction: 'vertical',
                            startPoint: [i, 0]
                        };
                    }
                }

                // horizontal
                if (this.values[j][i] === this.players[this.currentPlayer]) {
                    if (++horizontalCounter === this.LINES_COUNT) {
                        return {
                            direction: 'horizontal',
                            startPoint: [0, i]
                        };
                    }
                }
            }

            if (this.values[i][i] === this.players[this.currentPlayer]) {
                if (++diagonalCounter === this.LINES_COUNT) {
                    return {
                        direction: 'diagonal1',
                        startPoint: [0, 0]
                    };
                }
            }

            if (this.values[this.LINES_COUNT - 1 - i][i] === this.players[this.currentPlayer]) {
                if (++diagonalCounter2 === this.LINES_COUNT) {
                    return {
                        direction: 'diagonal2',
                        startPoint: [this.LINES_COUNT - 1, 0]
                    }
                }
            }
        }
    }
}