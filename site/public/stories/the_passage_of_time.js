"use strict";

var all_data;
var svg;
var width;
var height;
var x_val;
var y_val;
var country_selected;

// Handle response
async function fetch_data(){
  await fetch( "/stories/?s=the_passage_of_time&data=all", {
    method: 'GET',
    headers: {'Content-Type': 'application/javascript'}
  }).then(function(response) {
    return response.text();
  }).then(function(response) {
    all_data = JSON.parse(response);
  });
  return;
}

function button_click() {
  let x_max = prompt("X-Max", "0");
  let y_max = prompt("Y-Max", "0");
  draw_graph(x_val, y_val, x_max, y_max);
  return;
}

// ON PAGE LOAD
// Source: https://www.d3-graph-gallery.com/
addEventListener('load', start);
async function start() {

  // Create x-dropdown
  d3.select("#story_container")
    .append("select")
    .attr("id", "select_x");

  var options = ["cases", "deaths", "tests"];
  d3.select("#select_x")
     .selectAll('myOptions')
     .data(options)
     .enter()
     .append('option')
     .text(function (d) { return d; }) // text showed in the menu
     .attr("value", function (d) { return d; })
  x_val = "cases";

  d3.select("#select_x").on("change", function(d) {
    x_val = d3.select(this).property("value");
    draw_graph(x_val, y_val, 0, 0);
  })

  // Create y-dropdown
  d3.select("#story_container")
    .append("select")
    .attr("id", "select_y");

  d3.select("#select_y")
     .selectAll('myOptions')
     .data(options)
     .enter()
     .append('option')
     .text(function (d) { return d; }) // text showed in the menu
     .attr("value", function (d) { return d; })
  y_val = "cases";

  d3.select("#select_y").on("change", function(d) {
    y_val = d3.select(this).property("value");
    draw_graph(x_val, y_val, 0, 0);
  })

  // Load Data
  await fetch_data();

  var button = document.createElement('button');
  button.class = "story_button";
  button.addEventListener('click', button_click);
  button.innerHTML = "Change Max Axis Values";
  document.getElementById("story_container").appendChild(button);

  // Create graph
  // set the dimensions and margins of the graph
  width = +(0.7 * window.innerWidth);
  height = +(0.7 * window.innerHeight);
  draw_graph("cases", "deaths", 0, 0);
}

function draw_graph(x_name, y_name, x_max_user, y_max_user) {
  d3.selectAll("svg").remove();

  // append the svg object to the body of the page
  svg = d3.select("#story_container")
    .append("svg")
      .attr("width", 1.25 * width)
      .attr("height", 1.25 * height)
    .append("g")
      .attr("transform",
            "translate(" + (width / 8) + "," + (height / 7) + ")");

  // List of countries
  var allGroup = all_data.map(d => d.country);

  // Reformat the data: we need an array of arrays of {x, y} tuples
  var dataReady = all_data.map( function(c) {
    return {
      name: c.country,
      values: c.data.map(function(d) {
        return {x: d[x_name], y: d[y_name]};
      })
    };
  });

  // Get max x and y values
  var max_x = x_max_user;
  if (max_x == 0) {
    max_x = dataReady.reduce(function (acc, d) {
      var max = d.values.reduce((acc, c) => c.x > acc ? c.x : acc ,0);
      if (max > acc) return max;
      return acc;
    }, 0);
  };
  var max_y = y_max_user;
  if (max_y == 0) {
    max_y = dataReady.reduce(function (acc, d) {
      var max = d.values.reduce((acc, c) => c.y > acc ? c.y : acc ,0);
      if (max > acc) return max;
      return acc;
    }, 0);
  };

  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, max_x])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain( [0, max_y])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add the lines
  var line = d3.line()
    .x(function(d) { return x(+d.x) })
    .y(function(d) { return y(+d.y) })
  svg.selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
      .attr("d", function(d){ return line(d.values) } )
      .attr("stroke", function(d){ return myColor(d.name) })
      .style("stroke-width", 4)
      .style("fill", "none")

  // Add the points
  svg
    // First we need to enter in a group
    .selectAll("myDots")
    .data(dataReady)
    .enter()
      .append('g')
      .style("fill", function(d){ return myColor(d.name) })
    // Second we need to enter in the 'values' part of this group
    .selectAll("myPoints")
    .data(function(d){ return d.values })
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.x) } )
      .attr("cy", function(d) { return y(d.y) } )
      .attr("r", 5)
      .attr("stroke", "white")

  // Add a legend at the end of each line
  svg
    .selectAll("myLabels")
    .data(dataReady)
    .enter()
      .append('g')
      .append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
        .attr("transform", function(d) { return "translate(" + x(d.value.x) + "," + y(d.value.y) + ")"; }) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
        .text(function(d) { return d.name; })
        .style("fill", function(d){ return myColor(d.name) })
        .style("font-size", 15)
}
