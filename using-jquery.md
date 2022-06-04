
<h3>Using jQuery in Github Pages</h3>

<p>
The div below should be 'automatically' filled with text when the page is loaded. 
<div id="text" style="border-style:inset;"></div>
</p>

<!-- Note that the code below was inspired by https://code-maven.com/javascript-on-github-pages -->

<!-- Only JS 
<script>
document.getElementById("text").innerHTML = "Text added by JavaScript code";
</script>
-->

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script>
// checking the version
let hasJQ = typeof jQuery === 'function'; 
console.log('jQuery' + (hasJQ ? ` version ${jQuery.fn.jquery} loaded.` : ' is not loaded.')); 

$().ready(function() {
   $("#text").html("Text added by jQuery code.");
});
</script>

<!-- TODO add 'example' code below -->

<!-- show that we can get data via Ajax calls -->
<p>
Getting information from external services, like Wikipedia, via Ajax. 
<br/>
<input id="btnSubmit" type="submit" class="button" value="Get results"/>
<!-- <a id="btnSubmit" href="#" class="button green">Get results</a> -->
<br/>

<div id="wikiAjax" style="display:none;">
<p>Below the twenty topmost search results for the string 'Ajax' from the English Wikipedia API. </p>
<div id="wikiAjaxList" style="border-style:inset"></div>
</div>
</p>

<!-- Note that the next code was inspired by https://stackoverflow.com/a/44191636 -->
<script>

$().ready(function() {
// do the Ajax call on button click and not on a pageload
$("#btnSubmit").click(function(){
 
     var wikiURL = "https://en.wikipedia.org/w/api.php";
wikiURL += '?' + $.param({
    'action' : 'opensearch',
    'search' : 'Ajax',
    'prop'  : 'revisions',
    'rvprop' : 'content',
    'format' : 'json',
    'limit' : 20
});

$.ajax({
    url: wikiURL,
    dataType: 'jsonp',
    success: function(data) {
        console.log(data);
        $("#wikiAjax").delay("fast").fadeOut();
        $("#wikiAjaxList").html("");

        // old fashioned for loop, note that the indexes are assumed to by synchronised
        for (let index = 0; index < data[1].length; ++index) {
            const title = data[1][index];
            const link = data[3][index];
            $("#wikiAjaxList").append("<div><a href='"+ link  + "'>" + title + "</a></div>");
        }
        // lets delay, to prevent excessive request via this page 
        // and demonstrate jquery effects at the same time
        $("#wikiAjax").delay("fast").fadeIn();
    }
});
});
});
</script>