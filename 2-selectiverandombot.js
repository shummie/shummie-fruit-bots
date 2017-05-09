var SelectiveRandomBot = {
    newGame: function(playerNumber) {

        if (playerNumber === undefined) {
            this.playerNumber = 1
        } else {
            this.playerNumber = playerNumber
        }

    },
    makeMove: function() {
        // to disable to opponent, uncomment the next line
        // return PASS;

        this.board_base = get_board();

        if (this.playerNumber == 1) {
            this.x = get_my_x();
            this.y = get_my_y();
            this.ox = get_opponent_x();
            this.oy = get_opponent_y();
            this.get_my_item_count = get_my_item_count;
            this.get_opponent_item_count = get_opponent_item_count;
        } else {
            this.ox = get_my_x();
            this.oy = get_my_y();
            this.x = get_opponent_x();
            this.y = get_opponent_y();
            this.get_my_item_count = get_opponent_item_count;
            this.get_opponent_item_count = get_my_item_count;
        }

        // Figure out which fruits we are interested in.
        // Note, this array stores the actual fruit index
        this.interested_fruits = new Array(get_number_of_item_types() + 1)
        for (var i = 1; i <= get_number_of_item_types(); i++) {
            // We don't care about a fruit if that type is already scored.
            var total_fruits = get_total_item_count(i)
            // if the # of fruits collected by either player is > total_fruits / 2 then we don't care
            if ((this.get_my_item_count(i) > total_fruits / 2) || (this.get_opponent_item_count(i) > total_fruits / 2)) {
                this.interested_fruits[i] = 0;
            } else {
                this.interested_fruits[i] = 1;
            }
        }

        // convert the board into an array of arrays that we can manipulate / are interested in
        this.board = new Array();
        for (var i = 0; i < WIDTH; i++) {
            this.board[i] = new Array(HEIGHT);
            for (var j = 0; j < HEIGHT; j++) {
                if (this.board_base[i][j]) {
                    var fruit = this.board_base[i][j];
                    if (this.interested_fruits[fruit]) {
                        this.board[i][j] = this.board_base[i][j];
                    } else {
                        this.board[i][j] = 0;
                    }
                } else {
                    this.board[i][j] = 0;
                }
            }
        }

        // Now this.board contains only fruits that we are interested in collecting.

        // we found an item! take it!
        if ((this.board[this.x][this.y])) {
            return TAKE;
        }


        var rand = Math.random() * 4;

        if (rand < 1) return NORTH;
        if (rand < 2) return SOUTH;
        if (rand < 3) return EAST;
        if (rand < 4) return WEST;

        return PASS;
    }
}



