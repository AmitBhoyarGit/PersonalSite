function Game() {
    var self = this;
    self.winners = new Array();
    self.size = 3;
    self.noOfPlyers = 2;
    self.currentPlayer = 0;
    self.player1Selections = new Array();
    self.player2Selections = new Array();
    self.move = 0;

    self.drawBoard = function () {
        var Parent = document.getElementById("game");
        var counter = 1;
        while (Parent.hasChildNodes()) {
            Parent.removeChild(Parent.firstChild);
        }

        var resetBTN = document.getElementById("reset");
        resetBTN.addEventListener('click', function () { self.resetGame() });
        for (s = 0; s < 3; s++) {
            var row = document.createElement("tr");
            var w = document.getElementById("winner");
            if (w.hasChildNodes()) {
                w.removeChild(w.firstChild);
            }
            for (r = 0; r < 3; r++) {
                col = document.createElement("td");
                col.id = counter;
                //col.innerHTML = counter;

                col.addEventListener('click', function (e) {
                    if (self.currentPlayer == 0) {
                        this.innerHTML = "X";
                        this.style.color ="#6aa7ea"
                        self.player1Selections.push(parseInt(this.id));
                        self.player1Selections.sort(function (a, b) { return a - b });
                    }
                    else {
                        this.innerHTML = "O";
                        this.style.color ="#f76f6f"
                        self.player2Selections.push(parseInt(this.id));
                        self.player2Selections.sort(function (a, b) { return a - b; });
                    }
                    this.removeEventListener('click', arguments.callee);
                    self.move++;

                    var isWin = self.checkWinner();

                    if (isWin) {
                        var winner = document.getElementById("winner");
                        var h3 = document.createElement("h3");
                        h3.innerHTML = "Player " + (self.currentPlayer == 0 ? " X " : " O ") + "Wins.";
                        winner.appendChild(h3);

                        var w = document.getElementById("whosTurn");
                            if (w.hasChildNodes()) {
                                w.removeChild(w.firstChild);
                            }
                    }
                    else {
                        if (self.currentPlayer == 0) {
                            var w = document.getElementById("whosTurn");
                            if (w.hasChildNodes()) {
                                w.removeChild(w.firstChild);
                            }
                            var h3 = document.createElement("h3");
                            h3.innerHTML = "Player 'O's Turn "
                            w.appendChild(h3);
                            self.currentPlayer = 1;
                        }
                        else {
                            var w = document.getElementById("whosTurn");
                            if (w.hasChildNodes()) {
                                w.removeChild(w.firstChild);
                            }
                            var h3 = document.createElement("h3");
                            h3.innerHTML = "Player 'X's Turn "
                            w.appendChild(h3);
                            self.currentPlayer = 0;
                        }
                    }

                });
                row.appendChild(col);
                counter++;
            }
            Parent.appendChild(row);
        }

    }

    self.resetGame = function () {
        self.currentPlayer = 0;
        self.player1Selections = new Array();
        self.player2Selections = new Array();
        self.drawBoard();
    }

    self.checkWinner = function () {
        var win = false;
        var playerSelection = new Array();

        if (self.currentPlayer == 0) {
            playerSelection = self.player1Selections;
        }
        else {
            playerSelection = self.player2Selections;
        }

        if (playerSelection.length >= self.size) {
            for (i = 0; i < self.winners.length; i++) {
                // if (self.winners[i].toString() == playerSelection.toString()) {
                //     console.log("player wins");
                //     win = true;
                // }
                var setFound = true;
                var set = self.winners[i];
                for (r = 0; r < set.length; r++) {
                    var found = false;

                    for (s = 0; s < playerSelection.length; s++) {
                        if (set[r] == playerSelection[s]) {
                            found = true;
                            break;
                        }
                    }

                    if (found == false) {
                        setFound = false;
                        break;
                    }
                }
                if (setFound == true) {
                    win = true;
                    for (h = 0; h < set.length; h++) {
                        ele = document.getElementById(set[h]);
                        ele.style.backgroundColor = '#94daa7';
                    }
                    break;
                }
            }
        }
        return win;

    }
    self.loadAnswers = function () {
        self.winners.push([1, 2, 3]);
        self.winners.push([4, 5, 6]);
        self.winners.push([7, 8, 9]);
        self.winners.push([1, 4, 7]);
        self.winners.push([2, 5, 8]);
        self.winners.push([3, 6, 9]);
        self.winners.push([1, 5, 9]);
        self.winners.push([3, 5, 7]);
    }
}

var vm = new Game();
vm.loadAnswers();
vm.drawBoard();