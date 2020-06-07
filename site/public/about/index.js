"use strict";

// Globals
var circles = [];
var headings = [];
var info_triangle;
var info_rectangle;
var colours;
var text;
var info_text;

// var colours; = ["#71BF45", "#0072BB", "#FEF200", "#8DD8F8", "#A1499D"];
// var text; = ["Country Bios", "Cases Data", "Response Strategy", "Good News", "Wildcards"];
// var info_text = ["This is info about countries.",
//                 "This is about cases",
//                 "This is about Response Strategies",
//                 "This is some good news from the pandemic.",
//                 "This is everything else. I am going to fill space like lorem ipmsum does but not quite since I don't know latin  but what I do know is that the quick brown fox jumps over the lazy dog."];

// Handle response
async function fetch_categories(){
  await fetch( "/about/?categories", {
    method: 'GET',
    headers: {'Content-Type': 'text/plain'}
  }).then(function(response) {
    return response.text();
  }).then(function(response) {
    let response_dict = JSON.parse(response);
    colours = response_dict.map(r => r.colour);
    text = response_dict.map(r => r.name);
    info_text = response_dict.map(r => r.description);
  });
  return;
}

function wrap_text(text, line_length, x_in, y_in) {
  const x = Math.round(x_in);
  let y = Math.round(y_in);
  var text_wrap = "";
  var line_start = 0;
  var line_end = line_length;
  while (line_end < text.length) {
    while (text.charAt(line_end - 1) != " ") line_end = line_end - 1;
    text_wrap = text_wrap + "<tspan x='" + x + "' y='" + y + "'>" + text.substring(line_start, line_end) + "</tspan>";
    y = y + 20;
    line_start = line_end;
    line_end = Math.min(line_end + line_length, text.length);
  }
  text_wrap = text_wrap + "<tspan x='" + x + "' y='" + y + "'>" + text.substring(line_start, line_end) + "</tspan>";
  return text_wrap;
}

// ON PAGE LOAD
addEventListener('load', start);
async function start() {

  // Local vars
  var svgContainer = d3.select("#data-rep-vis");
  let width = Math.round(svgContainer.style('width').slice(0, -2));
  var x1 = width * 0.2;
  var x_space = width * 0.16;
  var line_length = Math.round(width * 0.11);
  var y = 50;
  var r = 40;

  await fetch_categories();

  // Create pop up shapes
  var tx = x1;
  var ty = y + r + 30;
  info_triangle = svgContainer.append("polygon")
                  .attr("points", [[tx, ty],[tx - 15, ty + 30],[tx + 15, ty + 30]])
                  .attr("fill", colours[0])
                  .attr("id", "tri");

  info_rectangle = svgContainer.append("rect")
                              .attr("x", x1 * 0.5)
                              .attr("y", ty + 30)
                              .attr("width", width * 0.8)
                              .attr("height", 150)
                              .attr("fill", colours[0])
                              .attr("id", "rect");

  var text_wrap = wrap_text(info_text[0], line_length, x1 * 0.5 + 5, ty + 55);
  var info_textbox = svgContainer.append("text")
                              .attr("x", x1 * 0.6)
                              .attr("y", ty + 55)
                              .attr("height", 150)
                              .attr("id", "text");
  document.getElementById("text").innerHTML = text_wrap;

  // Create topic nodes and titles
  for (let i = 0; i < 5; i++) {
    var circle = svgContainer.append("circle")
                .attr("cx", x1 + (x_space * i))
                .attr("cy", y)
                .attr("r", r)
                .style("fill", colours[i]);

    var heading = svgContainer.append("text")
                  .attr("dx", (x1 * 0.75) + (x_space * i))
                  .attr("dy", y + r + 20)
                  .text(text[i]);

    circle.on("click", function() {
      text_wrap = wrap_text(info_text[i], line_length, x1 * 0.5 + 5, ty + 55);
      document.getElementById("text").innerHTML = text_wrap;
      document.getElementById("rect").setAttribute("fill", colours[i]);
      document.getElementById("tri").setAttribute("fill", colours[i]);
      tx =  x1 + (x_space * i);
      document.getElementById("tri").setAttribute("points", [[tx, ty],[tx - 15, ty + 30],[tx + 15, ty + 30]]);
    });

    circles.push(circle);
    headings.push(heading);
  };
};
