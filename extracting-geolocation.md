<h3>Extracting geolocation from search results</h3>

<style>
#map { 
  height: 480px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
}
#resultList { 
   height: 480px; max-height: 480px; overflow-y: scroll; 
   /*border-style:inset;*/
   box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

}
.resultColumnLeft {
padding: 5px;
  flex: 40%;
   overflow-x: auto;
}
.resultColumnRight {
padding: 5px;
  flex: 60%;
}
.resultRow{
  display: flex;
}
/* Clear floats after the columns 
.resultRow:after {
  content: "";
  display: table;
  clear: both;
}
*/
#resultTable {
  border-collapse: collapse;
  border: 1px solid rgb(23, 156, 234);
  width: 100%;
}
#resultTable th {
  text-align: left;
  background-color: rgb(23, 156, 234);
  color: white;
}
#resultTable td {
  border: 1px solid rgb(23, 156, 234);
  vertical-align: top;
} 
</style>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" 
integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==" crossorigin=""/>
 <!-- Make sure you put this AFTER Leaflet's CSS -->
 <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js" 
integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ==" crossorigin=""></script>

<script>
/** Note that I copied this next convert function from somewhere on the web, 
ignoring any errors and not having it validated in any way */
/**
 * Converts the Dutch 'RD' RijksDriehoek coordinate system to standard WGS84 (GPS) coordinates
 *
 * @param x
 * @param y
 * @return {{lon: *, error: null, lat: *}}
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

function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

$(document).ready(function() {

    var map = L.map('map').setView([54.0, 9.0], 3);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var featureArr = []; // used for geojson file generation

   // read the guide: https://guides.dataverse.org/en/latest/api/search.html
   var start = 0;
   let pageSize = 50; // max 1000
   var num_retrieved = 0;

$("#btnSubmit").click(function(){
  /* example query
   * curl "https://archaeology.datastations.nl/api/search?q=*&type=dataset&metadata_fields=dansTemporalSpatial:*" | jq
   */

  // Getting EASY specific location metadata from its subverse
  $.ajax({url: "https://archaeology.datastations.nl/api/search?q=*&start="+start+"&per_page="+ pageSize+"&subtree=root&type=dataset&metadata_fields=dansTemporalSpatial:*", success: function(result){
    //$("#result").html(result.data.total_count);

    //result.data.items
    $.each(result.data.items, function(key, value) {
        if (typeof value.metadataBlocks.dansTemporalSpatial !== "undefined") {
          dansSpatialPoint = value.metadataBlocks.dansTemporalSpatial.fields.find(x => x.typeName === "dansSpatialPoint");
          let title = "<span><a href='" + value.url+ "' target='_blank'>" + value.name + "</a></span>";
          let location = ""; //nothing
          if (typeof dansSpatialPoint !== "undefined") {
            dansSpatialPointX = dansSpatialPoint.value[0]["dansSpatialPointX"].value
            dansSpatialPointY = dansSpatialPoint.value[0]["dansSpatialPointY"].value
            // calculate lat, lon in WGS84, assuming RD in m.
            // copy from https://github.com/glenndehaan/rd-to-wgs84/blob/master/src/index.js
            latLon = convert( parseFloat(dansSpatialPointX),  parseFloat(dansSpatialPointY))
            lat = latLon.lat;
            lon = latLon.lon;
            location = "<span><a href='http://maps.google.com/maps?z=18&q="+ lat + "," + lon + "' target='_blank'>" + lat  + ", " + lon + "</a></span>";
            
            // add to the features
            const feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                },
                "properties": {
                    "name": value.name,
                    "url": value.url,
                    "id": value.global_id
                }
            }
            featureArr.push(feature);

            // append to leaflet map
            var marker = L.marker([lat, lon]).addTo(map);
            marker.bindPopup("<b>" + value.name + "</b><br>"+ value.global_id);

            num_retrieved += 1; 
          }
          // add to the table, even if there is no location
          $("#resultTable> tbody").append("<tr><td>"+title+"</td><td>"+location+"</td></tr>");
       }
    });
    $("#result-totals").html(" Retrieved " + num_retrieved + " with a location");
    if (num_retrieved > 0) $("#downloadBtn").prop('disabled', false);
  }});  
  // the next page
  start = start + pageSize;
  $("#btnSubmit").val("Retrieve next "+ pageSize);
});


    $("#downloadBtn").click(function(){
      const itemCollection = {
        "type": "FeatureCollection",
        "features": featureArr
      };
      download(JSON.stringify(itemCollection,null,2), "results_geo.json", "application/json");
    });

});
</script>

<h4>Search the DANS Archaeology Datasets</h4>
<p>
The archive is here: <a href="https://archaeology.datastations.nl">https://archaeology.datastations.nl</a>. 

Most of these datasets have a location in The Netherlands specified in 'RD' coordinates, 
these must first be converted to WGS84 before they can be placed on the leaflet map. 
</p>

<span id="result-totals"></span> <input id = "btnSubmit" type="submit" value="Start Retrieving"/>
<p>Results <button id="downloadBtn" disabled >Download GeoJson</button></p>

<div class="resultRow">
  <div class="resultColumnLeft">
    <div id="resultList" >
      <table id="resultTable">
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  </div>
  <div class="resultColumnRight">
    <div id="map"></div>
  </div>
</div>
