/**
* Rosa Brakkeee
* DataProc Week 2
*
* This progam creates a ine graph of the CO2 emission  per Country
* for the year 2015.
*
* Barchart was inspired by: http://bl.ocks.org/Jverma/887877fc5c2c2d99be10
**/
function makeGraph() {

  // create canvas sizes
  var padding = {top: 50,
                right: 20,
                bottom: 70,
                left: 40},
      width = 600 - padding.left - padding.right,
      height = 300 - padding.top - padding.bottom;

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
  var svg = d3.select("body").append("svg")
      .attr("width", width + padding.left + padding.right)
      .attr("height", height + padding.top + padding.bottom)
    .append("g")
      .attr("transform",
            "translate(" + padding.left + "," + padding.top + ")");

  // create a tooltip with info for every bar
  var tip = d3.tip()
       .attr("class", "d3-tip")
       .offset([-8, 0])
       .html(function(d) { return Math.round(d.CO * 100)/100 + "<strong> GT</strong>"});

  //svg for loading the tooltip
  svg.call(tip)

  // load the data from a JSON file and convert CO2 emission to GT
  d3.json("data.JSON", function(error, data) {

      data.forEach(function(d) {
          d.Country = d.Country;
          d.CO = +(d.CO / 1000000);
      });

  // scale the axis's to the loaded data
  x.domain(data.map(function(d) { return d.Country; }));
  y.domain([0, d3.max(data, function(d) { return d.CO; })]);

  // add title to the graph
  svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (padding.top / 3))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("CO" + "\u2082" + " -emissions (GT) per country in 2015");

  // add subtitle to the graph
  svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "8px")
        .text("Source: Netherlands Environmental Assessment Agency");

  // add Xaxis with countries rotated
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-60)" );

  // add Yaxis with a name
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("CO" + "\u2082" + " -emissions (GT)");

  // Add the bars to the chart and add the mouse hover element
  svg.selectAll("barchart")
      .data(data)
    .enter().append("rect")
      .attr("class", "barchart")
      .attr("x", function(d) { return x(d.Country); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.CO); })
      .attr("height", function(d) { return height - y(d.CO); })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
});
}

window.onload = function() {
  makeGraph();
}
