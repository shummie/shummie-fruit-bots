var HeatBot = {
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

        // Assign weights to each fruit. 
        this.needed_fruits = new Array(get_number_of_item_types() + 1);
        this.needed_fruits[0] = 0;
        
        for (var i = 1; i < this.needed_fruits.length; i++) {
            total_fruits = get_total_item_count(i);
            if ((this.get_my_item_count(i) > total_fruits / 2) || (this.get_opponent_item_count(i) > total_fruits / 2)) {
                this.needed_fruits[i] = 0;
            } else {
                this.needed_fruits[i] = total_fruits / 2 - this.get_my_item_count(i); // I might need a fudge factor here?
            }
        }
        
        // convert the board into an array of arrays that we can manipulate / are interested in
        this.board = new Array();
        for (var i = 0; i < WIDTH; i++) {
            this.board[i] = new Array(HEIGHT);
            for (var j = 0; j < HEIGHT; j++) {
                if (this.board_base[i][j]) {
                    var fruit = this.board_base[i][j];
                    if (this.needed_fruits[fruit] > 0) {
                        this.board[i][j] = this.board_base[i][j];
                    } else {
                        this.board[i][j] = 0;
                    }
                } else {
                    this.board[i][j] = 0;
                }
            }
        }
        
        // Now we have the # of fruits needed to score. Add influence maps.
        
        // initialize heatmap
        this.heatmap = new Array();
        for (var i = 0; i < WIDTH; i++) {
            this.heatmap[i] = new Array(HEIGHT);
            for (var j = 0; j < HEIGHT; j++) {
                this.heatmap[i][j] = 0;
            }
        }
        
        for (var i = 0; i < WIDTH; i++) {
            for (var j = 0; j < HEIGHT; j++) {
                if (this.board[i][j] > 0 && this.needed_fruits[this.board[i][j]] > 0) {
                    this.add_heat(i, j, 1 / this.needed_fruits[this.board[i][j]]);
                }
            }
        }        
        
        // we found an item! take it!
        if ((this.board[this.x][this.y])) {
            return TAKE;
        }
        
       
        // check all directions
        var best, direction;
        best = 0;
        if (this.y > 0) {
            if (this.heatmap[this.x][this.y-1] > best) {
                best = this.heatmap[this.x][this.y-1];
                direction = NORTH;
            }
        }
        if (this.y < HEIGHT - 1) {
            if (this.heatmap[this.x][this.y+1] > best) {
                best = this.heatmap[this.x][this.y+1];
                direction = SOUTH;
            }
        }
        if (this.x > 0) {
            if (this.heatmap[this.x-1][this.y] > best) {
                best = this.heatmap[this.x-1][this.y];
                direction = WEST;
            }
        }
        if (this.x < WIDTH - 1) {
            if (this.heatmap[this.x+1][this.y] > best) {
                best = this.heatmap[this.x+1][this.y];
                direction = EAST;
            }
        }

        return direction;

    },

    
    add_heat: function(x, y, strength) {
        var decay = 0.7;
        
        for (var i = 0; i < WIDTH; i++) {
            for (var j = 0; j < HEIGHT; j++) {
                d = this.distance([x, y], [i, j]);
                this.heatmap[i][j] += Math.pow(d, -decay) * strength;
            }
        }
        
    },
    
    distance: function(a, b) {
        // Manhattan distance between two points
        return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
    }
}



