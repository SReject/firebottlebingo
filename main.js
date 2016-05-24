(function () {
    
    if (!window.bingo) {
        window.bingo = {};
    }
    var bingo = window.bingo;
    
    
    function lpad(input, pad, chr) {
        input = String(input);
        if (input.length >= pad) {
            return input;
        }
        return Array(pad - String(input).length + 1).join(chr || '0') + input;
    }
    function encode(board) {
        var binIds = "",
            encoded = "";

        board.forEach(function (item, index) {
            binIds += lpad(item.index.toString(2), 6);
            if (binIds.length >= 8 || index === board.length -1) {
                encoded += lpad(parseInt(binIds.substring(0, 8), 2).toString(16), 2);
                binIds = binIds.substring(8);
            }
        });
        return encoded;
    }
    
    function toggleChecked() {
        var ele = this,
            index = "abcdefghijklmnopqrstuvwx"[parseInt(ele.getAttribute("cell-index"), 10)];
        
        if (ele.getAttribute("data-checked") === "true") {
            ele.setAttribute("data-checked", "");
            bingo.checked = bingo.checked.join("").replace(index, "").split(/(?!^)/g);
        } else {
            ele.setAttribute("data-checked", "true");
            bingo.checked.push(index);
        }
        
        window.location.hash = "boardid=" + bingo.board + "&checked=" + bingo.checked.join("");
    }
    
    
    
    function generate() {
        var list,
            board = [],
            i,
            boardUI,
            id = [],
            encodedBoard;
          
        // generate board
        list = bingo.items.slice(0);
        list.forEach(function(value, index) {
            list[index] = {index: index, value: value};
        })
        for (i = 0; i < 24; i += 1) {
            item = Math.floor(Math.random() * list.length);
            board.push(list[item]);
            list.splice(item, 1);
        }
        console.log("board length", board.length);
        
        // clear ui board
        boardUI = document.getElementById("board");
        boardUI.innerHTML = "";
        
        // add each item to the board
        board.forEach(function(item, index) {
            var wrapper, overlay, cell;
            
            if (index === 12) {
                cell = document.createElement("div");
                cell.setAttribute("class", "cellwrapper");
                cell.appendChild(document.createTextNode("Free"));
                wrapper = document.createElement("div");
                wrapper.setAttribute("data-checked", "true");
                wrapper.setAttribute("data-free", "true");
                wrapper.appendChild(cell);
                boardUI.appendChild(wrapper);

            }
            
            overlay = document.createElement("div");
            overlay.setAttribute("class", "celloverlay");

            cell = document.createElement("div");
            cell.setAttribute("class", "cellwrapper");
            cell.appendChild(document.createTextNode(item.value));
            
            wrapper = document.createElement("div");
            wrapper.setAttribute("cell-index", index.toString(10));
            wrapper.appendChild(overlay);
            wrapper.appendChild(cell);
            
            boardUI.appendChild(wrapper);
            wrapper.addEventListener("click", toggleChecked.bind(wrapper), true);
        });
        bingo.board = encodedBoard = encode(board);
        bingo.checked = [];

        document.getElementById("boardid").innerHTML = encodedBoard;
        window.location.hash = "boardid=" + encodedBoard + "&checked=";     
    }

    function loadFromHash() {
        var matched = window.location.hash.match(/^#?boardid=([a-f\d]{36})(?:&checked=([a-x]{0,24}))?$/),
            key = "abcdefghijklmnopqrstuvwx",
            checked,
            index,
            checkedList = [],
            boardid,
            boardIdConst = "",
            board = [],
            i,
            boardUI;
            

        if (!matched) {
            console.log("bad hash: no match");

        } else {
            checked = matched[2];
            if (checked) {
                while (checked.length) {
                    index = checked.substring(0, 1);
                    checked = checked.substring(1);
                    
                    
                    checkedList.push(key.indexOf(index));
                }
            }
            
            
            boardIdConst = boardid = matched[1];
            boardid = boardid.replace(/(..)/g, function (text) {
                var item = parseInt(text, 16);
                return lpad(item.toString(2), 8);
            });
            while (boardid) {
                index = parseInt(boardid.substring(0, 6), 2)
                boardid = boardid.substring(6);
                if (index === NaN || index > bingo.items.length -1) {
                    console.log("bad board: invalid index");
                    return;

                } else {
                    board.push({value: bingo.items[index], checked: checkedList.indexOf(board.length) > -1 ? true : false});
                }
            }
            
            boardUI = document.getElementById("board");
            boardUI.innerHTML = "";
            board.forEach(function (item, index) {
                if (index === 12) {
                    cell = document.createElement("div");
                    cell.setAttribute("class", "cellwrapper");
                    cell.appendChild(document.createTextNode("Free"));
                    wrapper = document.createElement("div");
                    wrapper.setAttribute("data-checked", "true");
                    wrapper.setAttribute("data-free", "true");
                    wrapper.appendChild(cell);
                    boardUI.appendChild(wrapper);
                }
                
                overlay = document.createElement("div");
                overlay.setAttribute("class", "celloverlay");

                cell = document.createElement("div");
                cell.setAttribute("class", "cellwrapper");
                cell.appendChild(document.createTextNode(item.value));
                
                wrapper = document.createElement("div");
                wrapper.setAttribute("cell-index", index.toString(10));
                if (item.checked) {
                    wrapper.setAttribute("data-checked", "true");
                }
                
                wrapper.appendChild(overlay);
                wrapper.appendChild(cell);
                
                boardUI.appendChild(wrapper);
                wrapper.addEventListener("click", toggleChecked.bind(wrapper), true);
                
            });
            
            bingo.board = boardIdConst;
            bingo.checked = checkedList;
            document.getElementById("boardid").innerHTML = bingo.board;
        }
    }
    

    
    
    window.onload = function () {
        if (!bingo.hasOwnProperty("items")) {
            console.log("Word list not loaded");

        } else {
            document.getElementById("newboard").addEventListener("click", function () {
                generate();
            });
            
            
            
            
            if (window.location.hash) {
                loadFromHash();

            } else {
                generate();
            }
        }
    };
}());