"use strict";

var all_data;
var svg;
var width;
var height;
var dataReady;
var date;
var option;
var interval;

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

function on_timer_click() {
  draw_graph();
  var date_str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
  d3.select("#date")
    .text("   Date: " + date_str)

  date.setDate(date.getDate()+ 1);
  date_str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
  dataReady = dataReady.map(function(c) {
    const country = all_data.filter(d => d.country.toLowerCase() === c.properties.name.toLowerCase());
    try{
      c.total = country[0].data.filter(d => d.date_of_event === date_str)[0][option];
    } catch (e) {c.total = 0;}
    return c;
  });

  if (date.getTime() == (new Date("05/31/2020")).getTime()) {
    date = new Date("02/01/2020");
  }
  return;
}

// ON PAGE LOAD
// Source: https://www.d3-graph-gallery.com/
addEventListener('load', start);
async function start() {

  // Create dropdown
  d3.select("#story_container")
    .append("select")
    .attr("id", "select_id");

  var options = ["cases", "deaths", "tests"];
  d3.select("#select_id")
     .selectAll('myOptions')
     .data(options)
     .enter()
     .append('option')
     .text(function (d) { return d; }) // text showed in the menu
     .attr("value", function (d) { return d; })
  option = "cases";

  d3.select("#select_id").on("change", function(d) {
    clearInterval(interval);
    option = d3.select(this).property("value");
    date = new Date("02/01/2020");
    interval = setInterval(on_timer_click, 1000);
  })

  // Create text
  d3.select("#story_container")
    .append("text")
    .attr("id", "date")
    .text("DATE  ")

  // Create info
  d3.select("#story_container")
    .append("text")
    .attr("id", "country_info")
    .text(". HOVER OVER COUNTRY FOR INFO")

  // Load Data
  await fetch_data();
  var country_codes = await d3.json('/stories/world_geo.json');
  date = new Date("02/01/2020") // 1st Feb 2020

  var date_str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
  dataReady = country_codes.features.map(function(c) {
    const country = all_data.filter(d => d.country.toLowerCase() === c.properties.name.toLowerCase());
    try{
      c.total = country[0].data.filter(d => d.date_of_event === date_str)[0][option];
    } catch (e) {c.total = 0;}
    return c;
  });

  // Create graph
  width = +(0.7 * window.innerWidth);
  height = +(0.7 * window.innerHeight);
  interval = setInterval(on_timer_click, 1000);
}

function draw_graph() {
  d3.selectAll("svg").remove();

  // append the svg object to the body of the page
  svg = d3.select("#story_container")
    .append("svg")
      .attr("width", 1.25 * width)
      .attr("height", 1.25 * height);

  // Map and projection
  var path = d3.geoPath();
  var projection = d3.geoMercator()
    .scale(150)
    .center([-(width / 20), (height / 30)])
    .translate([width / 2, height / 2]);

  // Data and color scale
  var data = d3.map();
  var colorScale = d3.scaleThreshold()
    .domain([1, 10, 100, 1000, 30000, 100000])
    .range(d3.schemeBlues[7]);

  let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black");
    d3.select("#country_info")
      .text(". " + d.properties.name + ": " + d.total)
  }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent");
    d3.select("#country_info")
      .text(". HOVER OVER COUNTRY FOR INFO")
  }

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(dataReady)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
}
