/**
* Rosa Brakkeee
* DataProc Week 2
*
* This progam creates a ine graph of the inkomen2 emission  per provincie
* for the year 2015.
*
* Barchart was inspired by: http://bl.ocks.org/Jverma/887877fc5c2c2d99be10
**/
function makeGraph() {

  // create canvas sizes
  var padding = {top: 100,
                right: 20,
                bottom: 100,
                left: 40},
      width = 600 - padding.left - padding.right,
      height = 600 - padding.top - padding.bottom;

  // set the ranges of the axis
  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
  var y = d3.scale.linear().range([height, 0]);

  // set the xAxis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")

  // set the yAxis with tickes of 10
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  // create the SVG element to html page
  var svg2 = d3.select("body").append("svg")
      .attr("id", "barchart")
      .attr("width", width + padding.left + padding.right)
      .attr("height", height + padding.top + padding.bottom)
    .append("g")
      .attr("transform",
            "translate(" + padding.left + "," + padding.top + ")");

  // create a tooltip with info for every bar
  var tip = d3.tip()
       .attr("class", "d3-tip")
       .offset([-8, 0])
       .html(function(d) { return Math.round(d.inkomen * 100)/100 + "<strong>k</strong>"});

  //svg for loading the tooltip
  svg2.call(tip)

  // load the data from a JSON file and inkomennvert inkomen2 emission to GT
  d3.json("inkomen.json", function(error, data) {

      data.forEach(function(d) {
          d.provincie = d.provincie;
          d.inkomen = d.inkomen;
      });

  // scale the axis's to the loaded data
  x.domain(data.map(function(d) { return d.provincie; }));
  y.domain([0, d3.max(data, function(d) { return d.inkomen; })]);

  // add title to the graph
  svg2.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (padding.top / 3))
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .text("Inkomen per provincie");

  // add subtitle to the graph
  // svg2.append("text")
  //       .attr("x", (width / 2))
  //       .attr("y", 0)
  //       .attr("text-anchor", "middle")
  //       .style("font-size", "8px")
  //       .text("Source: Netherlands Environmental Assessment Agency");

  // add Xaxis with inkomenuntries rotated
  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-60)" );

  // add Yaxis with a name
  svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Inkomen (k)");

  // Add the bars to the chart and add the mouse hover element
  svg2.selectAll("barchart")
      .data(data)
    .enter().append("rect")
      .attr("id", function(d){return d.provincie})
      .attr("class", "barchart")
      .attr("x", function(d) { return x(d.provincie); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.inkomen); })
      .attr("height", function(d) { return height - y(d.inkomen); })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
});
}
