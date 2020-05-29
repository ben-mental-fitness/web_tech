"use strict";

// Globals
var circles = [];
var headings = [];
var y = 50;
var r = 40;

// Move all nodes back to start pos
function reset_all_nodes() {
  for (let i = 0; i < 5; i ++) {
    document.getElementById("circle" + i).setAttribute("cy", y);
    document.getElementById("heading" + i).setAttribute("dy", y + r + 20);
  };
};

// ON PAGE LOAD
window.onload = function() {

  // Local vars
  var svgContainer = d3.select("#data-rep-vis");
  var x1 = document.getElementById("data-rep-vis").clientWidth * 0.2;
  var x_space = document.getElementById("data-rep-vis").clientWidth * 0.16;
  var colours = ["#70C045", "#FF0000", "#ED7D31", "#00FFFF", "#9F4A9D"];
  var text = ["Country Bios", "Cases Data", "Response Strategy", "Good News", "Wildcards"];

  // Create pop up shapes
  var tx = x1;
  var ty = y + r + 30;

  var info_rectangle_have = svgContainer.append("rect")
                              .attr("x", x1 * 0.3)
                              .attr("y", ty + 110)
                              .attr("width", document.getElementById("data-rep-vis").clientWidth * 0.4)
                              .attr("height", 200)
                              .attr("fill", colours[0])
                              .attr("id", "rect_have");

  var info_textbox_have = svgContainer.append("text")
                              .attr("x", x1 * 0.4)
                              .attr("y", ty + 125)
                              .attr("height", 200)
                              .attr("id", "text_have")
  document.getElementById("text_have").innerHTML = "HAVE";

  var info_rectangle_need = svgContainer.append("rect")
                              .attr("x", (x1 * 0.3) + (document.getElementById("data-rep-vis").clientWidth * 0.5))
                              .attr("y", ty + 110)
                              .attr("width", document.getElementById("data-rep-vis").clientWidth * 0.4)
                              .attr("height", 200)
                              .attr("fill", colours[0])
                              .attr("id", "rect_need");

  var info_textbox_need = svgContainer.append("text")
                              .attr("x", (x1 * 0.4) + (document.getElementById("data-rep-vis").clientWidth * 0.5))
                              .attr("y", ty + 125)
                              .attr("height", 200)
                              .attr("id", "text_need")
  document.getElementById("text_need").innerHTML = "NEED";

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
      document.getElementById("rect_have").setAttribute("fill", colours[i]);
      document.getElementById("rect_need").setAttribute("fill", colours[i]);
      reset_all_nodes();

      document.getElementById("circle" + i).setAttribute("cy", y + 80);
      document.getElementById("heading" + i).setAttribute("dy", y + r + 100);
    });

    circles.push(circle);
    headings.push(heading);
  };
};
