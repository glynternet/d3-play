var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = 1000;
var height = 700 - margin.top - margin.bottom;
	
var svg = d3.select("svg")
	  .attr("width", width)
	  .attr("height", height + margin.top + margin.bottom)
	.append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	  .attr("class", "chart");

function update(chart) {
	console.log(chart);
	if (chart.lines != parseInt(chart.lines, 10)) {
		console.log("variables chart.lines is not an integer");
		return;
	}
	const period = (width - (margin.left + margin.right)) / (chart.lines - 1 + +chart.skew);
	const secondPointDistance = 150;
	const c1 = d3.hsl(25, 1, 0.6);
	const c2 = d3.rgb(255,0,0);

	var x = function(i, skewCoefficient) {
		return (i + +chart.skew * skewCoefficient) * period;
	};

	var svg = d3.select("svg g.chart");

	function newLineData(i) {
		phase = Math.PI / 2 * i / (chart.lines - 1); //Needs to be (chart.lines - 1) here so that the last line ends up vertically straight
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

	for (var i = 0; i < chart.lines; i++) {
		data.push(i);
	}

	//This is the accessor function we talked about above
	var lineFunction = d3.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; })
		.curve(d3.curveCatmullRom.alpha(1));

	var colourScale = d3.scaleLinear()
		.domain([0, chart.lines-1])
		.range([c1,c2]);

	// DATA JOIN
	// Join new data with old elements, if any.
	var path = svg.selectAll("path")
		.data(data, function(d){ 
			return d; });

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
	        .attr("stroke-width", 2)
	        .attr("fill", "none")
		.merge(path)
		.attr("stroke", function(d,i){
	        	return colourScale(i);
	        })
		.attr("d", function(d, i){ 
				return lineFunction(newLineData(d).line);
				 });

	// EXIT
	// Remove old elements as needed.
	path.exit().remove();
}