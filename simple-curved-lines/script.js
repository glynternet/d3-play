function update(chart) {
    if (chart.lines != parseInt(chart.lines, 10)) {
        console.log("variables chart.lines is not an integer");
        return;
    }

    console.log(chart);
    width = document.getElementById("chart-svg").width.animVal.value;

    // ensure that skew is interpreted as a number
    skew = +chart.skew;
    const period = (width - (margin.left + margin.right)) / (chart.lines - 1 + skew);
    // x returns the x component of a co-ordinate depending on the index of the
    // datapoint from the data array and a coefficient
    var x = function(i, skewCoefficient) {
        return (i + skew * skewCoefficient) * period;
    };

    var svg = d3.select(chart.selector);
    if (svg === null) {
        console.log("Unable to find " + chart.selector);
        return;
    }

    svg.style("font-family","Helvetica, Arial, sans-serif");
    svg.style("font-weight","lighter");

    if (chart.background_colour) {
        d3.select("#chart-background")
            .style("fill",chart.background_colour);
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
    var group = svg.selectAll("g")
        .data(data, function(d) {
            return d;
        });

    // UPDATE
    // Update old elements as needed.
    group.attr("class", "update")
        .select("path")
        .attr("class", "update");

    var groupEnter = group.enter()
        .append("g")
        .attr("class", "enter")
        .attr("opacity", 1);

    var idFn = function (i) { return "path-" + i; };

    // ENTER
    // Create new elements as needed.
    var path = groupEnter
        .append("path")
        .attr("class", "enter")
        .attr("id", function(d, i) { return idFn(i); })
        .attr("fill", "none")
        .attr("stroke-linecap", "round")
        .attr("d", function(d, i) { return lineFunction(newLineData(chart.lines - 1, x).line); });

    var text = groupEnter
        .append("text")
        .attr("font-size", "14px")
        .append("textPath") //append a textPath to the text element
        .attr("xlink:href", function(d, i) { return "#" + idFn(i); } ) //place the ID of the path here
        .style("text-anchor", "middle") //place the text halfway on the arc
        .attr("startOffset", "50%")
        .attr("fill", function(d, i) { return colourScale(i); })
        .text(chart.text);

    // ENTER + UPDATE
    // After merging the entered elements with the update selection,
    // apply operations to both.
    groupEnter.merge(group)
        // .attr("opacity",1)
        .select("path")
        .attr("stroke-width", chart.strokeWidth)
        .attr("stroke", "none")
        // .attr("stroke", function(d, i) { return colourScale(i); })
        .attr("stroke-width", chart.strokeWidth)
        .attr("d", function(d, i) { return lineFunction(newLineData(d, x).line); });

    groupEnter.merge(group)
        // .attr("opacity",1)
        .select("text")
        .attr("stroke", function(d, i) { return colourScale(i); });


    // EXIT
    // Remove old elements as needed.
    group.exit()
        .select("path")
        .attr("d", function(d, i) { return lineFunction(newLineData(chart.lines - 1, x).line); });

    group.exit()
        .attr("class", "exit")
        // fade to transparent
        .attr("opacity", 0)
        .remove();
}

// a scale that maps index of a line to a colour
function generateColourScale(colours) {
    // if no colours given, default to black
    if (colours === null || colours === undefined) {
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

// newLineData calculates the points on a line from the index of the line.
function newLineData(i, xFn) {
    // phase is the radian representation data point that is being drawn.
    // Where the first data point would be 0PI and the last one would be 2PI.
    phase = Math.PI / 2 * i / (chart.lines - 1); //Needs to be (chart.lines - 1) here so that the last line ends up vertically straight
    x1 = xFn(i, Math.sin(phase));
    x2 = xFn(i, 1 - Math.cos(phase));
    return {
        "line": [
            { "x": x1, "y": 0 },
            { "x": x1, "y": height * chart.secondPointDistance },
            { "x": x2, "y": height * (1 - chart.secondPointDistance) },
            { "x": x2, "y": height }
        ]
    };
}

function writeDownloadLink(name){
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    chartSVG = d3.select("#chart-svg");
    console.log(chartSVG);

    var html = chartSVG
        .attr("title", "test2")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    var blob = new Blob([html], {type: "image/svg+xml"});
    saveAs(blob, name + ".svg");
}

var genButton = d3.select("#generate");
console.log(genButton);
genButton.on("click", writeDownloadLink);

