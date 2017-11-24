/**
* Rosa Brakkee
* DataProc Week 4
*
* Creates a svg legend with colors and there hex name
*
**/
function makeLegend() {

  // load existing svg element
  d3.xml("test.svg", "image/svg+xml", function(error, xml) {
      if (error) throw error;
      document.body.appendChild(xml.documentElement);

      // create all variables
      var colors = ["#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"];
      var kleurRect = ["#kleur1", "#kleur2", "#kleur3", "#kleur4", "#kleur5", "#kleur6"];
      var tekstRect = ["#tekst1", "#tekst2", "#tekst3", "#tekst4", "#tekst5", "#tekst6"];

      // select the svg element
      var svg = d3.select("svg")

      // create legend elements
      var legend = svg.selectAll(".legend")
          .data(colors)
        .enter().append("g")
          .attr("class", "legend")

        // create rect with color
        legend.append("rect")
          .attr("id", function(d, i){ return kleurRect[i]; })
          .attr("x", 13)
          .attr("y", function(d, i){ return 40 * i})
          .attr("width", 21)
          .attr("height", 29)
          .attr("class", "st1")
          .style("fill", function(d, i){ return colors[i]; })

        // create rect for text
        legend.append("rect")
          .attr("id", function(d, i){ return tekstRect[i]; })
          .attr("x", 46.5)
          .attr("y", function(d, i){ return 40 * i})
          .attr("width", 119.1)
          .attr("height", 29)
          .attr("class", "st2")

        // create text in the rect
        legend.append("text")
          .attr("x", 46.5 + 5)
          .attr("y", function(d, i){ return 20 + 40 * i})
          .text(function(d, i){ return colors[i]; })
          .style("fill", function(d, i){ return colors[i]; })
    });
};

window.onload = function() {
  makeLegend();
}
