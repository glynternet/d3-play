var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = 3200;
var height = 2258 - margin.top - margin.bottom;
const lines = 180;
const skew = 60;
const period = (width - (margin.left + margin.right)) / (lines - 1 + skew);
const secondPointDistance = 100;

var x = function(i, skewCoefficient) {
	return (i + skew * skewCoefficient) * period;
};

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function newLineData(i) {
	phase = Math.PI / 2 * i / (lines - 1); //Needs to be (lines - 1) here so that the last line ends up vertically straight
	x1 = x(i, Math.sin(phase));
	x2 = x(i, 1 - Math.cos(phase));
	return {"line":[
		{ "x": x1,   "y": 0},
		{ "x": x1,   "y": secondPointDistance},
		{ "x": x2,   "y": height-secondPointDistance},
		{ "x":  x2,  "y": height}
	]};
}

//The data for our line
var data = [];

for (var i = 0; i < lines; i++) {
	data.push(newLineData(i));
}

//This is the accessor function we talked about above
var lineFunction = d3.line()
	.x(function(d) { return d.x; })
	.y(function(d) { return d.y; })
	.curve(d3.curveCatmullRom.alpha(1));

var colourScale = d3.scaleLinear()
	.domain([0, lines-1])
	.range([
		d3.hsl(25, 1, 0.6),
		d3.hsl(358, 1, 0.65)
	 ]);

// DATA JOIN
// Join new data with old elements, if any.
var path = svg.selectAll("path")
	.data(data);

// UPDATE
// Update old elements as needed.
path.attr("class", "update");

// ENTER
// Create new elements as needed.
//
// ENTER + UPDATE
// After merging the entered elements with the update selection,
// apply operations to both.
path.enter().append("path")
		.attr("class", "enter")
		.attr("d", function(d, i){ 
			return lineFunction(d.line);
			 })
        .attr("stroke", function(d,i){
        	return colourScale(i);
        })
        .attr("stroke-width", 8)
        .attr("fill", "none")
	.merge(path);

// EXIT
// Remove old elements as needed.
path.exit().remove();