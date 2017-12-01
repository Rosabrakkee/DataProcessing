function makePlot() {


// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.open); });

// / colors for legend
var color = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("test.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
      d.open = +d.open;
  });


  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) {
	  return Math.max(d.close, d.open); })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline2);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // create legend svg element
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(2," + i * 14 + ")"; });

  // create text of the legend
  legend.append("rect")
      .attr("x", width)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", color);

  // set text of legend
  legend.append("text")
      .attr("x", width + 16)
      .attr("y", 6)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });

  // legend shows bubble clear on mousehover, bubble shows text on mouse hover
  legend.on("mouseover", function(type) {
      d3.selectAll(".legend")
        .style("opacity", 0.1);
      d3.select(this)
        .style("opacity", 1);
      // d3.selectAll(".line")
      //   .style("opacity", 0.1)
      //   .filter(function(d) { return d["countries"] == type; })
      //   .style("opacity", 1);
    })

    // show bubble and legend clear when no hovering
    .on("mouseout", function(type) {
      d3.selectAll(".legend")
        .style("opacity", 1);
      d3.selectAll(".line")
        .style("opacity", 1);
        });

});

}

window.onload = function() {
  makePlot();
}
