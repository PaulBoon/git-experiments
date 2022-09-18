
<style>
#visualization {
      width: 600px;
      height: 400px;
      /* border: 1px solid lightgray; */
      border-style:inset;
}
</style>

<h3>Using The Timeline library in Github Pages</h3>

<!-- use http://almende.github.io/chap-links-library/timeline.html  
and have a look at the dccd stuff in https://github.com/PaulBoon/dccd-webui/blob/master/src/main/java/nl/knaw/dans/dccd/common/wicket/timeline/Timeline.js 
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
<script>
$(document).ready(function() {

  // DOM element where the Timeline will be attached
  var container = document.getElementById('timeline');

  // Create a DataSet (allows two way data-binding)
  var items = new vis.DataSet([
    {id: 1, content: 'item 1', start: '2014-04-20'},
    {id: 2, content: 'item 2', start: '2014-04-14'},
    {id: 3, content: 'item 3', start: '2014-04-18'},
    {id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19'},
    {id: 5, content: 'item 5', start: '2014-04-25'},
    {id: 6, content: 'item 6', start: '2014-04-27', type: 'point'}
  ]);

  // Configuration for the Timeline
  var options = {};

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
<script>
$(document).ready(function() {

  // DOM element where the Timeline will be attached
  var container = document.getElementById('timeline');

  // Create a DataSet (allows two way data-binding)
  var items = new vis.DataSet([
    {id: 1, content: 'item 1', start: '2014-04-20'},
    {id: 2, content: 'item 2', start: '2014-04-14'},
    {id: 3, content: 'item 3', start: '2014-04-18'},
    {id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19'},
    {id: 5, content: 'item 5', start: '2014-04-25'},
    {id: 6, content: 'item 6', start: '2014-04-27', type: 'point'}
  ]);

  // Configuration for the Timeline
  var options = {};

  // Create a Timeline
  var timeline = new vis.Timeline(container, items, options);

});
</script>

<!-- would be nice to get time ranges from another service, 
     but all I can find are having an API with a key, makes them server side only -->
<!-- TODO use timespans from searching the DANS DCCD archives -->
