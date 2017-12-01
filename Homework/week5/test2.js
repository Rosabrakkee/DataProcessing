/**
* Rosa Brakkeee
* DataProc Week 5
*
* This progam creates a plot of the popultation growth from 1960 t0 2015 for some war countries
* and some non war countries
*
* Plot was inspired by: http://bl.ocks.org/wdickerson/64535aff478e8a9fd9d9facccfef8929
**/


// toggle between hiding and showing the dropdown content
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
};

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

  var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
      }
    }
  }
};


window.onload = function() {

  // Define margins, dimensions, and some line colors
  var margin = {top: 100,
                right: 100,
                bottom: 100,
                left: 100};
  var width = 1200 - margin.left - margin.right;
  var height = 450 - margin.top - margin.bottom;


  // set svg for graph
  var svg = d3.select("body")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
  .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define the scales and tell D3 how to draw the line
  const x = d3.scaleLinear()
    .domain([1960, 2015])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, 92667685])
    .range([height, 0]).nice();

  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.population));

  const chart = d3.select('svg').append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // create tooltip and line
  const tooltip = d3.select('#tooltip');
  const tooltipLine = chart.append('line');

  // Add the axes and a title
  const xAxis = d3.axisBottom(x).tickFormat(d3.format('.4'));
  const yAxis = d3.axisLeft(y).tickFormat(d3.format('.2s'));
  chart.append('g').call(yAxis);
  chart.append('g').attr('transform', 'translate(0,' + height + ')').call(xAxis);
  chart.append('text')
    .style("font-size", "25px")
    .html('Population growth from 1960 to 2015')
    .attr('x', width / 2 - margin.left - margin.right);


  // Load the data and draw a chart
  var country, tipBox;

  d3.json("war.json", function(error, d) {
      if (error) alert("problem with loading data");
      country = d
      setGraph(country)
  });

  //On click, update with new data
	d3.selectAll(".m")
		.on("click", function() {

      d3.selectAll("path#graph").remove()
      d3.selectAll("text#graphText").remove()

			var selection = this.getAttribute("value");

			var str;
			if(selection == "no"){
				str = "no_war.json";
			}else if(selection == "war"){
				str = "war.json";
      }

  d3.json(str, function(error, d){
    if (error) alert("problem with loading data");
    country = d;
    setGraph(country)
    })
  });


// function for to update graph
function setGraph(country){
  chart.selectAll()
    .data(country).enter()
    .append('path')
    .attr('id', 'graph')
    .attr('fill', 'none')
    .attr('stroke', d => d.color)
    .attr('stroke-width', 2)
    .datum(d => d.history)
    .attr('d', line);

  chart.selectAll()
    .data(country).enter()
    .append('text')
    .attr('id', 'graphText')
    .html(d => d.name)
    .attr('fill', d => d.color)
    .attr('alignment-baseline', 'middle')
    .attr('x', width)
    .attr('dx', '.5em')
    .attr('y', d => y(d.currentPopulation));

  tipBox = chart.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 0)
    .on('mousemove', drawTooltip)
    .on('mouseout', removeTooltip)


  function removeTooltip() {
    if (tooltip) tooltip.style('display', 'none');
    if (tooltipLine) tooltipLine.attr('stroke', 'none');
  };

  function drawTooltip() {
    const year = Math.floor((x.invert(d3.mouse(tipBox.node())[0]) + 2.5) / 5) * 5;

    country.sort((a, b) => {
      return b.history.find(h => h.year == year).population - a.history.find(h => h.year == year).population;
    })

    tooltipLine.attr('stroke', 'black')
      .attr('x1', x(year))
      .attr('x2', x(year))
      .attr('y1', 0)
      .attr('y2', height);


    tooltip.html(year)
      .style('display', 'block')
      .selectAll()
      .data(country).enter()
      .append('div')
      .style('color', d => d.color)
      .html(d => d.name + ': ' + d.history.find(h => h.year == year).population);
    }
  };
};



  // setGraph();
