"use strict";

// ON PAGE LOAD
addEventListener('load', start);
function start() {
  console.log("one earth");
  var element = d3.select("#story_container");
  var text_heading = element.append("text")
    .attr('id', "story_not_found_text")
    .text("Sorry, this page does not exist.");

  var svg = element.append("svg")
    .attr('id', "story_default_img");
}
