/**
* Rosa Brakkeee
* DataProc Week 2
*
* Creates a barchart using d3 and svg.
*
* Code was inspired by: https://bl.ocks.org/syntagmatic/ba23d525f8986cb0ebf30a5dd30c9dd2
**/
function makePlot() {

  // set margins and canvas size
  var margin = { top: 100, right: 100, bottom: 100, left: 50 };
  var width = 1200 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  // create svg element on page
  var svg = d3.select("body")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
  .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // define the 1st line
  var valueline = d3.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });

  // define the 2nd line
  var valueline2 = d3.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });

  // scale the x-axis, domain is 0 - 100 %
  var xscale = d3.scaleLinear()
    .domain([0,100])
    .range([0,width]);

  // scale the y-axis
  var yscale = d3.scaleLinear()
    .range([height,0]);

  // the bubble size
  var radius = d3.scaleSqrt()
    .range([8,30]);

  // scale ticks on x-axis
  var xAxis = d3.axisBottom()
    .tickSize(-height)
    .scale(xscale);

  // scale ticks on y-axis
  var yAxis = d3.axisLeft()
    .tickSize(-width)
    .scale(yscale)

  // colors for bubbles
  var color = d3.scaleCategory20();

  // var data;
  // load data
  d3.json("data.json", function(error, data) {
    console.log("test")
    // console.log(data)
    // console.log(json)
    // data = data
    // data pre-processing
    data.forEach(function(d) {
      d.y = +d["value"];
      d.x = +d["year"];
      d.r = +d["state"];
      // console.log(d.y)
    });


    // scale data for y-axis
    yscale.domain(d3.extent(data, function(d) {
      // console.log(d["value"])
      return d.y;
    })).nice();

    // scale data for bubble size
    radius.domain(d3.extent(data, function(d) {
      return d.r;
    })).nice();

    // create title above plot
    svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "25px")
          .text("CO" + "\u2082" + " -emissions vs. renwewable energy per country in 2015");

    // set xAxis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .call(xAxis);

    // set yAxis
    svg.append("g")
      .attr("transform", "translate(0,0)")
      .attr("class", "y axis")
      .call(yAxis);


    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "blue")
        .attr("d", valueline);

    // Add the valueline2 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline2);

    // create bubble svg element, find position of data point
    var group = svg.selectAll("g.bubble")
      .data(data)
      .enter().append("g")
      .attr("class", "bubble")
      .attr("transform", function(d) {
        return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")"
      });

    // place filled circle for every data point
    group.append("circle")
      .attr("r", function(d) { return radius(d.r);  })
      .style("fill", function(d) {
        return color(d["state"]);
      })

    // set text with bubble (visible on hover)
    group.append("text")
      .attr("x", function(d) { return radius(d.r); })
      .attr("alignment-baseline", "middle")
      .text(function(d) {
        return d["state"];
      });

    // set text on y-axis
    svg.append("text")
      .attr("x", 6)
      .attr("y", -2)
      .attr("class", "label")
      .text("CO" + "\u2082" + "-emissions (GT)");

    // set text on x-axis
    svg.append("text")
      .attr("x", width-2)
      .attr("y", height-6)
      .attr("text-anchor", "end")
      .attr("class", "label")
      .text("% renewable energy of total consumption");

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
        d3.selectAll(".bubble")
          .style("opacity", 0.1)
          .filter(function(d) { return d["state"] == type; })
          .style("opacity", 1);
      })

      // show bubble and legend clear when no hovering
      .on("mouseout", function(type) {
        d3.selectAll(".legend")
          .style("opacity", 1);
        d3.selectAll(".bubble")
          .style("opacity", 1);
          });
      });
};

window.onload = function() {
  makePlot();
}
