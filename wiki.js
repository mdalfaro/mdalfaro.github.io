// set the dimensions and margins of the graph
var margin = {top: 50, right: 250, bottom: 70, left: 50},
    width = 1250 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// Create svg
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the date
var parseTime = d3.timeParse("%Y-%m-%d"); // "2020-02-08 23:31:48"

// Output Range
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Historical line
var line_history = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.total); });

// Forecast line
var line_forecast = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.forecast); });

var confidence_interval = d3.area()
	    .x(function(d) { return x(d['date']) })
	    .y0(function(d) { return y(d['95_lo']) })
	    .y1(function(d) { return y(d['95_hi']) })

// Get the data
d3.csv("wiki_history.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.total = +d.total;
  });

  // Input Domain
  x.domain([d3.min(data, function(d) { return d.date; }), d3.timeDay.offset(d3.max(data, function(d) {return d.date;}), + 30)])
  y.domain([0, d3.max(data, function(d) { return d.total * 2; })]);

  // Add the line_history path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke", "#27284D")
      .attr("d", line_history);

  // Add the scatterplot 
  svg.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 2.5)
      .style("stroke", "#27284D")
      .style("fill", "white")
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.total); })
      .on("mouseover", function(d, i) {
        d3.select(this)
          .style("cursor", "pointer")
          .style("fill", "#a53e4f")
      })
    .on("mouseout", function(d, i) {
        d3.select(this)
          .style("fill", "white")
      })

  // Add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // Axis labels 
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top/2 + 20) + ")")
      .style("text-anchor", "middle")
      .attr("font-family", "Saira")
      .attr("font-size", 14)
      .attr("font-variant", "small-caps")
      .text("Date");
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left/2 - 40)
      .attr("x",0 - (height / 2))
      .attr("dy", "2em")
      .attr("font-family", "Saira")
      .attr("font-size", 14)
      .style("text-anchor", "middle")
      .attr("font-variant", "small-caps")
      .text("Total Visits"); 

});

// Get the data
d3.csv("forecasts.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.forecast = +d.forecast;
  });

  // Add the line_history path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke", "#27284D")
      .style("stroke-dasharray", ("3, 3"))
      .attr("d", line_forecast);

  // Show confidence interval
  svg.append("path")
	  .data([data])
	  .style("fill", "teal")
	  .style("opacity", 0.2)
	  .attr("stroke", "none")
	  .attr("d", confidence_interval)

  // Add legend
  svg.append("rect")
		.attr("x", width+margin.left)
		.attr("y", height/2 - 80)
		.attr("width", 170)
		.attr("height", 110)
		.style("fill", "none")
		.style("stroke-width", ".4")
		.style("stroke", "black");

  // Add CI reference information
  svg.append("rect")
		.attr("x", width+margin.left + 15)
		.attr("y", height/2 - 20)
		.attr("width", 30)
		.attr("height", 30)
		.style("stroke", "none")
		.style("opacity", 0.3)
		.style("fill", "teal");
  svg.append("text")
  	  .attr("x", width+margin.left + 80)
      .attr("y", height/2 - 48)
      .attr("font-family", "Saira")
      .attr("font-size", 10)
      .style("text-anchor", "middle")
      .text("Forecast");

  // Add Forecast reference information
  svg.append("line")
		.attr("x1", width+margin.left + 10)
		.attr("y1", height/2 - 50)
		.attr("x2", width+margin.left + 50)
		.attr("y2", height/2  - 50)
		.style("stroke", "#27284D")
      	.style("stroke-dasharray", ("3, 3"))
  svg.append("text")
  	  .attr("x", width+margin.left + 110)
      .attr("y", height/2)
      .attr("font-family", "Saira")
      .attr("font-size", 9.5)
      .style("text-anchor", "middle")
      .text("95% Confidence Interval");

});