var margin = {top: 20, right: 20, bottom: 20, left: 60},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



//The data for our line
var data = [ 
	{"line":[{ "x": 0,   "y": 0},  { "x": 80,  "y": 80}]},
	{"line":[{ "x": 60,  "y": 15}, { "x": 240,  "y": 160}]},
	{"line":[{ "x": 120,  "y": 30},  { "x": 400, "y": 240}]}
];

//This is the accessor function we talked about above
var lineFunction = d3.line()
	.x(function(d) { 
		console.log(d);
		return d.x; 
	})
	.y(function(d) { return d.y; });


// DATA JOIN
// Join new data with old elements, if any.
var path = svg.selectAll("path")
	.data(data);

console.log(path);

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
		.attr("d", function(d){ 
			console.log(d);
			return lineFunction(d.line);
			 })
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
	.merge(path);

// EXIT
// Remove old elements as needed.
path.exit().remove();