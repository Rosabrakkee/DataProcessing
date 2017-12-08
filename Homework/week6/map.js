window.onload = function(){
  makeMap();

}

function makeMap() {
    console.log("test")

    // set margins and canvas size
    var margin = { top: 100, right: 100, bottom: 100, left: 50 };
    var width = 1200 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;


  // // set margins and canvas size
  // var margin = { top: 100, right: 100, bottom: 100, left: 50 };
  // var width = 1200 - margin.left - margin.right;
  // var height = 600 - margin.top - margin.bottom;
  //
  // // create svg element on page
  // var svg = d3.select("body")
  //   .append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  // .append("g")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load data and check error
d3.xml("nlMap.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

    var svg = d3.select("svg")

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "25px")
      .text("Provincies NederLand");
    console.log(svg.selectAll(".land"));

  svgContainer = svg.selectAll(".land").style("fill", "orange")
    .on("mouseover", hoverOn)
    .on("mouseout", hoverOut)
    // .on("click", onClickProv);
      // var tooltip = document.querySelector('.map-tooltip');

  function hoverOn() {
    var dict = {"NL-GR":"Groningen", "NL-NH":"Noord-Holland", "NL-DR":"Drenthe"};
    console.log(dict[this.id]);
    var prov = dict[this.id]
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "25px")
      .text(prov)
    d3.select(this).style("fill", "blue")
    var tooltip = d3.select('body').append('div')
          .text("hoi")
        .attr('class', 'hidden tooltip');
    console.log()
    d3.select("#" + dict[this.id]).style("fill", "blue")

    // .style("opacity", 0.5);

    // var mouse = d3.mouse
    //
    // tooltip.classed('hidden', false)
    //     .attr('style', 'left:' + (mouse[0] + 15) +
    //             'px; top:' + (mouse[1] - 35) + 'px')
  }
  function hoverOut() {
      var dict = {"NL-GR":"Groningen", "NL-NH":"Noord-Holland", "NL-DR":"Drenthe"};
    // d3.select(".tooltip").attr("")
    // d3.selectAll(".land")

    d3.select(this).style("fill", "orange")
    d3.select("#" + dict[this.id]).style("fill", "lightsteelblue")
  }

  d3.json("populatie.json", function(error, data) {
    if (error) throw error
    // data pre-processing
    data.forEach(function(d) {
      d.x = d["provincie"]
      d.r = +d["populatie"];
    });



  })





  makeGraph();
  });

}
