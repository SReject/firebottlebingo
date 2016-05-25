(function () {
    if (!window.bingo) {
        window.bingo = {};
    }
    var bingo = window.bingo;
    
    function checkboxClick(ev) {
        var checkbox = this.getElementsByTagName("input")[0];
        

        if (checkbox.checked) {
            // checkbox.removeAttribute("checked");
            checkbox.checked = false;

        } else {
            //checkbox.setAttribute("checked", true);
            checkbox.checked = true;
        }
    }
    
    function stopProp(ev) {
        ev.stopPropagation();
    }
    
    
    function generate() {
        bingo.ele.checklist.innerHTML = "";
        bingo.items.forEach(function (item, index) {
            var wrapper, input, label, labeltext, id = "item" + index;
            input = document.createElement('input');
            input.setAttribute("type", "checkbox");
            input.setAttribute("id", id);
            input.addEventListener("click", stopProp);
            
            /*label = document.createElement("label");
            label.setAttribute("for", id);
            label.setAttribute("class", "checklistitemlabel");
            label.addEventListener("click", stopProp);
            label.appendChild(document.createTextNode(item));
            */
            
            wrapper = document.createElement('div');
            wrapper.setAttribute("class", "checklistitem");
            wrapper.addEventListener("click", checkboxClick.bind(wrapper));
            
            
            wrapper.appendChild(input);
            wrapper.appendChild(document.createTextNode(item));
            bingo.ele.checklist.appendChild(wrapper);
        });
    };
    
    window.onload = function () {
        if (!bingo.hasOwnProperty("items")) {
            console.log("Word list not loaded");

        } else {
            bingo.ele = {};
            bingo.ele.checklist = document.getElementById("checklist");
            bingo.ele.clearButton = document.getElementById("checklistclear");
            bingo.ele.clearButton.addEventListener("click", generate);
            
            
            generate();
        }
    };
}());