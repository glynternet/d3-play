function update(chart) {
    console.log(chart);
    if (chart.lines != parseInt(chart.lines, 10)) {
        console.log("variables chart.lines is not an integer");
        return;
    }

    width = document.getElementById("chart-svg").width.animVal.value;

    // ensure that skew is interpreted as a number
    skew = +chart.skew;
    const period = (width - (margin.left + margin.right)) / (chart.lines - 1 + skew);
    // x returns the x component of a co-ordinate depending on the index of the
    // datapoint from the data array and a coefficient
    var x = function(i, skewCoefficient) {
        return (i + skew * skewCoefficient) * period;
    };

    const chartSelector = "svg g.chart";
    var svg = d3.select(chartSelector);
    if (svg === null) {
        console.log("Unable to find " + chartSelector);
        return;
    }

    // newLineData calculates the points on a line from the index of the line.
    function newLineData(i) {
        // phase is the radian representation data point that is being drawn.
        // Where the first data point would be 0PI and the last one would be 2PI.
        phase = Math.PI / 2 * i / (chart.lines - 1); //Needs to be (chart.lines - 1) here so that the last line ends up vertically straight
        x1 = x(i, Math.sin(phase));
        x2 = x(i, 1 - Math.cos(phase));
        return {
            "line": [
                { "x": x1, "y": 0 },
                { "x": x1, "y": height * chart.secondPointDistance },
                { "x": x2, "y": height * (1 - chart.secondPointDistance) },
                { "x": x2, "y": height }
            ]
        };
    }

    // The data for our lines
    // The data for this is just consecutive integers from 0
    var data = [];
    for (var i = 0; i < chart.lines; i++) {
        data.push(i);
    }

    // a d3 line function that will draw the lines
    // d3 line functions expect an array of values to draw a line from
    var lineFunction = d3.line()
        // For each element in the array, find the x coordinate using the following function.
        .x(function(d) { return d.x; })
        // For each element in the array, find the y coordinate using the following function.
        .y(function(d) { return d.y; })
        // Put a curve on it
        .curve(d3.curveCatmullRom.alpha(1));


    // a scale that maps index of a line to a colour
    var colourScale = generateColourScale(chart.colours);

    // DATA JOIN
    // Join new data with old elements, if any.
    var path = svg.selectAll("path")
        .data(data, function(d) {
            return d;
        });

    // create new transition instance.
    // This can't be global, it must be generated on each run of update.
    var t = d3.transition()
        .duration(400)
        .ease(d3.easeLinear);

    // UPDATE
    // Update old elements as needed.
    path.attr("class", "update");

    // ENTER
    // Create new elements as needed.
    path.enter()
    	.append("path")
        .attr("class", "enter")
        .attr("stroke-width", chart.strokeWidth)
        .attr("fill", "none")
        .attr("stroke", "white")

    // ENTER + UPDATE
    // After merging the entered elements with the update selection,
    // apply operations to both.
        .merge(path)
        .transition(t)
        .attr("stroke", function(d, i) { return colourScale(i); })
        .attr("d", function(d, i) { return lineFunction(newLineData(d).line); });

    // EXIT
    // Remove old elements as needed.
    path.exit().transition(t)
    	// fade to transparent
        .attr("stroke", d3.rgb(255, 255, 255, 0))
        .remove();
}

// a scale that maps index of a line to a colour
function generateColourScale(colours) {
	// if no colours given, default to black
	if (colours === null || colours === undefined ) {
		return function(i) { return d3.color("black"); };
	}
	var len = colours.length;
	if (len == 1) {
		return function(i) { return colours[0]; };
	}
	var domains = [];
	// Push values to domains array so that we have an array containing values from 0 to number of lines.
	// There must be the same number of elements as in the colours array
	for (var i = 0; i < len; i++) {
		domains.push((chart.lines - 1) * i / (len - 1));
	}
    return d3.scaleLinear()
        .domain(domains)
        .range(colours);
}