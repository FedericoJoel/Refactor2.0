  // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
        
      function initMap(j) {
        if(j == 1) {
        document.getElementById('altamapa').style.display = "block";
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.5991567, lng: -58.369587499999966},
          zoom: 13
        });
        var input = /** @type {!HTMLInputElement} */(
            document.getElementById('pac-input'));

        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });
        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
          }
          marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open(map, marker);
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
            var scopelat = angular.element(document.getElementById("lat")).scope();
            var scopelng = angular.element(document.getElementById("lng")).scope();
            scopelat.lat = lat;
            scopelng.lng = lon;
            scopelng.$apply();
            scopelat.$apply();

        });

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function() {
            autocomplete.setTypes(types);
          });
        }
        setupClickListener('changetype-all', []);
        setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);  

      } else {document.getElementById('altamapa').style.display = "block";};
    }

      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
        
      function initMapModificar(j,latitude,longitude) {
        if(j == 1) {
        document.getElementById('modificarmapa').style.display = "block";
        latitud = parseFloat(latitude);
        longitud = parseFloat(longitude);
        console.log(latitud);
        console.log(longitud);
        console.log(latitude);
        console.log(longitude);
        
        var myLatLng = {lat: latitud, lng: longitud};
        
        var map = new google.maps.Map(document.getElementById('modificarmap'), {
          // center: {lat: -34.5991567, lng: -58.369587499999966},
          center: myLatLng,
          zoom: 13
        });

        var ubicacionInicialMarker = new google.maps.Marker({
          map: map,
          // anchorPoint: new google.maps.Point(0, -29)
          position:myLatLng,
          title:'hola'
        });

        // ubicacionInicialMarker.setIcon(/** @type {google.maps.Icon} */({
          // url: place.icon,
          // size: new google.maps.Size(71, 71),
          // origin: new google.maps.Point(0, 0),
          // anchor: new google.maps.Point(17, 34),
        //   scaledSize: new google.maps.Size(35, 35)
        // }));
        // ubicacionInicialMarker.setPosition(place.geometry.location);
        // ubicacionInicialMarker.setVisible(true);

        var input = /** @type {!HTMLInputElement} */(
            document.getElementById('modificarpac-input'));

        var types = document.getElementById('modificartype-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });
        autocomplete.addListener('place_changed', function() {
          ubicacionInicialMarker.setVisible(false);
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
          }
          marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open(map, marker);
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
            var scopelat = angular.element(document.getElementById("modificarlat")).scope();
            var scopelng = angular.element(document.getElementById("modificarlng")).scope();
            scopelat.lat = lat;
            scopelng.lng = lon;
            scopelng.$apply();
            scopelat.$apply();

        });

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function() {
            autocomplete.setTypes(types);
          });
        }
        setupClickListener('changetype-all', []);
        setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);  

      } else {document.getElementById('modificarmapa').style.display = "block";};
    }