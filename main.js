(function () {
    if (!window.bingo) {
        window.bingo = {};
    }
    
    var bingo = window.bingo;
    
    bingo.generate = function () {
        var list,
            board = [],
            i,
            boardUI;
          
        // generate board
        list = bingo.items.slice(0);
        list.forEach(function(value, index) {
            list[index] = {index: index, value: value};
        })
        for (i = 0; i < 25; i += 1) {
            item = Math.floor(Math.random() * list.length);
            board.push(list[item]);
            list.splice(item, 1);
        }
        
        
        bingo.currentBoard = board;
        
        // clear ui board
        boardUI = document.getElementById("board");
        boardUI.innerHTML = "";
        
        // add each item to the board
        board.forEach(function(item, index) {
            if (index === 12) {
                boardUI.innerHTML += '<div data-checked="true" data-free="true"><div class="cellwrapper">Free</div></div>';

            } else {
                boardUI.innerHTML += '<div><div class="celloverlay"></div><div class="cellwrapper">' + item.value + '</div></div>';
            }
        });
        
    }
    
    
    bingo.init = function () {
        if (!bingo.hasOwnProperty("items")) {
            console.log("Word list not loaded");

        } else {
            
            
            
            
            
            if (window.location.hash) {
                // load from hash

            } else {
                bingo.generate();
            }
        }
    }
    
    
    
    
    


    window.onload = bingo.init;
}());