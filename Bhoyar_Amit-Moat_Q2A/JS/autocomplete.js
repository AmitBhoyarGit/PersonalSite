//all functions related to autocomplete control.

function autocomplete(inputElement, airportList) {
    var self = this;
    var currentFocus;
    self.selectedAirport = null;
    /*execute a function when someone writes in the text field:*/
    inputElement.addEventListener("input", function (e) {
        var airportDOMList, airportDOMItem, i, val = this.value;
        self.closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;

        /*create a DIV element that will contain the items (values):*/
        airportDOMList = document.createElement("DIV");
        airportDOMList.setAttribute("id", this.id + "autocomplete-list");
        airportDOMList.setAttribute("class", "autocomplete-items");

        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(airportDOMList);

        /*for each item in the array...*/
        for (i = 0; i < airportList.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            var isFound = self.searchAirport(airportList[i], val);
            if (isFound) {
                /*create a DIV element for each matching element:*/
                airportDOMItem = document.createElement("DIV");
                //airportDOMItem.innerHTML = "<strong>" + airportList[i][result.foundIn].substr(airportList[i][result.foundIn].indexOf(val), val.length) + "</strong>";
                var displayText = airportList[i].name + ' | ' + airportList[i].code;
                displayText = displayText.replace(new RegExp(val, 'gi'), "<strong>"+val.toUpperCase()+"</strong>");
                airportDOMItem.innerHTML += displayText;
                /*insert a input field that will hold the current array item's value:*/
                airportDOMItem.innerHTML += "<input type='hidden' data-lat='"+ airportList[i].lat +"' data-lng='"+airportList[i].lng+"' value='" + airportList[i].name +' | ' + airportList[i].code + "'>";
                
                /*execute a function when someone clicks on the item value (DIV element):*/
                airportDOMItem.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inputElement.value = this.getElementsByTagName("input")[0].value;
                    self.selectedAirport=null;
                    self.selectedAirport = {lat : e.currentTarget.lastChild.attributes["data-lat"].nodeValue, 
                                            lng : e.currentTarget.lastChild.attributes["data-lng"].nodeValue};
                    self.closeAllLists();
                });
                airportDOMList.appendChild(airportDOMItem);
            }
        }
    });

    /*execute a function presses a key on the keyboard:*/
    inputElement.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            self.addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            self.addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    self.searchAirport = function (airport, val) {
        if (val.length == 3) {
            if (airport.code.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                return true;
            }
        }
        if (airport.name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            return true;
        }
        
        else { return false; }

    }
    self.addActive = function (x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        self.removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    self.removeActive = function (x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    self.closeAllLists = function (elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inputElement) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        self.closeAllLists(e.target);
    });
}
