/**
* Rosa Brakkeee
* DataProc Week 6
*
* This progam creates a map of NL that's linked to a barchart.
*
* Barchart was inspired by: http://bl.ocks.org/Jverma/887877fc5c2c2d99be10
**/
function makeMap(data1, data2) {

    // set margins and canvas size
    var margin = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 50
    };
    var width = 1200 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    // data pre-processing
    data1.forEach(function(d) {
        d.provincie = d.provincie;
        d.populatie = d.populatie;
    });

    // colors for map
    var color = d3.scale.linear()
        .domain([380726, 3600011])
        .range([d3.rgb('#ffcc80'), d3.rgb('#e68a00')]);

    // load data and check error
    d3.xml("Data/nlMap.svg", "image/svg+xml", function(error, xml) {
        if (error) throw error;
        document.body.appendChild(xml.documentElement);

        // id's for selecting the provincie
        var dict = {
            "NL-GR": "Groningen",
            "NL-NH": "Noord-Holland",
            "NL-DR": "Drenthe",
            "NL-FL": "Flevoland",
            "NL-FR": "Friesland",
            "NL-GE": "Gelderland",
            "NL-LI": "Limburg",
            "NL-NB": "Noord-Brabant",
            "NL-OV": "Overijssel",
            "NL-UT": "Utrecht",
            "NL-ZE": "Zeeland",
            "NL-ZH": "Zuid-Holland"
        }

        var svg = d3.select("svg")

        // fill the map and create hover function
        svgContainer = svg.selectAll(".land")
            .style("fill", function() {
                var prov = dict[this.id]
                for (i = 0; i < data1.length; i++) {
                    if (prov == data1[i].provincie) {
                        return color(data1[i].populatie);
                    }
                }
            })
            .on("mouseover", hoverOn)
            .on("mouseout", hoverOut)

        // On hover, show text info and select bar in barchart
        function hoverOn() {
            var prov = dict[this.id]
            svg.append("text")
                .attr("id", "name")
                .attr("x", (margin.right))
                .attr("y", (height / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "25px")
                .text(prov);
            svg.append("text")
                .attr("id", "populatie")
                .attr("x", (margin.right))
                .attr("y", (height / 1.8))
                .attr("text-anchor", "middle")
                .style("font-size", "20px")
                .text(function() {
                    for (i = 0; i < data1.length; i++) {
                        if (data1[i].provincie == prov) {
                            return ("populatie: " + data1[i].populatie);
                        }
                    }
                })
            d3.select(this).style("opacity", 0.2);
            d3.select("#" + dict[this.id]).style("fill", "blue")
        }

        // On hover out, remove all info
        function hoverOut() {
            var prov = dict[this.id]
            d3.select("#name").remove()
            d3.select("#populatie").remove()
            d3.select(this).style("opacity", 1);
            d3.select("#" + dict[this.id]).style("fill", "lightsteelblue")
        }
        makeGraph(data2);
    });
};
