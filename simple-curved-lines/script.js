function update(lines) {
	console.log("received lines: " + lines);
	if (lines != parseInt(lines, 10)) {
		console.log("variables lines is not an integer");
		return;
	}
	var margin = {top: 20, right: 20, bottom: 20, left: 20};
	var width = 1000;
	var height = 700 - margin.top - margin.bottom;
	const skew = 300;
	const period = (width - (margin.left + margin.right)) / (lines - 1 + skew);
	const secondPointDistance = 150;
	const c1 = d3.hsl(25, 1, 0.6);
	const c2 = d3.rgb(255,0,0);

	var x = function(i, skewCoefficient) {
		return (i + skew * skewCoefficient) * period;
	};

	var svg = d3.select("svg")
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
		.range([c1,c2]);

	// DATA JOIN
	// Join new data with old elements, if any.
	var path = svg.selectAll("path")
		.data(data, function(d){ return d; });

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
	        .attr("stroke-width", 2)
	        .attr("fill", "none")
		.merge(path);

	// EXIT
	// Remove old elements as needed.
	path.exit().remove();
}

// var slider = document.getElementById("lines-slider");
// console.log(slider);
// slider.value = 150;
// var output = document.getElementById("demo");
// output.innerHTML = slider.value; // Display the default slider value

// // Update the current slider value (each time you drag the slider handle)
// slider.oninput = function() {
// 	update(this.value);
// };
