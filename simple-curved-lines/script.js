var margin = {top: 20, right: 20, bottom: 20, left: 20},
  width = 2000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const period = 6;
const lines = 100;
const skew = 200;
const secondPointDistance = 100;

function newLineData(i) {
	phase = Math.PI / 2 * i / (lines - 1); //Needs to be (lines - 1) here so that the last line ends up vertically straight
	x1 = (i + skew * Math.sin(phase)) * period;
	x2 = (i + skew * (1 - Math.cos(phase))) * period;
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
	.x(function(d) { 
		return d.x; 
	})
	.y(function(d) { return d.y; });

var colourScale = d3.scaleLinear()
	.domain([0, lines-1])
	.range([
		d3.hsl(35, 1, 0.68),
		d3.hsl(355, 1, 0.3)
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
        	console.log(i);
        	return colourScale(i);
        })
        .attr("stroke-width", 5)
        .attr("fill", "none")
	.merge(path);

// EXIT
// Remove old elements as needed.
path.exit().remove();