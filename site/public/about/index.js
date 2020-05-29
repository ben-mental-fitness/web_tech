"use strict";

// Globals
var circles = [];
var headings = [];
var info_triangle;
var info_rectangle;
var info_text = ["This is info about countries.",
                "This is about cases",
                "This is about Response Strategies",
                "This is some good news from the pandemic.",
                "This is everything else. I am going to fill space like lorem ipmsum does but not quite since I don't know latin  but what I do know is that the quick brown fox jumps over the lazy dog."];

// ON PAGE LOAD
window.onload = function() {

  // Local vars
  var svgContainer = d3.select("#data-rep-vis");
  var x1 = document.getElementById("data-rep-vis").clientWidth * 0.2;
  var x_space = document.getElementById("data-rep-vis").clientWidth * 0.16;
  var y = 50;
  var r = 40;
  var colours = ["#70C045", "#FF0000", "#ED7D31", "#00FFFF", "#9F4A9D"];
  var text = ["Country Bios", "Cases Data", "Response Strategy", "Good News", "Wildcards"];

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
                              .attr("width", document.getElementById("data-rep-vis").clientWidth * 0.8)
                              .attr("height", 150)
                              .attr("fill", colours[0])
                              .attr("id", "rect");

  var info_textbox = svgContainer.append("text")
                              .attr("x", x1 * 0.6)
                              .attr("y", ty + 55)
                              .attr("height", 150)
                              .attr("id", "text")
  document.getElementById("text").innerHTML = info_text[0];

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
      document.getElementById("rect").setAttribute("fill", colours[i]);
      document.getElementById("text").innerHTML = info_text[i];
      document.getElementById("tri").setAttribute("fill", colours[i]);
      tx =  x1 + (x_space * i);
      document.getElementById("tri").setAttribute("points", [[tx, ty],[tx - 15, ty + 30],[tx + 15, ty + 30]]);
    });

    circles.push(circle);
    headings.push(heading);
  };
};
