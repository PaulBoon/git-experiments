
<style>
#visualization {
      width: 600px;
      height: 400px;
      /* border: 1px solid lightgray; */
      border-style:inset;
}
</style>

<h3>Using The Timeline visualisation library in Github Pages</h3>

<!-- use http://almende.github.io/chap-links-library/timeline.html  
and have a look at my DCCD stuff in https://github.com/PaulBoon/dccd-webui/blob/master/src/main/java/nl/knaw/dans/dccd/common/wicket/timeline/Timeline.js 
maybe use https://visjs.github.io/vis-timeline/examples/timeline/other/clustering.html
new and also with clustering, its predecessor!
-->


<p>
The div below should be 'automatically' filled with a Timeline, 
when the page is loaded. <br/>
<div id="timeline" style="border-style:inset;"></div>
</p>
<p>
The code is based on some basic examples from <a href="https://visjs.github.io/vis-timeline/">the Timeline website</a>.
</p>

```html
<style>
#timeline {
      width: 600px;
      height: 400px;
      /* border: 1px solid lightgray; */
      border-style:inset;
}
</style>
<div id="timeline" style="border-style:inset;"></div>
<!-- jQuery -->
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

  // DOM element where the Timeline will be attached
  var container = document.getElementById('timeline');

  // Create a DataSet (allows two way data-binding)
  var items = new vis.DataSet([
    {id: 1, content: 'bronstijd', title:'bronstijd',start: '-1999-01-01', end: '-799-12-31'}, // https://data.cultureelerfgoed.nl/term/id/abr/8072a357-c9aa-4cd8-b8ba-c06a8e176431
    {id: 2, content: 'ijzertijd', title: 'ijzertijd',start: '-799-01-01', end: '-11-12-31'}, // https://data.cultureelerfgoed.nl/term/id/abr/0e341d8a-d304-40fe-8dda-dd3845bb1f7f
    {id: 3, content: 'romeinsetijd', title: 'romeinsetijd', start: '-11-01-01', end: '450-12-31'}, // https://data.cultureelerfgoed.nl/term/id/abr/5a2cef7f-1fc3-45a7-9271-cd634c748e49
    {id: 4, content: 'middeleeuwen', title: 'middeleeuwen', start: '450-01-01', end: '1500-12-31'}, // https://data.cultureelerfgoed.nl/term/id/abr/4bf24a9f-1f7d-497e-96a4-d4a0f42d564b
    {id: 5, content: 'nieuwetijd', title: 'nieuwetijd', start: '1500-01-01', end: '1945-05-05'} // https://data.cultureelerfgoed.nl/term/id/abr/c6858173-5ca2-4319-b242-f828ec53d52d
  ]);

  // Configuration for the Timeline
  var options = {
    orientation: 'top',
    tooltip: {
      template: function(originalItemData, parsedItemData) {
        /* format astro years as BC/AD */
        var start = originalItemData.start.getFullYear();
        var end = originalItemData.end.getFullYear();
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

  // Create a Timeline
  var timeline = new vis.Timeline(container, items, options);

});
</script>
```

<!-- jQuery -->
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

  // DOM element where the Timeline will be attached
  var container = document.getElementById('timeline');

  // Create a DataSet (allows two way data-binding)
  var items = new vis.DataSet([
    {id: 1, content: 'bronstijd', title:'bronstijd',start: '-1999-01-01', end: '-799-12-31'}, // https://data.cultureelerfgoed.nl/term/id/abr/8072a357-c9aa-4cd8-b8ba-c06a8e176431
    {id: 2, content: 'ijzertijd', title: 'ijzertijd',start: '-799-01-01', end: '-11-12-31'}, // https://data.cultureelerfgoed.nl/term/id/abr/0e341d8a-d304-40fe-8dda-dd3845bb1f7f
    {id: 3, content: 'romeinsetijd', title: 'romeinsetijd', start: '-11-01-01', end: '450-12-31'}, // https://data.cultureelerfgoed.nl/term/id/abr/5a2cef7f-1fc3-45a7-9271-cd634c748e49
    {id: 4, content: 'middeleeuwen', title: 'middeleeuwen', start: '450-01-01', end: '1500-12-31'}, // https://data.cultureelerfgoed.nl/term/id/abr/4bf24a9f-1f7d-497e-96a4-d4a0f42d564b
    {id: 5, content: 'nieuwetijd', title: 'nieuwetijd', start: '1500-01-01', end: '1945-05-05'} // https://data.cultureelerfgoed.nl/term/id/abr/c6858173-5ca2-4319-b242-f828ec53d52d
  ]);

  // Configuration for the Timeline
  var options = {
    orientation: 'top',
    tooltip: {
      template: function(originalItemData, parsedItemData) {
        /* format astro years as BC/AD */
        var start = originalItemData.start.getFullYear();
        var end = originalItemData.end.getFullYear();
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

        return originalItemData.title + " </br>" + periodStr;
      }
    }
  };

  // Create a Timeline
  var timeline = new vis.Timeline(container, items, options);

  // note could add button for timeline.fit(); that resets the view 
  // after lots of scrolling and zooming...

});
</script>

<!-- would be nice to get time ranges from another service, 
     but all I can find are having an API with a key, makes them server side only -->
<!-- TODO use timespans from searching the DANS DCCD archives -->
