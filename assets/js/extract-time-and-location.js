// Assume jQuery has been loaded before 
// and we are called from an onload, so all elements we need are there

function getText() {
  return "Some more text again";
}


/* format astro years as BC/AD */
function formatPeriod(start, end) {
  var periodStr = "";
  if (start > 0 && end > 0) {
    periodStr += start + " - " + end;
  } else if (start <= 0 && end > 0) {
    periodStr += Math.abs(start-1) + " BC - " + Math.abs(end) + " AD";
  } else if (start <= 0 && end <= 0) {
    periodStr += Math.abs(start-1) + " - " + Math.abs(end-1) + " BC";
  } else {
    /* something is wrong */
  }
  return periodStr;
}
// Maybe we can add links to a timeline; https://www.worldhistory.org/timeline/
// this one is a bit 'old' but the ideas are nice http://geacron.com/home-en/

function formatLocation(lat, lon) {
  //return lat + ", " + lon;
  // link to google map
  return "<span><a href='http://maps.google.com/maps?z=18&q="+ lat + "," + lon + "' target='_blank'>" + lat  + ", " + lon + "</a></span>";
}

/* format astro years as BC/AD */
function formatPeriod(start, end) {
  var periodStr = "";
  if (start > 0 && end > 0) {
    periodStr += start + " - " + end;
  } else if (start <= 0 && end > 0) {
    periodStr += Math.abs(start-1) + " BC - " + Math.abs(end) + " AD";
  } else if (start <= 0 && end <= 0) {
    periodStr += Math.abs(start-1) + " - " + Math.abs(end-1) + " BC";
  } else {
    /* something is wrong */
  }
  return periodStr;
}

function initTimeline() {
    // DOM element where the Timeline will be attached
    var container = document.getElementById('timeline');
    
    // Create a DataSet (allows two way data-binding)
    // https://visjs.github.io/vis-data/data/dataset.html
    var items = new vis.DataSet();
    
    // Configuration for the Timeline
    var options = {
      //cluster: true,
      maxHeight: 240,
      minHeight: 240,
      orientation: 'top',
      tooltip: {
        template: function(originalItemData, parsedItemData) {
          /* format astro years as BC/AD */
          var start = originalItemData.start.getFullYear();
          var end = originalItemData.end.getFullYear();
          var periodStr = formatPeriod(start, end);
          return originalItemData.title + " </br>" + periodStr;
        }
      }
    };
    
    // Create a Timeline
    // https://visjs.github.io/vis-timeline/
    var timeline = new vis.Timeline(container, items, options);
    return { timeline: timeline, items: items };
}

function addToMap(map, lon, lat, itemVal) {
    // add to the features
    const feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lon, lat]
        },
        "properties": {
            "name": itemVal.name,
            "url": itemVal.url,
            "id": itemVal.global_id
        }
    }
    //featureArr.push(feature);

    // append to leaflet map
    var marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup("<b>" + itemVal.name + "</b><br>"+ itemVal.global_id);
}

function setup() {

   // Init the map
   var map = L.map('map').setView([54.0, 9.0], 3);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var TL = initTimeline();

    // Init paged retrieval
    
    // read the guide: https://guides.dataverse.org/en/latest/api/search.html
    var start = 0;
    let pageSize = 10; // max 1000
    var num_retrieved = 0;
    
    $("#btnSubmit").click(function(){
      // Getting all DCCD specific metadata from its subverse
      $.ajax({url: "https://dataverse.nl/api/search?q=*&start="+start+"&per_page="+ pageSize+"&subtree=dccd&type=dataset&metadata_fields=dccd:*", success: function(result){
        //$("#result").html(result.data.total_count);
    
        // process search results
        $.each(result.data.items, function(key, value) {
          // try to extract period (timespan) information
          var periodStr = "";
          dccdPeriod = value.metadataBlocks.dccd.fields.find(x => x.typeName === "dccd-period");
          if (typeof dccdPeriod !== "undefined") {
            dccdPeriodStart = dccdPeriod.value[0]["dccd-periodStart"].value
            dccdPeriodEnd = dccdPeriod.value[0]["dccd-periodEnd"].value
            periodStr = formatPeriod(dccdPeriodStart, dccdPeriodEnd)
            // TODO add to timeline
            TL.items.add([  {id: value.global_id, content: value.name, title: value.name, start: dccdPeriodStart+'-01-01', end: dccdPeriodEnd+'-12-31'} ]);
          } else {
            // leave empty
          }
    
          // try to extract location (coordinates) information
          var locationStr = "";
          dccdLocation = value.metadataBlocks.dccd.fields.find(x => x.typeName === "dccd-location");
          if (typeof dccdLocation !== "undefined") {
            dccdLocationLat = dccdLocation.value[0]["dccd-latitude"].value
            dccdLocationLon = dccdLocation.value[0]["dccd-longitude"].value
            locationStr = formatLocation(dccdLocationLat, dccdLocationLon)
            // TODO add to map
            addToMap(map, dccdLocationLon, dccdLocationLat, value);
          } else {
            // leave empty
          }
    
          // construct result item and append to list or table
          //$("#resultList").append("<div data-gid='"+ value.global_id + "'>" + "<a href='" + value.url+ "'>" + value.name + "</a>" + " </div>");
          titleStr = value.name+"</br><a href='" + value.url+ "'>" + value.global_id + "</a>";
          $("#resultTable> tbody").append("<tr data-gid='"+ value.global_id + "'><td>"+titleStr+"</td><td>"+periodStr+"</td><td>"+locationStr+"</td></tr>");
    
          num_retrieved += 1;  
       });
    
        // maybe make fitting optional
        TL.timeline.fit();
        //map.setView(markersLayer.getBounds().getCenter());
        $("#result-totals").html(" Retrieved " + num_retrieved);
      }});
    
      // advance to support the next page
      start = start + pageSize;
      $("#btnSubmit").val("Retrieve next "+ pageSize);
     
    });

}