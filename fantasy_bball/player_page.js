const playercard = d3.select("body")
	.append("svg")
	.attr("width", 1200)
	.attr("height", 180)

// ##########################

var svg = d3.select("body").append("svg")
	.attr("width", 600)
	.attr("height", 400)

var margin = { top: 20, right: 20, bottom: 110, left: 40 },
	margin2 = { top: 330, right: 20, bottom: 30, left: 40 },
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	height2 = +svg.attr("height") - margin2.top - margin2.bottom;

var x = d3.scaleBand().range([0, width]).padding(0.1),
      x2 = d3.scaleBand().range([0, width]).padding(0.1),
      y = d3.scaleLinear().range([height, 0]),
      y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
      xAxis2 = d3.axisBottom(x2),
      yAxis = d3.axisLeft(y);

var parseDate = d3.timeParse("%Y-%m-%d");
var formatDate = d3.timeFormat("%b %d, %Y");

// ###########################

var width_radial = 400,
	height_radial = 400,
	margin_radial = {top: width_radial/2, right: 0, bottom: 20, left: height_radial/2},
	radius = Math.min(width_radial, height_radial - 50) / 2 - 30;

var svg_radial = d3.select("body").append("svg")
		.attr("width", width_radial)
		.attr("height", height_radial)
		.append("g")
		.attr("transform", "translate(" + margin_radial.left + "," + margin_radial.top + ")");

var r = d3.scaleLinear()
	.domain([0, .5])
	.range([0, radius]);
	
var scales = create_scales();

// ###########################

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() {  
  return this.each(function() { 
      var firstChild = this.parentNode.firstChild; 
      if (firstChild) { 
          this.parentNode.insertBefore(this, firstChild); 
      } 
  });
};

var colorDict = {
	'atl' : {'main':'#E03A3E', 'alt':'#C1D32F', 'bars':'#C1D32F'},
	'bos' : {'main':'#007A33', 'alt':'#BA9653', 'bars':'#BA9653'},
	'den' : {'main':'#0E2240', 'alt':'#FEC524', 'bars':'#FEC524'},
	'sac' : {'main':'#5A2D81', 'alt':'#63727A', 'bars':'#63727A'},
	'por' : {'main':'#E03A3E', 'alt':'#63727A', 'bars':'#63727A'},
	'phi' : {'main':'#006BB6', 'alt':'#ED174C', 'bars':'#ED174C'},
	'lac' : {'main':'#C8102E', 'alt':'#1D428A', 'bars':'#1D428A'},
	'nyk' : {'main':'#006BB6', 'alt':'#F58426', 'bars':'#F58426'},
	'mil' : {'main':'#00471B', 'alt':'#EEE1C6', 'bars':'#EEE1C6'},
	'uta' : {'main':'#002B5C', 'alt':'#00471B', 'bars':'#00471B'},
	'det' : {'main':'#C8102E', 'alt':'#00471B', 'bars':'#00471B'},
	'tor' : {'main':'#CE1141' , 'alt':'#00471B', 'bars':'#00471B'},
	'okc' : {'main':'#007AC1', 'alt':'#EF3B24', 'bars':'#EF3B24'},
	'bkn' : {'main':'#000000', 'alt':'#FFFFFF', 'bars':'#FFFFFF'},
	'pho' : {'main':'#1D1160', 'alt':'#E56020', 'bars':'#FFFFFF'},
	'was' : {'main':'#002B5C', 'alt':'#E31837', 'bars':'#E31837'},
	'lal' : {'main':'#552583', 'alt':'#FDB927', 'bars':'#FDB927'},
	'min' : {'main':'#0C2340', 'alt':'#236192', 'bars':'#236192'},
	'hou' : {'main':'#CE1141', 'alt':'#000000', 'bars':'#000000'},
	'gsw' : {'main': '#006BB6', 'alt':'#FDB927', 'bars':'#FDB927'},
	'dal' : {'main': '#00538C', 'alt':'#002B5E', 'bars':'#002B5E'},
	'nor' : {'main': '#0C2340', 'alt':'#85714D', 'bars':'#000000'},
	'mia' : {'main': '#98002E', 'alt':'#F9A01B', 'bars':'#F9A01B'},
	'chi' : {'main': '#CE1141', 'alt':'#000000', 'bars':'#000000'},
	'mem' : {'main': '#5D76A9', 'alt':'#12173F', 'bars':'#12173F'},
	'cle' : {'main':'#6F263D', 'alt':'#041E42', 'bars':'#041E42'},
	'sas' : {'main': '#000000', 'alt':'#C4CED4'},
	'cha' : {'main': '#1D1160', 'alt':'#00788C'},
	'orl' : {'main':'#0077C0' , 'alt':'#C4CED4'},
	'ind' : {'main':'#002D62' , 'alt':'#FDBB30'}
}

var teamDict = {
	'atl' : 'Atlanta Hawks',
	'bos' : 'Boston Celtics',
	'den' : 'Denver Nuggets',
	'hou' : 'Houston Rockets',
	'mil' : 'Milwaukee Bucks',
	'sac' : 'Sacramento Kings',
	'gsw' : 'Golden State Warriors',
	'por' : 'Portland Trailblazers',
	'phi' : 'Philadelphia 76ers',
	'lac' : 'Los Angeles Clippers',
	'nyk' : 'New York Knicks',
	'uta' : 'Utah Jazz',
	'det' : 'Detroit Pistons',
	'tor' : 'Toronto Raptors',
	'okc' : 'Oklahoma City Thunder',
	'bkn' : 'Brooklyn Nets',
	'pho' : 'Phoenix Suns',
	'was' : 'Washington Wizards',
	'lal' : 'Los Angeles Lakers',
	'min' : 'Minnesota Timberwolves',
	'dal' : 'Dallas Mavericks',
	'nor' : 'New Orleans Pelicans',
	'mia' : 'Miami Heat',
	'chi' : 'Chicago Bulls',
	'orl' : 'Orlando Magic',
	'cha' : 'Charlotte Hornets',
	'mem' : 'Memphis Grizzlies',
	'cle' : 'Cleveland Cavaliers',
	'sas' : 'San Antonio Spurs',
	'ind' : 'Indiana Pacers'
}

// ############################


var input = getUrlVars()['Player'].split(/\s*\-\s*/g)
var player_name = input[1] + ', ' + input[0]

d3.csv("data/fanduel.csv", function(error, input_data) {

	// ######## Create data #########

	if (error) {throw error};
	data = []
	input_data.forEach(function(d) {
		if (d.player == player_name) {
			var game = {
				date: parseDate(d.date),
				fpts: +d.fpts,
				opponent: d.opponent,
				blocks: +d.blocks, 
				fg_pct: +d.fg_made/+d.fg_attempts,
				assists: +d.assists, 
				points: +d.points, 
				rebounds: +d.rebounds,
				salary: +d.salary,
				steals: +d.steals,
				turnovers: +d.turnovers,
				minutes_played: +d.minutes_played, 
				position: d.position, 
				team: d.team,
				clicked: false
			};
			data.push(game); 
		}
	})

	var date_range = d3.timeDays(d3.min(data, function(d) { return d.date; }),
								 d3.max(data, function(d) { return d.date; }));
	var player_dates = d3.map(data, function(d) {return d.date}).keys();
	date_range.forEach(function(date) {
		if (player_dates.includes(String(date)) == false) {
			dummy_game = {date:date, 
						  fpts:0,
						  team:data[0].team
						}
			data.push(dummy_game)
		}
	})
	data.sort(function(a,b) {
    	return a.date - b.date;
    });

    // ############################

	playercard.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 1000)
		.attr("height", 180)
		.style("fill", colorDict[data[data.length-1].team]['main'])
		.style("stroke-width", 0);
		
	playercard.append("circle")
		.attr("cx", 95)
		.attr("cy", 90)
		.attr("r", 80)
		.style("fill", "#fbf9f3");



	playercard.append("svg:image")
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', 190)
		.attr('height', 190)
		.attr("xlink:href", 'https://raw.githubusercontent.com/mdalfaro/mdalfaro.github.io/master/fantasy_bball/images/' + input[1] + '%2C%20'+ input[0] + '.png')
		.on("error", function(d){
        	d3.select(this).attr("xlink:href", "https://raw.githubusercontent.com/mdalfaro/mdalfaro.github.io/master/fantasy_bball/images/nbalogo.jpg");
    	})

	playercard.append("circle")
		.attr("cx", 95)
		.attr("cy", 90)
		.attr("r", 78)
		.style("fill", "none")
		.style("stroke", "#fbf9f3")
		.style('stroke-width', 5);

	playercard.append("circle")
		.attr("cx", 95)
		.attr("cy", 90)
		.attr("r", 78)
		.style("fill", "none")
		.style("stroke", colorDict[data[data.length-1].team]['alt']);

	playercard.append("circle")
		.attr("cx", 95)
		.attr("cy", 90)
		.attr("r", 100) // 100 usually
		.style("fill", "none")
		.style("stroke-width", 40) // 40 usually
		.style("stroke", colorDict[data[data.length-1].team]['main']);

	playercard.append("rect")
		.attr("x", 5)
		.attr("y", 5)
		.attr("width", 1000-10)
		.attr("height", 180-10)
		.style("fill", 'none')
		.style("stroke-width", 1)
		.style('stroke', colorDict[data[data.length-1].team]['alt']);

	// human readable name
	n1 = player_name.trim().split(',')
	n2 = n1[1] + ' ' + n1[0]

	playercard.append("text")
		.attr("x", 200)
		.attr("y", 50)
		.attr("font-family", "sans-serif")
		.style("fill", "#fbf9f3")
		.style("font-size", 40)
		.attr("font-variant", "small-caps")
		.text(n2)

	playercard.append("text")
		.attr("x", 200)
		.attr("y", 80)
		.attr("font-family", "sans-serif")
		.style("fill", colorDict[data[data.length-1].team]['alt'])
		.style("font-size", 20)
		.text(teamDict[data[data.length-1].team])

	playercard.append("text")
		.attr("x", 410)
		.attr("y", 80)
		.attr("font-family", "sans-serif")
		.style("fill", "#fbf9f3")
		.style("font-size", 20)
		.attr("font-variant", "small-caps")
		.text(data[data.length-1].position)

    // ############################

	x.domain(data.map(function(d) { return d.date}));
	y.domain([0, 80]);
	x2.domain(x.domain());
	y2.domain(y.domain());

	brush = d3.brushX()
		.extent([[0, 0], [width, height2]])
		.on("brush end", (brushed));
	zoom = d3.zoom()
		.scaleExtent([1, Infinity])
		.translateExtent([[0, 0], [width, height]])
		.extent([[0, 0], [width, height]]);

	focus = svg.append("g")
		.attr("class", "focus")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	focus.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
	focus.append("g")
		.attr("class", "axis axis--y")
		.call(yAxis);
	focus.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", - margin.left)
		.attr("x", 0 - (height / 2))
		.attr("dy", "1em")
		.attr("font-size", "11px")
		.attr("font-family", "sans-serif")
		.style("text-anchor", "middle")
		.attr("font-variant", "small-caps")
		.text("Fantasy Points");

	context = svg.append("g")
		.attr("class", "context")
		.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
	context.append("g")
		.attr("class", "brush")
		.call(brush)
		.call(brush.move, x.range());

	createMiniBars();
	createTooltips(data);

	// ######## Area 


});

function createTooltips() {
	var tooltip = svg.append("g")
		.attr("class", "tooltip")
		.style("display", "none");
	tooltip.append("rect")
		.attr("width", 85)
		.attr("height", 60)
		.attr("y", -51)
		.attr("x", -42)
		.attr("fill", "#BEBEBE")
		.style("text-anchor", "middle")
		.style("opacity", 0.95);
	tooltip.append("text")
		.attr('class', 'line_1')
		.attr("x", 0)
		.attr("y", -46)
		.attr("dy", "1.2em")
		.attr("font-family", "sans-serif")
		.style("text-anchor", "middle")
		.attr("fill", '#fbf9f3')
		.attr("font-size", "12px");
	tooltip.append("text")
		.attr('class', 'line_2')
		.attr("x", 0)
		.attr("y", -41)
		.attr("font-family", "sans-serif")
		.attr("dy", "2.4em")
		.style("text-anchor", "middle")
		.attr("fill", '#fbf9f3')
		.attr("font-size", "10px");
	tooltip.append("text")
		.attr('class', 'line_3')
		.attr("x", 0)
		.attr("y", -33)
		.attr("font-family", "sans-serif")
		.attr("dy", "2.4em")
		.style("text-anchor", "middle")
		.attr("fill", '#fbf9f3')
		.attr("font-size", "14px");
}

function createMiniBars(){
  let mini_bars = context.selectAll(".bar")
      .data(data);

  mini_bars
      .enter()
      .insert("rect")
      .attr("class", "bar")
      .attr("x", d => x2(d.date))
      .attr("width", x2.bandwidth())
      .attr("y", d => y2(d.fpts))
      .attr("height", d => height2 - y2(d.fpts))
      //.attr('opacity', 0.7)
      .style('fill', function(d) {
        return colorDict[d.team]['main'];
      });

  mini_bars.exit().remove();

  context.select('.axis--x').remove();

	context.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height2 + ")")
		.call(xAxis2
			.tickValues(x.domain().filter(function(d, i) { 
				return !(i%30);
			}))
			.tickFormat(d3.timeFormat("%b %Y"))
		)

}

function update() {
  displayed = 0;
  let bar = focus.selectAll(".bar")
    .data(data);

  bar
    .attr("x", d => x(d.date))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.fpts))
    .attr("height", d => height - y(d.fpts))
    .style('fill', function(d) {
    	return colorDict[d.team]['main']
    })
	.style('stroke', function(d) {
		return colorDict[d.team]['main']
	})
	.style('stroke-width', 0.4)
    .style("display", (d) => {
      let to_display = x(d.date) != null;
      if (to_display) {
        displayed += 1;
        return 'initial';
      }
      return 'none';
    })
    .on("mouseover", function(d){

      // activate tooltip
      svg.select('.tooltip')
         .style('display', null); 

      // highlight bar
      d3.select(this)
        .style("fill", "#fbf9f3") // #C04C4B
        .style("cursor", "pointer");
    })
    .on("mouseout",function(d){ 

		svg.select('.tooltip').style('display', 'none'); 
		d3.select(this)
			.style("fill", colorDict[d.team]['main'])
			.style("stroke", colorDict[d.team]['main'])
			.style("cursor", "pointer");
	    })
	.on("mousemove", function(d) {
		var tooltip = svg.select('.tooltip');
		tooltip
			.select("text.line_1")
			.text(`${formatDate(d.date)}`);
		tooltip.select('text.line_2')
			.text(`${(d.opponent.toUpperCase())}`);
		tooltip.select('text.line_3')
			.text(`${(Math.round(d.fpts*100)/100)}`);
		tooltip.attr('transform', `translate(${[d3.mouse(this)[0], d3.mouse(this)[1]]})`)
	})
    .on("click", function(d){
    	/*
      d.clicked = !d.clicked
      if (d.clicked) {

        // Highlight bar 
        d3.select(this)
          .style("fill", "#C04C4B")
          .style("cursor", "pointer");

      } else {

        // Revert bar color
        d3.select(this)
          .style("fill", "#6EA4BB")
          .style("cursor", "pointer");
      }
      */
    });

  bar.enter()
    .insert("rect", '.mean')
    .attr("class", "bar")
    .attr("x", d => x(d.date))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.fpts))
    .attr("height", d => height - y(d.fpts));

  //bar.exit().remove();
}

function updateAxis() {
	focus.select(".axis--x")
		.call(xAxis
			.tickValues(x.domain().filter(function(d, i) { 
				var num_bars = x.domain().length
				if (15 <= num_bars && num_bars <= 40) {
					return i%2; 
				} else if (num_bars <= 15) {
					return true
				} else {
					return false
				}
			}))
			.tickFormat(d3.timeFormat("%m/%d"))
		);

	focus.select(".axis--x")
	 	.selectAll("text")
	 	.attr("font-family", "sans-serif")
	 	.attr("font-size", "10px");
}

function updateContext(min, max) {
	context.selectAll(".bar")
		.style('fill-opacity', function(d, i) { 
			return i >= min && i < max ? '1' : '0.3'
		});
}

function brushed() {
  var s = d3.event.selection || x2.range();
  current_range = [Math.round(s[0] / (width/data.length)), Math.round(s[1] / (width/data.length))];
  x.domain(data.slice(current_range[0], current_range[1]).map(ft => ft.date));
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (current_range[1] - current_range[0]))
      .translate(-current_range[0], 0));
  update();
  updateAxis();
  var min = current_range[0]
  var max = current_range[1]

  var date_range = [data[min].date, data[max-1].date]
  create_arcs(date_range)

  updateContext(min, max);
}

// #########################

function create_scales() {
	scale_FPts = d3.scaleLinear()
		.domain([0, 80])
		.range([0, radius])
	scale_Blocks = d3.scaleLinear()
		.domain([0, 3])
		.range([0, radius])
	scale_Points = d3.scaleLinear()
		.domain([0, 50])
		.range([0, radius])
	scale_Assists = d3.scaleLinear()
		.domain([0, 15])
		.range([0, radius])
	scale_Steals = d3.scaleLinear()
		.domain([0, 10])
		.range([0, radius])
	scale_Turnovers = d3.scaleLinear()
		.domain([0, 10])
		.range([0, radius])
	scale_Rebounds = d3.scaleLinear()
		.domain([0, 15])
		.range([0, radius])
	scale_Salary = d3.scaleLinear()
		.domain([0, 15000])
		.range([0, radius])
	var scales = [scale_FPts, scale_Blocks, scale_Points, scale_Assists,
		scale_Steals, scale_Turnovers, scale_Rebounds, scale_Salary]
	return scales
}

function getMeanValues(data) {
    var mean_FPts = d3.mean(data, function(d) { return d.fpts; });
    var mean_Blocks = d3.mean(data, function(d) { return d.blocks; });
    var mean_Points = d3.mean(data, function(d) { return d.points; });
    var mean_Assists = d3.mean(data, function(d) { return d.assists; });
    var mean_Steals = d3.mean(data, function(d) { return d.steals; });
    var mean_Turnovers = d3.mean(data, function(d) { return d.turnovers; });
    var mean_Rebounds = d3.mean(data, function(d) { return d.rebounds; });
    var mean_Salary = d3.mean(data, function(d) { return d.salary; });
    var values = [mean_FPts, mean_Blocks, mean_Points, mean_Assists,
                mean_Steals, mean_Turnovers, mean_Rebounds, mean_Salary]
    return values
}

var gr = svg_radial.append("g")
    .attr("class", "r axis")
    .selectAll("g")
    .data(r.ticks(5).slice(1))
    .enter()
    .append("g");

gr.append("circle")
    .attr("r", r)
    .attr("stroke-width", .1)
    .attr("stroke", 'black')
    .attr('fill', "None");

var ga = svg_radial.append("g")
    .attr("class", "a axis")
  .selectAll("g")
    .data(d3.range(0, 360, 45))
  .enter().append("g")
    .attr("transform", function(d) { return "rotate(" + -d + ")"; });

ga.append("line")
    .attr("x2", radius)
    .attr("stroke-width", .5)
    .style("stroke", "black");

// Interior labels

var tick_values = []
scale_names = ['FPts', 'Blocks', 'Points', 'Assists', 'Steals', 'Turnovers', 'Rebounds', 'Salary']
// Create 5 values for each scale
for (var i=0; i < scales.length; i++) {
  for (var j=1; j < 5+1; j+=2) {
    tick_values.push({'name':scale_names[i],
                      'val':(scales[i].domain()[1]/5*j).toFixed(0),
                      'rot':22.5*(2*i+1),
                      'scale':scales[i]})
  }
}
            
var radial_axis_labels = svg_radial.append("g")
    .attr("class", "r_axis_labels")
    .selectAll("g")
    .data(tick_values)
    .enter()
    .append("g");

radial_axis_labels.append("text")
    .attr("y", function(d) { return - d.scale(d.val) + 10})
    .style("font-size", "8px")
    .attr("font-family", "sans-serif")
    .attr("transform", function(d) {
      return "rotate(" + d.rot + ")"
    })
    .style("text-anchor", "middle")
    .text(function(d) { return d.val; });

// Exterior labels

var labs = []
// Create 1 values for each statistic
for (var i=0; i < scales.length; i++) {

  labs.push({'name':scale_names[i],
             'val':(scales[i].domain()[1]).toFixed(0),
             'rot':22.5*(2*i+1),
             'scale':scales[i]
           })
}

var exterior_labels = svg_radial.append("g")
    .attr("class", "r_exterior_labels")
    .selectAll("g")
    .data(labs)
    .enter()
    .append("g");

exterior_labels.append("text")
    .attr("y", function(d) { return - d.scale(d.val) - 10})
    .style("font-size", "10px")
    .attr("font-family", "sans-serif")
    .attr("transform", function(d) {return "rotate(" + d.rot + ")"} )
    .style("text-anchor", "middle")
    .text(function(d) { return d.name; });

function create_arcs(date_range) {

	// Does Not Work
    svg_radial.append("text")
		.attr("x", width_radial/2)
		.attr("y", height_radial - 100)
		.attr("font-family", "sans-serif")
		.style("fill", "#6EA4BB")
		.style("font-size", 15)
		.text('Averages from ' + formatDate(date_range[0]) + '-' + formatDate(date_range[1]))

    // Update data based on selected range
    var updated_data = data.filter(function(d) { 
    	return date_range[0] < d.date & d.date < date_range[1] & d.minutes_played > 0;
    })

    // Get mean Values
    var mean_values = getMeanValues(updated_data)

    // Create data for arcss
    var pairs = []
    d3.range(0, 8, 1).map(function(t, i) {
        pairs.push({'start_angle': (i) * Math.PI/4, 'end_angle': (i+1) * Math.PI/4, 
                    //'rad':Math.random() * radius})
                    'rad': scales[i](mean_values[i])}) // fix this
    });

    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(function(d) {return d.rad})
        .startAngle(function(d) {return d.start_angle})
        .endAngle(function(d) {return d.end_angle}); 

    svg_radial.selectAll('.arc').remove('*');

    svg_radial.selectAll('.arc')
        .data(pairs)
        .enter()
        .append("path")
        .attr("class", "arc")
        .attr("d", arc)
        .style("fill", function(d, i) {

        	d3.select(this)
	          	.moveToBack();

            if (i%2==0) {
                return colorDict[data[0].team]['alt']
            } else {
                return "#E7E7E6"
            }
        })
        .style("opacity", 1)
        .style("stroke-width", "0px")
        .on("mouseover", function(d){ 
          d3.select(this)
          	.moveToFront()
            .style("cursor", "pointer");
        })
        .on("mouseout", function(d, i){ 
          var orig_color = (i%2==0) ? colorDict[data[0].team]['alt'] : "#E7E7E6"
          d3.select(this)
          	.moveToBack()
            .style("fill", orig_color)
            .style("cursor", "pointer");
        });
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
