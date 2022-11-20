
<style>
.button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 8px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  border-radius: 6px;
}
.button:hover {
  background-color: #2e9632; /* Darker Green */
}
input {
  padding: 6px 16px;
  font-size: 14px;
  border-radius: 6px;
}

#map { height: 320px; }
</style>

<h3>RD to WGS84 coordinates conversion</h3>
<p>
The RD or 'Rijksdriehoekscoördinaten' is a much used coordinate system in The Netherlands:
<a href="https://nl.wikipedia.org/wiki/Rijksdriehoeksco%C3%B6rdinaten" target="_blank">RD-coordinates explained</a>

<br/>
<!-- 
EPSG:28992
Show that you can use the params to link with a URL (use old origin in Amersfoort!)
  converting-rdcoordinates?rdx=155000&rdy=463000
-->
Note that you can use URL parameters in a link to this page: <a href="{{ site.baseurl }}/converting-rdcoordinates?rdx=155000&rdy=463000">rdx=155000&rdy=463000</a>
</p>


<p>
<form id="rdform" action="">
    <span>RD: </span>
    <label for="rdx">x (lon) </label><input id="rdx" name="rdx" type="number" min="0" value="155000"/>
    <label for="rdy">y (lat) </label><input id="rdy" name="rdy" type="number" min="0" value="463000"/>
    <input type="submit" value="Convert" class="button"/>
</form>
<div id="WGS84"></div>
</p>

<div id="map" style="height:320px;"></div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" 
integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==" crossorigin=""/>
<!-- Make sure you put this AFTER Leaflet's CSS -->
<script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ==" crossorigin=""></script>

<script>
    function get_query(){
        var url = document.location.href;
        var qs = url.substring(url.indexOf('?') + 1).split('&');
        for(var i = 0, result = {}; i < qs.length; i++){
            qs[i] = qs[i].split('=');
            result[qs[i][0]] = decodeURIComponent(qs[i][1]);
        }
        return result;
    }
    /** Note that I copied this next convert function from somewhere on the web, 
    ignoring any errors and not having it validated in any way */
    /**
        * Converts the Dutch 'RD' RijksDriehoek coordinate system to standard WGS84 (GPS) coordinates
        *
        * @param x
        * @param y
        * @return 
        */
    const convert = (x, y) => {
        const x0 = 155000.000;
        const y0 = 463000.000;

        const f0 = 52.156160556;
        const l0 = 5.387638889;

        const a01 = 3236.0331637;
        const b10 = 5261.3028966;
        const a20 = -32.5915821;
        const b11 = 105.9780241;
        const a02 = -0.2472814;
        const b12 = 2.4576469;
        const a21 = -0.8501341;
        const b30 = -0.8192156;
        const a03 = -0.0655238;
        const b31 = -0.0560092;
        const a22 = -0.0171137;
        const b13 = 0.0560089;
        const a40 = 0.0052771;
        const b32 = -0.0025614;
        const a23 = -0.0003859;
        const b14 = 0.0012770;
        const a41 = 0.0003314;
        const b50 = 0.0002574;
        const a04 = 0.0000371;
        const b33 = -0.0000973;
        const a42 = 0.0000143;
        const b51 = 0.0000293;
        const a24 = -0.0000090;
        const b15 = 0.0000291;

        const dx = (x - x0) * Math.pow(10, -5);
        const dy = (y - y0) * Math.pow(10, -5);

        let df = a01 * dy + a20 * Math.pow(dx, 2) + a02 * Math.pow(dy, 2) + a21 * Math.pow(dx, 2) * dy + a03 * Math.pow(dy, 3);
        df += a40 * Math.pow(dx, 4) + a22 * Math.pow(dx, 2) * Math.pow(dy, 2) + a04 * Math.pow(dy, 4) + a41 * Math.pow(dx, 4) * dy;
        df += a23 * Math.pow(dx, 2) * Math.pow(dy, 3) + a42 * Math.pow(dx, 4) * Math.pow(dy, 2) + a24 * Math.pow(dx, 2) * Math.pow(dy, 4);

        const f = f0 + df / 3600;

        let dl = b10 * dx + b11 * dx * dy + b30 * Math.pow(dx, 3) + b12 * dx * Math.pow(dy, 2) + b31 * Math.pow(dx, 3) * dy;
        dl += b13 * dx * Math.pow(dy, 3) + b50 * Math.pow(dx, 5) + b32 * Math.pow(dx, 3) * Math.pow(dy, 2) + b14 * dx * Math.pow(dy, 4);
        dl += b51 * Math.pow(dx, 5) * dy + b33 * Math.pow(dx, 3) * Math.pow(dy, 3) + b15 * dx * Math.pow(dy, 5);

        const l = l0 + dl / 3600;

        const fWgs = f + (-96.862 - 11.714 * (f - 52) - 0.125 * (l - 5)) / 100000;
        const lWgs = l + (-37.902 + 0.329 * (f - 52) - 14.667 * (l - 5)) / 100000;

        return {
            error: null,
            lat: fWgs,
            lon: lWgs
        }
    };

    function formatWGS84Location(lat, lon) {
        // also  link to google map
        return "<span>" + lat  + ", " + lon 
            + " <a href='http://maps.google.com/maps?z=18&q="+ lat + "," + lon 
            + "' target='_blank'>Show on GoogleMaps</a></span>";
    }

    function centerLeafletMapOnMarker(map, marker) {
        var latLngs = [ marker.getLatLng() ];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);
    }

    $(document).ready(function() {
        var map = L.map('map').setView([54.0, 9.0], 3);
                        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        }).addTo(map);

        function processRD(x, y) {
            latLon = convert(x, y);
            lat = latLon.lat;
            lon = latLon.lon;
            $('#WGS84').html("");
            $('#WGS84').append("WGS84 (lat, lon): " + formatWGS84Location(lat, lon));
            // append to leaflet map
            var marker = L.marker([lat, lon]).addTo(map);
            centerLeafletMapOnMarker(map, marker);
        }

        /* NOTE when using the URL params, no need for the on submit handling!
        /*       
        $("#rdform").on('submit', function(e) {           
            var rdx = $("#rdform :input[name='rdx']").val(); 
            var rdy = $("#rdform :input[name='rdy']").val(); 
            processRD( parseFloat(rdx),  parseFloat(rdy))
            e.preventDefault();
        });
        */
        var params = get_query();
        if ('rdx' in params && 'rdy' in params) {
            $("#rdform :input[name='rdx']").val(params.rdx);
            $("#rdform :input[name='rdy']").val(params.rdy);
            //$("#rdform").submit();
            processRD(parseFloat(params.rdx),  parseFloat(params.rdy));
        } 
    });

</script>
