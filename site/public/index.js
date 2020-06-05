"use strict";

var  width = +(0.9 * window.innerWidth);
var height = +(0.75 * window.innerHeight);
var width_fraction = width / 2;
var height_fraction = height / 2;
var sf = Math.round(width / 200);

//Shrinking scripts
var hov_ani = {};
var link;
var node;
window.addEventListener('click', stop_shrinking);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width_fraction, height_fraction));

function ticked() {
  link
      .attr("x1", function(d) { return ((1-sf) * width_fraction) + (sf * d.source.x); })
      .attr("y1", function(d) { return ((1-sf) * height_fraction) + (sf * d.source.y); })
      .attr("x2", function(d) { return ((1-sf) * width_fraction) + (sf * d.target.x); })
      .attr("y2", function(d) { return ((1-sf) * height_fraction) + (sf * d.target.y); });

  node
      .attr("transform", function(d) {
        return "translate(" + (((1-sf) * width_fraction) + (sf * d.x)) + "," + (((1-sf) * height_fraction) + (sf * d.y)) + ")";
      })
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = (((1-sf) * width_fraction) + (sf * d.x));
  d.fy = (((1-sf) * height_fraction) + (sf * d.y));
}

function dragged(d) {
  d.fx = 3;
  d.fy = 3;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function hoverclick(d) {
  hov_ani[d.target.id] = {
                    "target": d.target,
                    "radius": d.target.getAttribute("r")
                  }

  hov_ani[d.target.id]["interval"] = setInterval(function() {

    var r_orig = d.target.getAttribute("r");
    if (r_orig > 5) {
      d.target.setAttribute("r", r_orig - 3);
    } else {
      stop_shrinking();
      console.log("/stories/?" + d.target.id);
      window.location.href = '/stories/?' + d.target.id;
    };

  }, 100);
}

function stop_shrinking() {
  for (var index in hov_ani) {
    clearInterval(hov_ani[index]["interval"]);

    if (hov_ani[index]["target"] != 0) {
      hov_ani[index]["target"].setAttribute("r", hov_ani[index]["radius"]);
    };
  };
}

// ON PAGE LOAD
addEventListener('load', start);
function start() {

  var svg = d3.select("svg");

  var graph = {
      "nodes": [
        {"id": "CoVision", "group": 32},
        {"id": "One Earth", "group": 16}, // 7},
        {"id": "The Passage of Time", "group": 16}, //23},
        {"id": "You're the Boss", "group": 16}, //4},
        {"id": "WHO said what?", "group": 16},
        {"id": "WHO did what?", "group": 16}, //20},
        {"id": "Magic Money Tree", "group": 16},
        {"id": "Escape Rooms", "group": 16}, //4},
        {"id": "One People", "group": 16}, //8}
      ],
      "links": [
        {"source": "CoVision", "target": "One Earth", "value": 8}, // 7},
        {"source": "CoVision", "target": "The Passage of Time", "value": 8}, // 23},
        {"source": "CoVision", "target": "You're the Boss", "value": 8}, // 4},
        {"source": "CoVision", "target": "WHO said what?", "value": 8}, // 16},
        {"source": "CoVision", "target": "WHO did what?", "value": 8}, // 20},
        {"source": "CoVision", "target": "Magic Money Tree", "value": 8}, // 16},
        {"source": "CoVision", "target": "Escape Rooms", "value": 8}, // 4},
        {"source": "CoVision", "target": "One People", "value": 8}
      ]
    };

  link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return d.value * sf / 16; })
      .attr("stroke", "#00FFFF");

  node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter().append("g")

  var circles = node.append("circle")
      .attr("r", function(d) {return d.group * sf / 2; })
      .attr("fill", "#FFFFFF")
      .attr("id", function(d) {return d.id.toLowerCase().replace(/[^\w\s]/g, "").replace(/ /g, "_");})
      .attr("stroke", "#00FFFF")
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  for (var i = 1; i < circles["_groups"][0].length; i ++) {
     circles["_groups"][0][i].onmouseover = hoverclick;
  };

  var labels = node.append("text")
      .text(function(d) {
        return d.id;
      })
      .attr('fill', "#7200FF")
      .attr('font-family', "Tahoma, Geneva, sans-serif")
      .attr('x', function(d) {return -(d.group * (sf / 2 - 1)); })
      .attr('y', 0);

  labels["_groups"][0][0].innerHTML = "";

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

}
