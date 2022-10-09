<h3>Extracting timespan from search results</h3>

<style>
#timeline {
      height: 480px;
      /* border: 1px solid lightgray; */
      border-style:inset;
      /*overflow-y: scroll; */
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
#resultTable> tbody tr.selected {
    background-color: lightskyblue !important;
    /*color:#fff; */
    border: 1px solid darkslateblue;
}
</style>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<!-- Timeline -->
<script type="text/javascript" src="https://unpkg.com/vis-timeline@latest/standalone/umd/vis-timeline-graph2d.min.js"></script>
<link href="https://unpkg.com/vis-timeline@latest/styles/vis-timeline-graph2d.min.css" rel="stylesheet" type="text/css" />
<style>
    /* alternating column backgrounds */
    .vis-time-axis .vis-grid.vis-odd {
      background: #f5f5f5;
    }
</style>
<script>

$(document).ready(function() {

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

// DOM element where the Timeline will be attached
var container = document.getElementById('timeline');

// Create a DataSet (allows two way data-binding)
// https://visjs.github.io/vis-data/data/dataset.html
var items = new vis.DataSet();

// Configuration for the Timeline
var options = {
  //cluster: true,
  maxHeight: 480,
  minHeight: 480,
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

   // read the guide: https://guides.dataverse.org/en/latest/api/search.html
   var start = 0;
   let pageSize = 50; // max 1000
   var num_retrieved = 0;

$("#btnSubmit").click(function(){
  // Getting all DCCD specific metadata from its subverse
  $.ajax({url: "https://dataverse.nl/api/search?q=*&start="+start+"&per_page="+ pageSize+"&subtree=dccd&type=dataset&metadata_fields=dccd:*", success: function(result){
    //$("#result").html(result.data.total_count);

    $.each(result.data.items, function(key, value) {
      var periodStr = "";
      dccdPeriod = value.metadataBlocks.dccd.fields.find(x => x.typeName === "dccd-period");
      if (typeof dccdPeriod !== "undefined") {
        dccdPeriodStart = dccdPeriod.value[0]["dccd-periodStart"].value
        dccdPeriodEnd = dccdPeriod.value[0]["dccd-periodEnd"].value
        periodStr = formatPeriod(dccdPeriodStart, dccdPeriodEnd)
        // add to timeline
        items.add([  {id: value.global_id, content: value.name, title: value.name, start: dccdPeriodStart+'-01-01', end: dccdPeriodEnd+'-12-31'} ]);
      } else {
        // leave empty
      }

      //$("#resultList").append("<div data-gid='"+ value.global_id + "'>" + "<a href='" + value.url+ "'>" + value.name + "</a>" + " </div>");
      titleStr = value.name+"</br><a href='" + value.url+ "'>" + value.global_id + "</a>";
      $("#resultTable> tbody").append("<tr data-gid='"+ value.global_id + "'><td>"+titleStr+"</td><td>"+periodStr+"</td></tr>");

      num_retrieved += 1;  
   });

    timeline.fit();
    $("#result-totals").html(" Retrieved " + num_retrieved);
  }});


  // the next page
  start = start + pageSize;
  $("#btnSubmit").val("Retrieve next "+ pageSize);
 
});

timeline.on('select', function (properties) {
  //alert("item: " + properties.items[0]);
  gid = properties.items[0];
  $('.selected').removeClass('selected');
  selected_elem = $("#resultTable> tbody tr[data-gid='" + gid +"'").addClass("selected");
      var container = $("#resultList");
      var scrollTo = selected_elem;
      // Calculating new position of scrollbar
      var position = scrollTo.offset().top 
                - container.offset().top 
                + container.scrollTop();
      // Setting the value of scrollbar
      //container.scrollTop(position);
      $("#resultList").animate({
        scrollTop: position
      }, 500);
    });


$("#resultTable> tbody").on('click','tr',function () {
  //alert( "Handler for .click() called." );
  $('.selected').removeClass('selected');
  $(this).addClass("selected");
  var gid =$(this).attr("data-gid");
  // TODO check if defined
  //alert(gid);
  timeline.setSelection(gid);
  timeline.focus(gid);
});


});
</script>

<h4>Search the DCCD dendrochronology Datasets</h4>
<p>
The archive is here: <a href="https://dataverse.nl/dataverse/dccd">https://dataverse.nl/dataverse/dccd</a>. 

Most of these datasets have a timespan
</p>

<span id="result-totals"></span> <input id = "btnSubmit" type="submit" value="Start Retrieving"/>
<p>Results</p>

<div class="resultRow">
  <div class="resultColumnLeft">
    <div id="resultList" >
      <table id="resultTable">
        <thead>
          <tr>
            <th>Title</th>
            <th>Timespan</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  </div>
  <div class="resultColumnRight">
    <div id="timeline"></div>
  </div>
</div>
