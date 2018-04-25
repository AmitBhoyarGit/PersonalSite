function viewModel() {
    var self = this;
    //member variables
    self.airportFromObject = null;
    self.airportToObject = null;
    self.map = null;

    //member functions
    self.initializeAutocomplete = function () {
        self.airportFromObject = new autocomplete(document.getElementById("airportFrom"), USA_Airport_List);
        self.airportToObject = new autocomplete(document.getElementById("airportTo"), USA_Airport_List);
    }

    self.plotGoogleMaps = function (lat1, lat2, lng1, lng2) {
        var mapProp = {
            center: new google.maps.LatLng(lat1, lng1),
            zoom: 4,
        };
        //Initialize google map.
        self.map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        var flightPlanCoordinates = [
            { lat: lat1, lng: lng1 },
            { lat: lat2, lng: lng2 }
        ];
        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        //draw polygon/route on map.
        flightPath.setMap(self.map);

        var bounds = new google.maps.LatLngBounds();
        var markerF = new google.maps.Marker({
            position: { lat: lat1, lng: lng1 },
            map: self.map,
        });

        var markerT = new google.maps.Marker({
            position: { lat: lat2, lng: lng2 },
            map: self.map,
        });
        //Draw markers on graph.
        loc = new google.maps.LatLng(markerF.position.lat(), markerF.position.lng());
        bounds.extend(loc);
        loc = new google.maps.LatLng(markerT.position.lat(), markerT.position.lng());
        bounds.extend(loc);

        //set center and zoom of graph according to route.
        self.map.fitBounds(bounds);
        self.map.panToBounds(bounds);
    }

    self.calculateDistance = function () {
        //get latitude and longitude.
        var lat1 = parseFloat(self.airportFromObject.selectedAirport ? self.airportFromObject.selectedAirport.lat : null);
        var lng1 = parseFloat(self.airportFromObject.selectedAirport ? self.airportFromObject.selectedAirport.lng : null);
        var lat2 = parseFloat(self.airportToObject.selectedAirport ? self.airportToObject.selectedAirport.lat : null);
        var lng2 = parseFloat(self.airportToObject.selectedAirport ? self.airportToObject.selectedAirport.lng : null);

        if (lat1 && lng1 && lat2 && lng2) {
            var earthRadiusInMiles = 3959; //earth radius in miles;

            var degreeLAT = (lat2 - lat1) * (Math.PI / 180);
            var degreeLNG = (lng2 - lng1) * (Math.PI / 180);

            var a = Math.sin(degreeLAT / 2) * Math.sin(degreeLAT / 2) +
                Math.cos((lat1) * (Math.PI / 180)) * Math.cos((lat2) * (Math.PI / 180)) *
                Math.sin(degreeLNG / 2) * Math.sin(degreeLNG / 2);

            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var distance = earthRadiusInMiles * c
            distance = Math.round(distance * 100) / 100
            console.log(distance);
            self.printDistance(distance);
            self.plotGoogleMaps(lat1, lat2, lng1, lng2);
        }
        else { alert("Please select proper input(s).") }
    }

    self.printDistance = function (distance) {
        distanceDIV = document.getElementById("calculatedDistance")
        distanceDIV.innerHTML = '';
        disDOM = document.createElement("h1");
        disDOM.innerHTML = distance;
        distanceDIV.appendChild(disDOM);
        distanceDIV.innerHTML += "<small>Distance in miles.</small>";
    }

    cButton = document.getElementById("calculate");
    cButton.addEventListener("click", function (e) {
        console.log('calculating');
        self.calculateDistance();
    });

}

vm = new viewModel();
vm.initializeAutocomplete();