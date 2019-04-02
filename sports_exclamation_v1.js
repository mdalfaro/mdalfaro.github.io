// ~~~~~~ SVGs ~~~~~~

// Created the SVG in index.html

// Main SVG: set the dimensions and margins of the graph
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var line_g = svg.append("g")
		   .attr("transform", "translate(" + 500 + "," + 50 + ")");

var card_g = svg.append("g")
				.attr("transform", "translate(" + 900 + "," + 50 + ")");

var main_g = svg.append("g")
		   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var clear_button = svg.append("g")
		   .attr("transform", "translate(" + 500 + "," + 50 + ")");


// ~~~~~~ SCALES ~~~~~~

// Scales for the bar chart
var x_main = d3.scaleBand().rangeRound([0, width]).padding(0.1);
var y_main = d3.scaleLinear().rangeRound([height, 0]); 

// Scales for the line chart
var x_line = d3.scaleLinear().rangeRound([0, width/4]);
var y_line = d3.scaleLinear().rangeRound([200, 0]);


// ~~~~~~ DATA STRUCTURES ~~~~~~
var players = [];
var teams = {};

// ~~~~~~ COLORS ~~~~~~
var color_scale = d3.scaleSequential(d3.interpolateBlues);

// ~~~~~~ TOOLTIPS ~~~~~~
// Tooltips
var div = d3.select("body").append("div")
			.attr("class","tooltip")
			.style("opacity",0);

// Read in data, populate data structures, call viz
d3.csv("fake_projections.csv", function(error, data) {

	if (error) {throw error};

	// sort by 'proj_avg'
	data.sort(function(a,b) {
		return b.proj_avg - a.proj_avg;
	});

	data.forEach(function(d) {

		// create player object & associated attributes
		var player = {
			name: d.player,
			fpts_avg: +d.proj_avg,
			fpts_FanDuel: +d.proj_FanDuel,
			fpts_DraftKings: +d.proj_DraftKings,
			fpts_Yahoo: +d.proj_Yahoo,
			fpts_hist: [[2015, +d.fpts_per_game_2015], [2016, +d.fpts_per_game_2016], [2017, +d.fpts_per_game_2017], [2018, +d.fpts_per_game_2018]],
			fpts_proj: [ [ [2018, +d.fpts_per_game_2018], [2019, +d.proj_FanDuel] ], [ [2018, +d.fpts_per_game_2018], [2019, +d.proj_DraftKings] ], [ [2018, +d.fpts_per_game_2018], [2019, +d.proj_Yahoo,] ] ],
			fpts_per_dollar: +d.fpts_per_dollar,
			team: d.team,
			salary: d.salary, // convert to int (remove comma and dollar sign)
			position: d.position,
			opponent: d.opponent,
			displayed: 1, 
			//clicked: false
		};

		// add player object to array of players
		players.push(player); 

	})

	// ~~~~~~ SET DOMAINS ~~~~~~~

	// Color - [0, max(fpts_per_dollar)]
	color_scale.domain([0, d3.max(players, function(d) {return d.fpts_per_dollar;})]); 

	// Bar chart X – count("playerid")
	x_main.domain(data.map(function(d) { return d.player;}));

	// Bar chart Y – [0, max(fpts)]
	y_main.domain([0, d3.max(players, function(d) {return d.fpts_avg;})]);

	// Line chart X – (2015 - 2019)
	x_line.domain([2015, 2019]);

	// Line chart Y – [0, 100]
	y_line.domain([0, 100]);

	// ~~~~~~ CREATE VISUALS ~~~~~~~

	createBarChart();
	createLineChart();

});

// ~~~~~~~ BAR CHART ~~~~~~~~

function resetBars() {
	main_g.selectAll("rect")
	   .data(players)
       .style("fill", function(d) {
	       	return color_scale(d.fpts_per_dollar)
       })
}

function createBarChart() {

	// Create axes
	main_g.append("g")
	 .attr("class", "x axis")
	 .attr("transform", "translate(0," + height + ")")
	 .call(d3.axisBottom(x_main).tickValues([])) // create x-axis

	// X-axis
	main_g.append("text")             
      .attr("transform",
            "translate(" + ((width/2)-40) + " ," + 
                           (height + margin.top + 5) + ")")
      .style("text-anchor", "middle")
      .style("font", "13px sans-serif")
      .text("Players");

	// Y-axis
	main_g.append("g")
	 .attr("class", "y axis") 
     .call(d3.axisLeft(y_main).ticks(10)) // create y-axis
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "0.71em")
     .attr("fill", "#313639")
     .text("Projected Fantasy Points");

	// Create bars
	main_g.selectAll(".bar")
	 .data(players)
	 .enter()
	 .append("rect")
	 .attr("class", "bar")
     .attr("x", function(d) { return x_main(d.name); })
     .attr("y", function(d) { return y_main(d.fpts_avg); })
     .attr("width", x_main.bandwidth())
     .attr("height", function(d) { return height - y_main(d.fpts_avg); })
     .attr("fill", function(d) {return color_scale(d.fpts_per_dollar)})
     .on("mouseover",function(d){

		// Tooltips
		d3.select(this).style("cursor", "pointer");
     	div.transition()
     		.duration(0)
     		.style("opacity",.8);
     	div.html("<b>" + d.name + "</b>" + "</br>" + d.fpts_avg)
     		.style("left",(d3.event.clientX)+"px")
     		.style("top", (d3.event.clientY - 50) + "px");

     	d3.select(this)
     		.style("fill", "#fbf9f3");	
     })
     .on("mouseout",function(d){

     	div.transition()
		    	.duration(0)
		     	.style("opacity", 0);

     	resetBars()
    })
    .on("click", function(d){ // Make line chart
 		drawLineChart(d);
 		makePlayerCard(d);
     })
}


// ~~~~~~~ LINE CHART ~~~~~~~~

function resetLineChart() {
	line_g.selectAll("*").remove()
}

// function draw
function drawClearButton() {

	// Draw clear button
    clear_button.append("circle")
				.attr("class", "circle_clear")
			  	.attr("cx", 175)
			  	.attr("cy", 250)
			  	.attr("r", 15)
			  	.attr("fill", "indianred")
			  	.attr("opacity", .9)
			  	.on("mouseover", function(d) {
			  		d3.select(this).style("cursor", "pointer");
			  	})
			  	.on("click", function(d) {
			  		createLineChart();
			  		resetBars();
			  		resetPlayerCard();
			  		createLineChart();
			  	});

	clear_button.append("text")
				.attr("class", "clear_text")
				.attr("x", 175)
				.attr("y", 254)
				.style("font", "10px sans-serif")
				.attr("text-anchor", "middle")
				.attr("fill", "#fbf9f3")
				.text("clear")
				.on("mouseover", function(d) {
					d3.select(this).style("cursor", "pointer");
				})
				.on("click", function(d) {
			  		resetBars();
			  		resetPlayerCard();
			  		createLineChart();			  		
			  	});
}

function createLineChart() {

	resetLineChart()
	
	// Create axes
	line_g.append("g")
	 .attr("class", "x axis")
	 .attr("transform", "translate(0," + 200 + ")")
	 .call(d3.axisBottom(x_line).tickFormat(d3.format("d")).ticks(5))
	 .append("text")
     .attr("y", 22)
     .attr("x", 325)
     .attr("dy", "0.71em")
     .attr("fill", "#000")
     .text("Year");
	 
	line_g.append("g")
	 .attr("class", "y axis") 
     .call(d3.axisLeft(y_line).ticks(10))
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "0.71em")
     .attr("fill", "#000")
     .text("Fantasy Points");

    drawClearButton();

	resetBars();
}

function drawLineChart(player) {

    var drawLine = d3.line()
	    			 .x(function(d) { 
	    			 	return x_line(d[0]); 
	    			 })
	    			 .y(function(d) {
	    			 	return y_line(d[1]);
	    			 });


	var hist_lines = line_g.selectAll("hist_line")
				      .data([player])
				      .enter()
				      .append("g")
				      .attr("class", "hist_line");

	// Draw the "history" line
	hist_lines.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("d", function(d) {
			return drawLine(d.fpts_hist);
		})
		.style("stroke", 'black')
   		.style("stroke-width", "1px");

   	// Draw the projection lines

	// Draw the reference circles
	var referenceCircles = line_g.selectAll("circle_ref")
					.data(player.fpts_hist)
					.enter()
					.append("g")
					.attr("class", "circle_ref");

    var proj_lines = line_g.selectAll("proj_line")
				  .data(player.fpts_proj)
				  .enter()
				  .append("g")
				  .attr("class", "proj_line");

	proj_lines.append("path")
		 .attr("class", "line")
		 .attr("fill", "none")
		 .attr("d", function(d) {return drawLine(d);})
		 .style("stroke-dasharray", ("3, 3"))
	 	 .style("stroke", "black")
		 .style("stroke-width", "1.5px");

   	line_g.append("text")
	    .attr("y", y_line(player.fpts_avg) - 5)
	    .attr("x", 300)
	    .attr("dy", "0.71em")
	    .style("font", "10px sans-serif")
	    .attr("fill", "black")
	    .text(player.name)
	    .on("mouseover", function(d) {
	  		d3.select(this).style("cursor", "pointer");
	  	})
	    .on("click", function(d) {
	  		makePlayerCard(player);
	  	});
}

function makePlayerCard(player){

	var position = player.position;

	// background box
    card_g.append("a")
		.append("rect")
		.attr("x", 30)
	    .attr("y", 50)
	    .attr("width", 290)
	    .attr("height", 300)
	    .style("fill", "#313639")
	    .style("stroke-width", 0);

	// main box
	card_g.append("a")
		.append("rect")
		.attr("x", 0)
	    .attr("y", 10)
	    .attr("width", 300)
	    .attr("height", 300)
	    .style("fill", "#388E8E") // ToDo: switch this to team color
	    .style("stroke", "#313639")
	    .style("stroke-width", 1);

	// the white box over that contains most of the information
    card_g.append("a")
		.append("rect")
		.attr("x", 0)
	    .attr("y", 100)
	    .attr("width", 300)
	    .attr("height", 230)
	    .style("fill","#fbf9f3")
	    .style("stroke","#313639")
	    .style("stroke-width", 1);

   	// Name...................................................
   	card_g.append("text")
   		  .style("font", "25px sans-serif")
   		  .attr("x", 7)
   		  .attr("y", 40)
   		  .style("fill","#fbf9f3")
   		  .text(player.name);

   	// MLB Team...................................................

   	// replace FA/Prospect with less clunky "-"
   	// TODO: Find a more elegant solution to this
   	var nba_team = player.team;

   	card_g.append("text")
   		  .style("font", "15px sans-serif")
   		  .attr("x", 7)
   		  .attr("y", 64)
   		  .style("fill","#fbf9f3")
   		  .text(nba_team);

   	// Position...................................................

   	// find how many links over to go
   	var font_width = 9;
   	var new_x = nba_team.length * font_width + 10;

   	card_g.append("text")
   		  .style("font", "20px sans-serif")
   		  .attr("x", new_x + 5)
   		  .attr("y", 64)
   		  .style("fill", "#fbf9f3")
   		  .text(position);

   	// Salary
	card_g.append("text")
		  .attr("x", 7)
   		  .attr("y", 87)
		  .style("fill", "#fbf9f3")
		  .style("font", "18px sans-serif")
	  	  .text(" $" + player.salary);

   	// Performance history........................................
   	var toDisplay = [];
   	toDisplay[0] = ["DraftKings", player.fpts_DraftKings];
   	toDisplay[1] = ["FanDuel", player.fpts_FanDuel];
   	toDisplay[2] = ["Yahoo", player.fpts_Yahoo];

   	card_g.append("text")
   		  .attr("x", 8)
   		  .attr("y", 145)
   		  .style("font", "13px Consolas")
   		  .attr("fill", "#313639")
   		  .text("PROJECTION");

   	card_g.append("text")
   		  .attr("x", 130)
   		  .attr("y", 145)
   		  .style("font", "13px Consolas")
   		  .attr("fill", "#313639")
   		  .text("FPTS");

   	card_g.selectAll("hist")
   		  .data(toDisplay)
   		  .enter()
   		  .append("text")
   		  .attr("class", "hist")
   		  .attr("x", 8)
   		  .attr("y", function(d, i) {
   		  	return 165 + i * 17;
   		  })
   		  .style("font", "13px Consolas")
   		  .attr("fill", "#313639")
   		  .text(function(d) {
   		  		return d[0];
   		  });

   	card_g.selectAll("hist")
   		  .data(toDisplay)
   		  .enter()
   		  .append("text")
   		  .attr("class", "hist")
   		  .attr("x", 130)
   		  .attr("y", function(d, i) {
   		  	return 166 + i * 17;
   		  })
   		  .style("font", "13px Consolas")
   		  .attr("fill", "#313639")
   		  .text(function(d) {
   		  		return d[1]; // return fpts
   		  });
}

function resetPlayerCard() {
	card_g.selectAll("*").remove()
}
