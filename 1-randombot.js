var RandomBot = {
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

       this.board = get_board();

       if (this.playerNumber == 1) {
           this.x = get_my_x();
           this.y = get_my_y();
           this.ox = get_opponent_x();
           this.oy = get_opponent_y();
       } else {
           this.ox = get_my_x();
           this.oy = get_my_y();
           this.x = get_opponent_x();
           this.y = get_opponent_y();
       }

       // we found an item! take it!
       if (has_item(this.board[this.x][this.y])) {
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



