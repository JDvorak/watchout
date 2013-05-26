var svg = d3.select("body").append("svg")

var defs = svg.append("defs")
var blurFilter = defs.append("filter")
                .attr("id", "blurFilter")
                .append("feGaussianBlur")
                  .attr("stdDeviation", 1.5)


var playerData = [{x: 150, y:60}]
var playerRadius = 10

function update(data) {
  var n = data.length;
  var enemies = svg.selectAll("ellipse").data(data);
  var player = svg.selectAll("circle").data(playerData);
  player.enter().append("circle");

  player.call(drag).style("filter", "url(#blurFilter)")
        .transition()
          .duration(500)
          .attr("r", playerRadius)
          .attr("cx", function(d) {return d.x})
          .attr("cy", function(d) {return d.y})
          .style("fill", "white")


  player.exit().remove();

  enemies.enter().append("ellipse").style("filter", "url(#blurFilter)");

  enemies
     .attr("transform", "rotate(-45 -45 -45)")
         .transition()
          .delay(function(d, i) {return i * 150})
          .duration(1000)
          .style("opacity", .1)
          .attr("rx", function(d) {return d.size})
          .attr("ry", function(d) {return d.size})
          .ease("bounce")
         .transition()
          .duration(500)
          .style("fill", "red")
          .style("opacity", function(d) {return d.size/20})
        .transition()
          .duration(function(d,i) {return (i / n * 3000) + 2000})
       .attr("transform", "rotate(45 45 45)")
          .ease("sin")
          .attr("cy", function(d) {return d.y;})
          .attr("cx", function(d) {return d.x;})
        .transition()
          .duration(500)
          .style("fill", "green")
          .style("opacity", 0)
          .ease("bounce")

  enemies.exit().remove();
}

var drag = d3.behavior.drag()
             .origin(Object)
             .on("drag", function (d) {
                d3.select(this)
                   .attr("opacity", 1)
                   .attr("r", playerRadius + (playerRadius/2))
                   .attr("cx", d.x = d3.event.x)
                   .attr("cy", d.y = d3.event.y)
                  })
              .on("dragend", function(d) {
                d3.select(this)
                   .transition()
                     .duration(500)
                     .ease("cubic")
                     .attr("opacity", .3)
                     .attr("r", playerRadius)
              })



var makeEnemies = function(){
  var enemies = [],
      n = 300;
  while (n--) {
    randX = Math.floor(Math.random() * 900);
    randY = Math.floor(Math.random() * 900);
    randSize = Math.floor(Math.random() * 15) + 5;
    enemies.push({x: randX, y: randY, size: randSize});
  }
  update(enemies, playerData);
  setTimeout(makeEnemies, 21000)
};

makeEnemies();
