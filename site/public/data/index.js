"use strict";

// Globals
var circles = [];
var headings = [];
var y = 50;
var r = 40;
var colours;
var text;
var data;

// Move all nodes back to start pos
function reset_all_nodes() {
  for (let i = 0; i < 5; i ++) {
    document.getElementById("circle" + i).setAttribute("cy", y);
    document.getElementById("heading" + i).setAttribute("dy", y + r + 20);
  };
};

// Handle response
async function fetch_categories_data(){
  await fetch( "/data/?categories", {
    method: 'GET',
    headers: {'Content-Type': 'text/plain'}
  }).then(function(response) {
    return response.text();
  }).then(function(response) {
    let response_dict = JSON.parse(response);
    text = response_dict.map(r => r.name);
    colours = response_dict.map(r => r.colour);
    data = response_dict.map(r => r.sources);
  });
  return;
}

function data_have_click(source_id, index) {
  var data_have = JSON.parse(data[index][source_id]);
  document.getElementById("data-headline").innerHTML = data_have.headline;
  document.getElementById("data-published").innerHTML = '<b>Published:</b> ' + data_have.published;
  document.getElementById("data-accessed").innerHTML = '<b>Accessed:</b> ' + data_have.accessed;
  document.getElementById("data-snippet").innerHTML = '<b>Description:</b> ' + data_have.snippet;
  document.getElementById("data-author").innerHTML = data_have.author;
  document.getElementById("data-author").setAttribute("href", data_have.reference_link);
  return;
}

function wrap_text(index) {
  var text = "";
  if (data[index].length == 0) {
    text = "<p>We have no data for this category.</p>"
  } else {
    text = data[index].map(d => '<p id="data_have_' + JSON.parse(d).source_id + '" onclick = "data_have_click('
      + JSON.parse(d).source_id + ', ' + index + ');" ><b>'
      + JSON.parse(d).headline + '</b></p>').toString().replace(/>,</g, "><");
  }
  return text;
}

// ON PAGE LOAD
addEventListener('load', start);
async function start() {

  // Local vars
  var svgContainer = d3.select("#data-rep-vis");
  var x1 = document.getElementById("data-rep-vis").clientWidth * 0.2;
  var x_space = document.getElementById("data-rep-vis").clientWidth * 0.16;

  await fetch_categories_data();

  // Create pop up shapes
  var tx = x1;
  var ty = y + r + 30;
  var data_have = wrap_text(0);
  document.getElementById("data-have-dropdowns").style.backgroundColor = colours[0];
  document.getElementById("data-have-dropdowns").innerHTML = data_have;

  // Create topic nodes and titles
  for (let i = 0; i < 5; i++) {
    var circle = svgContainer.append("circle")
                .attr("cx", x1 + (x_space * i))
                .attr("cy", y)
                .attr("r", r)
                .attr("id", "circle" + i)
                .style("fill", colours[i]);

    var heading = svgContainer.append("text")
                  .attr("dx", (x1 * 0.75) + (x_space * i))
                  .attr("dy", y + r + 20)
                  .attr("id", "heading" + i)
                  .text(text[i]);

    circle.on("click", function() {
      reset_all_nodes();
      data_have = wrap_text(i);
      document.getElementById("data-have-dropdowns").innerHTML = data_have;
      document.getElementById("data-have-dropdowns").style.backgroundColor = colours[i];
      document.getElementById("circle" + i).setAttribute("cy", y + 80);
      document.getElementById("heading" + i).setAttribute("dy", y + r + 100);
    });

    circles.push(circle);
    headings.push(heading);
  };
};
