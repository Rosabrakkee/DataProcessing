/**
* Rosa Brakkeee
* DataProc Week 2
*
* This progam creates a ine graph of the temperature at the De Bilt weather
* stationd from 1 nov 2016 to 1 nov 2017.
**/

window.onload = function () {

  // gets new HTTP request
  var request = new XMLHttpRequest();
  request.onreadystatechange = function (){
	if (this.readyState == 4 && this.status == 200) {

    // gets csv file
		var response = this.responseText;
    drawGraph(response);
	 }
  };

  request.open("GET", "KNMI_2000.txt");
  request.send();

  // creates the linegraph with the response
  function drawGraph(response){

  // gets contents per line
  var array = response.split('\n');

  // creates two array's with javascript dates and average temperatures
  var date = [];
  var temp = [];
  for (var i = 1; i < array.length - 2; i++){

      // splits every line on comma
      var dateTemp = array[i].split(',');

      // adds 0'th element to date array as Javascript date
      var theDay = dateTemp[0].trim();
      var newDate = new Date(theDay.substring(0,4), theDay.substring(4,6) - 1,
      theDay.substring(6,8));
      date.push(newDate);

      // adds 1'st element to temperature array
      temp.push(parseFloat(dateTemp[1]));
  };

  // height, width and padding of graph
  var width = 500;
  var height = 300;
  var start = 100;

  // gets highest temp and lowest temp of the dataset for domain
  var highestTemp = Math.max.apply(Math, temp);
  var lowestTemp = Math.min.apply(Math, temp);
  var domainTemp = [highestTemp, lowestTemp];
  var heightRange = [start, height];

  // gets first and last day of the dataset
  var dayOne = date[0].getTime();
  var dayLast = date[date.length - 1].getTime();
  var domainDate = [dayOne, dayLast];
  var widthRange = [start, width];

  // creates transform fucntion for dates en temperatures
  var dateFunc = createTransform(domainDate, widthRange);
  var tempFunc = createTransform(domainTemp, heightRange);

  // returns transform function to transform datapoint into pixel value
  function createTransform(domain, range){
  // domain is a two-element array of the data bounds [domain_min, domain_max]
  // range is a two-element array of the screen bounds [range_min, range_max]
  // this gives you two equations to solve:
  // range_min = alpha * domain_min + beta
  // range_max = alpha * domain_max + beta
    // a solution would be:

    var domain_min = domain[0];
    var domain_max = domain[1];
    var range_min = range[0];
    var range_max = range[1];

    // formulas to calculate the alpha and the beta
    var alpha = (range_max - range_min) / (domain_max - domain_min);
    var beta = range_max - alpha * domain_max;

    // returns the function for the linear transformation (y = a * x + b)
    return function(x){
      return alpha * x + beta;
    }
  }

  // the stripes size, months, title and font
  var stripes = 10;
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  var title = "Maximum Temperature in De Bild (NL) from " + monthNames[date[0].getMonth()]
  + ", " + date[0].getFullYear() + " to " + monthNames[(date[date.length - 1].getMonth())]
  + ", " + date[date.length - 1].getFullYear();
  var font = "12px Arial";

  // start drawing the graph
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.font = font;
  ctx.fillText(title, start, start / 2);

  // create y-axis with rounded temperatures
  var lowTempRound = (Math.round((lowestTemp - 10) / 10) * 10);
  var startYaxis = tempFunc(lowTempRound);
  var highTempRound = (Math.round((highestTemp + 10)/ 10) * 10);
  var endYaxis = tempFunc(highTempRound);
  var xPosYaxis = start - 10;
  ctx.moveTo(xPosYaxis, startYaxis);
  ctx.lineTo(xPosYaxis, endYaxis);
  var interval = 10;
  var intervalPixelHeight = (startYaxis - endYaxis) / interval;

  // create data on y-axis
  for (i = 0; i < interval + 1; i++){

    // puts stripes on y-axis
    ctx.moveTo(xPosYaxis, startYaxis - (i * intervalPixelHeight));
    ctx.lineTo(xPosYaxis - stripes, startYaxis - (i * intervalPixelHeight));

    // puts average temp on y-axis
    ctx.font = font;
    ctx.fillText(parseInt((lowTempRound) + (i  * interval)), xPosYaxis - 5 * stripes,
    startYaxis - (i * intervalPixelHeight));
  }

  // create x-axis
  ctx.moveTo(start, startYaxis);
  ctx.lineTo(width, startYaxis);
  var intervalPixelWidth = (width - start) / 12;
  var intervalDataDates = 12;
  for (i = 0; i < 12; i++){

    // puts stripes on x-axis
    ctx.moveTo(start + (i * intervalPixelWidth), startYaxis);
    ctx.lineTo(start + (i * intervalPixelWidth), startYaxis + stripes);

    // puts average dates on x-axis
    ctx.font = font;
    ctx.fillText(monthNames[date[i * (31)].getMonth()], start +
    (i * intervalPixelWidth) - 10, height + 5 * stripes);

  }

  //draws the line to connect the datapoints
  ctx.moveTo(dateFunc(date[0]), tempFunc(temp[0]));
  for (i = 0; i < date.length; i++){
      ctx.lineTo(dateFunc(date[i]), tempFunc(temp[i]));
  }
  ctx.stroke();
  };
}
