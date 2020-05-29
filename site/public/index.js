"use strict";

var svg = d3.select("svg"),
    width = +(0.9 * window.screen.width),
    height = +(0.75 * window.screen.height);
var sf = 9;

//Shrinking scripts
var hov_ani;
var rad_ani = [0,0];
document.body.addEventListener('click', stop_shrinking);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

var colors = {
  "4": "#ED7D31",
  "7": "#70C045",
  "8": "#00FFFF",
  "16": "#9F4A9D",
  "20": "#9F4A9D",
  "23": "#FF0000",
  "32": "#FFFFFF"
}

var graph = {
    "nodes": [
      {"id": "CoVision", "group": 32},
      {"id": "One Earth", "group": 7},
      {"id": "The Passage of Time", "group": 23},
      {"id": "You're the Boss", "group": 4},
      {"id": "WHO said what?", "group": 16},
      {"id": "WHO did what?", "group": 20},
      {"id": "Magic Money Tree", "group": 16},
      {"id": "Escape Rooms", "group": 4},
      {"id": "One People", "group": 8}
    ],
    "links": [
      {"source": "CoVision", "target": "One Earth", "value": 7},
      {"source": "CoVision", "target": "The Passage of Time", "value": 23},
      {"source": "CoVision", "target": "You're the Boss", "value": 4},
      {"source": "CoVision", "target": "WHO said what?", "value": 16},
      {"source": "CoVision", "target": "WHO did what?", "value": 20},
      {"source": "CoVision", "target": "Magic Money Tree", "value": 16},
      {"source": "CoVision", "target": "Escape Rooms", "value": 4},
      {"source": "CoVision", "target": "One People", "value": 8},
      {"source": "WHO said what?", "target": "WHO did what?", "value": 16}
    ]
  };


var link = svg.append("g")
    .attr("class", "links")
  .selectAll("line")
  .data(graph.links)
  .enter().append("line")
    .attr("stroke-width", function(d) { return d.value / 2; })
    .attr("stroke", "#00FFFF");

var node = svg.append("g")
    .attr("class", "nodes")
  .selectAll("g")
  .data(graph.nodes)
  .enter().append("g")

var circles = node.append("circle")
    .attr("r", function(d) {return d.group * 4; })
    .attr("fill", function(d) {return colors[d.group];})
    .attr("stroke", "#00FFFF")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

for (var i = 0; i < circles["_groups"][0].length; i ++) {
  circles["_groups"][0][i].onmouseover = hoverclick;
};

var lables = node.append("text")
    .text(function(d) {
      return d.id;
    })
    .attr('x', 6)
    .attr('y', 3);

node.append("title")
    .text(function(d) { return d.id; });

simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(graph.links);

function ticked() {
  link
      .attr("x1", function(d) { return ((1-sf) * width / 2) + (sf * d.source.x); })
      .attr("y1", function(d) { return ((1-sf) * height / 2) + (sf * d.source.y); })
      .attr("x2", function(d) { return ((1-sf) * width / 2) + (sf * d.target.x); })
      .attr("y2", function(d) { return ((1-sf) * height / 2) + (sf * d.target.y); });

  node
      .attr("transform", function(d) {
        return "translate(" + (((1-sf) * width / 2) + (sf * d.x)) + "," + (((1-sf) * height / 2) + (sf * d.y)) + ")";
      })
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = (((1-sf) * width / 2) + (sf * d.x));
  d.fy = (((1-sf) * height / 2) + (sf * d.y));
}

function dragged(d) {
  d.fx = d.event.x;//(((1-sf) * width / 2) + (sf * d.event.x));
  d.fy = d.event.y;//(((1-sf) * height / 2) + (sf * d.event.y));
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function hoverclick(d) {
  rad_ani[0] = d.target;
  rad_ani[1] = d.target.getAttribute("r");

  hov_ani = setInterval(function() {

    var r_orig = d.target.getAttribute("r");
    if (r_orig > 5) {
      d.target.setAttribute("r", r_orig - 3);
    } else {
      clearInterval(hov_ani);
      console.log("Load new page")
      //window.location.href = 'https://www.gapminder.org/about-gapminder/';
    };

  }, 100);
}

function stop_shrinking() {
  clearInterval(hov_ani);
  if (rad_ani[0] != 0) {
    rad_ani[0].setAttribute("r", rad_ani[1]);
  };
}
