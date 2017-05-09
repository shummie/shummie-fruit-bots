var NaiveBot = {
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


        // Perform a floodfill from us until we reach an item.

        // Initialize a new floodfill array
        this.floodfill_board = this.simple_flood_fill_until_fruit();

        // check all directions
        var best, direction;
        best = 999;
        if (this.y > 0) {
            if (this.floodfill_board[this.x][this.y-1] < best) {
                best = this.floodfill_board[this.x][this.y-1];
                direction = NORTH;
            }
        }
        if (this.y < HEIGHT - 1) {
            if (this.floodfill_board[this.x][this.y+1] < best) {
                best = this.floodfill_board[this.x][this.y+1];
                direction = SOUTH;
            }
        }
        if (this.x > 0) {
            if (this.floodfill_board[this.x-1][this.y] < best) {
                best = this.floodfill_board[this.x-1][this.y];
                direction = WEST;
            }
        }
        if (this.x < WIDTH - 1) {
            if (this.floodfill_board[this.x+1][this.y] < best) {
                best = this.floodfill_board[this.x+1][this.y];
                direction = EAST;
            }
        }

        return direction;

    },

    simple_flood_fill_until_fruit: function() {
        // Does a BFS flood fill to find the shortest distance to a fruit.
        // Starts the fill AT FRUITS and stops once we hit us.

        // Init a new board, all -1
        var floodfill_board = new Array();
        for (var i = 0; i < WIDTH; i++) {
            floodfill_board[i] = new Array(HEIGHT);
            for (var j = 0; j < HEIGHT; j++) {
                floodfill_board[i][j] = -1
            }
        }

        var qx, qy, found;
        qx = new Array();
        qy = new Array();

        // Find all fruits.
        for (var i = 0; i < WIDTH; i++) {
            for (var j = 0; j < HEIGHT; j++) {
                if (this.board[i][j]) {
                    qx.push(i);
                    qy.push(j);
                    floodfill_board[i][j] = 0;
                }
            }
        }

        while (qx.length > 0) {
            cx = qx.pop();
            cy = qy.pop();
            var current_distance = floodfill_board[cx][cy];

            // North:
            if (cy > 0) {
                if ((floodfill_board[cx][cy-1] == -1) || (floodfill_board[cx][cy-1] > (current_distance + 1))) {
                    floodfill_board[cx][cy - 1] = current_distance + 1;
                    qx.push(cx);
                    qy.push(cy - 1);
                }
            }
            // South:
            if (cy < HEIGHT-1) {
                if ((floodfill_board[cx][cy+1] == -1) || (floodfill_board[cx][cy+1] > (current_distance + 1))) {
                    floodfill_board[cx][cy + 1] = current_distance + 1;
                    qx.push(cx);
                    qy.push(cy + 1);
                }
            }

            // West:
            if (cx > 0) {
                if ((floodfill_board[cx-1][cy] == -1) || (floodfill_board[cx-1][cy] > (current_distance + 1))) {
                    floodfill_board[cx-1][cy] = current_distance + 1;
                    qx.push(cx-1);
                    qy.push(cy);
                }
            }
            // East:
            if (cx < WIDTH-1) {
                if ((floodfill_board[cx+1][cy] == -1) || (floodfill_board[cx+1][cy] > (current_distance + 1))) {
                    floodfill_board[cx+1][cy] = current_distance + 1;
                    qx.push(cx+1);
                    qy.push(cy);
                }
            }
        }

        return floodfill_board;


    }
}



