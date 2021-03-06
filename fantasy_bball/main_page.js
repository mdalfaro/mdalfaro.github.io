const svg = d3.select("body").append("svg")
              .attr("width", 1500)
              .attr("height", 800)

const margin = { top: 20, right: 720, bottom: 310, left: 40 },
      margin2 = { top: 530, right: 20, bottom: 230, left: 40 },
      margin_line = { top: 200, right: 210, bottom: 310, left: 850 },
      width = +svg.attr("width") - margin.left - margin.right,
      width_line = +svg.attr("width") - margin_line.left - margin_line.right, 
      height = +svg.attr("height") - margin.top - margin.bottom,
      height2 = +svg.attr("height") - margin2.top - margin2.bottom,
      height_line = +svg.attr("height") - margin_line.top - margin_line.bottom;

// text label for the x axis
svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .attr("font-size", "11px")
    .text("Available Players");

// text label for the y axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-size", "11px")
    .style("text-anchor", "middle")
    .text("Projected Fantasy Points");

const x = d3.scaleBand().range([0, width]).padding(0.1),
      x2 = d3.scaleBand().range([0, width]).padding(0.1),
      y = d3.scaleLinear().range([height, 0]),
      y2 = d3.scaleLinear().range([height2, 0]),
      x_line = d3.scaleTime().range([0, width_line]),
      y_line = d3.scaleLinear().range([height_line, 0])

const xAxis = d3.axisBottom(x),
      xAxis2 = d3.axisBottom(x2),
      yAxis = d3.axisLeft(y),
      xAxis_line = d3.axisBottom(x_line),
      yAxis_line = d3.axisLeft(y_line);

var parseTime = d3.timeParse("%Y-%m-%d");

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

d3.csv("data/projections.csv", function(error, fantasy_data) {
  if (error) {throw error};
  data = []
  fantasy_data.forEach(function(d) {
    var player = {
      name: d.Name,
      Date: parseTime(d.Date),
      fpts: +d.proj_avg, 
      proj_FanDuel: +d.proj_FanDuel,
      proj_DraftKings: +d.proj_DraftKings, 
      proj_FantasyDraft: +d.proj_FantasyDraft,
      proj_Draft: +d.proj_Draft,
      proj_Yahoo: +d.proj_Yahoo,
      clicked: false
    };
    data.push(player); 
  })
  data.sort((a, b) => b.fpts - a.fpts);

  // Set domains
  x.domain(data.map(function(d) { return d.name}));
  y.domain([0, 70]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  // Brush & Zoom
  brush = d3.brushX()
      .extent([[0, 0], [width, height2]])
      .on("brush end", (brushed));
  zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]]);

  // Create focus (larger bar chart)
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

  // Create context (smaller bar chart)
  context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

  updateMiniBars();
  barTooltips();
});

function barTooltips() {
  var tooltip = svg.append("g")
    .attr("class", "bar_tooltip")
    .style("display", "none");
  tooltip.append("rect")
    .attr("width", 130)
    .attr("height", 40)
    .attr("y", -23)
    .attr("x", -18)
    .attr("fill", "white")
    .style("opacity", 0.8);
  tooltip.append("text")
    .attr('class', 'line_1')
    .attr("x", 48)
    .attr("y", -23)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "14px");
  tooltip.append("text")
    .attr('class', 'line_2')
    .attr("x", 48)
    .attr("y", -23)
    .attr("dy", "2.4em")
    .style("text-anchor", "middle")
    .attr("font-size", "14px");
}

function lineTooltips(line_graph) {
  var tooltip = line_graph.append("g")
    .attr("class", "line_tooltip")
    .style("display", "none");
  tooltip.append("rect")
    .attr("width", 85)
    .attr("height", 60)
    .attr("y", -63)
    .attr("x", -42)
    .attr("fill", "#6EA4BB")
    .style("text-anchor", "middle")
    .style("opacity", 0.95);
  tooltip.append("text")
    .attr('class', 'line_1')
    .attr("x", 0)
    .attr("y", -58)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "12px");
  tooltip.append("text")
    .attr('class', 'line_2')
    .attr("x", 0)
    .attr("y", -53)
    .attr("dy", "2.4em")
    .style("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "10px");
  tooltip.append("text")
    .attr('class', 'line_3')
    .attr("x", 0)
    .attr("y", -45)
    .attr("dy", "2.4em")
    .style("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "14px");
}

function updateMiniBars(){
  let mini_bars = context.selectAll(".bar")
      .data(data);

  mini_bars
      .enter()
      .insert("rect")
      .attr("class", "bar")
      .attr("x", d => x2(d.name))
      .attr("width", x2.bandwidth())
      .attr("y", d => y2(d.fpts))
      .attr("height", d => height2 - y2(d.fpts))
      .style('fill', function(d) {
        if (d.clicked) {
          return '#FAFB97'
        } else {
          return '#6EA4BB'
        }
      });

  mini_bars.exit().remove();

  context.select('.axis--x').remove();

  context.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2)

  // remove names
  context.select('.axis--x')
      .selectAll("text")
      .remove();

}

function move_tooltip_to_front() {
  svg.select('.line_tooltip')
     .moveToFront()
}

function update() {
  displayed = 0;
  let bar = focus.selectAll(".bar")
    .data(data);

  bar
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.fpts))
    .attr("height", d => height - y(d.fpts))
    .style('fill', function(d) {
      if (d.clicked) {
        return "#FAFB97"
      } else {
        return "#6EA4BB"
      }
    })
    .style("display", (d) => {
      let to_display = x(d.name) != null;
      if (to_display) {
        displayed += 1;
        return 'initial';
      }
      return 'none';
    })
    .on("mouseover", function(d){

      // activate tooltip
      svg.select('.bar_tooltip')
         .style('display', null); 

      // highlight bar
      d3.select(this)
        .style("fill", "#fbf9f3") // #C04C4B
        .style("cursor", "pointer");
    })
    .on("mouseout",function(d){ 

      // deactivate tooltip
      svg.select('.bar_tooltip').style('display', 'none'); 

      if (d.clicked) {
        d3.select(this)
          .style("fill", "#FAFB97") // YELLOW
          .style("cursor", "pointer");
      } else {
        d3.select(this)
          .style("fill", "#6EA4BB") // BLUE
          .style("cursor", "pointer");
      }
    })
    .on("mousemove", function(d) {
      const tooltip = svg.select('.bar_tooltip');
      tooltip
        .select("text.line_1")
        .text(`${d.name}`);
      tooltip.select('text.line_2')
        .text(`${(d.fpts)}`);
      tooltip
        .attr('transform', `translate(${[d3.mouse(this)[0], d3.mouse(this)[1]]})`);
    })
    .on("click", function(d){
      d.clicked = !d.clicked
      if (d.clicked) {

        // Highlight bar 
        d3.select(this)
          .style("fill", "#FAFB97")
          .style("cursor", "pointer");

        // Draw line chart
        drawLineChart(d);

      } else {

        // Remove line chart
        var playerid = d.name.replace(/[\W_]+/g, "");
        d3.selectAll("#" + playerid).remove("*");

        // Revert bar color
        d3.select(this)
          .style("fill", "#6EA4BB")
          .style("cursor", "pointer");
      }
      //makePlayerCard(d);
    });

  bar.enter()
    .insert("rect", '.mean')
    .attr("class", "bar")
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.fpts))
    .attr("height", d => height - y(d.fpts));

  //bar.exit().remove();
}

function updateAxis() {
  let axis_x = focus.select(".axis--x").call(xAxis);

  axis_x.selectAll("text")
      .remove();

  // display names
  /*
  if (displayed >= 50) {
    axis_x.selectAll("text")
      .remove();
  } else {
    axis_x.selectAll("text")
      .attrs(d => {
        return { dx: '0', dy: '0.5em', transform: 'rotate(-90)' };
      })
      .style('text-anchor', d => {
        if (displayed > 20) {
          return 'end';
        } else {
            return 'middle';
        }
      });
  }
  */
}

function updateContext(min, max) {
  context.selectAll(".bar")
      .style('fill-opacity', (_, i) => i >= min && i < max ? '1' : '0.3');
}

function brushed() {
  var s = d3.event.selection || x2.range();
  current_range = [Math.round(s[0] / (width/data.length)), Math.round(s[1] / (width/data.length))];
  x.domain(data.slice(current_range[0], current_range[1]).map(ft => ft.name));
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (current_range[1] - current_range[0]))
      .translate(-current_range[0], 0));
  update();
  updateAxis();
  var min = current_range[0]
  var max = current_range[1]
  updateContext(min, max);
}

var formatDate = d3.timeFormat("%b %d, %Y")

// define the line
var valueline = d3.line()
    .x(function(d) { return x_line(d.Date); })
    .y(function(d) { return y_line(d.PTS); })
    .curve(d3.curveCardinal);

var initialized = false; 

function drawLineChart(player) {

  var filepath = 'data/player_history/' + player.name + '.csv'

  d3.csv(filepath, function(error, player_data) {
    if (error) {throw error};

    player_data.forEach(function(d) {
        d.Date = parseTime(d.Date);
        d.PTS = +d.PTS;
        d.opp = d.opp;
        d.clicked = false;
    });

    const line_graph = svg.append("g")
        .attr("class", "line_graph")
        .attr("transform", "translate(" + margin_line.left + "," + margin_line.top + ")")


    // Initialize intially
    if (initialized == false) {

      //x_line.domain([d3.min(player_data, function(d) { return d.Date; }), player.Date])
      future_date = parseTime('2019-05-01')
      x_line.domain([d3.min(player_data, function(d) { return d.Date; }), future_date])
      y_line.domain([0, 70])

      // Create the axes
      line_graph.append("g")
          .attr("class", "line_x_axis")
          .attr("transform", "translate(0," + height_line + ")")
          .call(xAxis_line
            .tickFormat(formatDate).ticks(5));
      line_graph.append("g")
          .attr("class", "line_y_axis")
          .call(yAxis_line
            .ticks(5));

      initialized = true
    }

    lineTooltips(line_graph);
    
    // Create historical line
    line_graph.append("path")
      .data([player_data])
      .attr("fill", "none")
      .attr("class", "lines")
      .attr("id", function(d) {
        return player.name.replace(/[\W_]+/g, "");
      })
      .style("stroke", "black")
      .style("stroke-width", "0.5px")
      .attr("d", valueline);

    // Game circles
    line_graph.selectAll("circle")
       .data(player_data)
       .enter()
       .append('circle')
       .attr('class', 'history')
       .style("fill", "black")
       .attr('r', 2)
       .attr("cx", function(d) { return x_line(d.Date)})
       .attr("cy", function(d) { return y_line(d.PTS)})
       .attr("id", function(d) {
          return player.name.replace(/[\W_]+/g, "");
        })
       .on("mousemove", function(d) {

          var tooltip = svg.select('.line_tooltip');

          tooltip
            .select("text.line_1")
            .text(`${formatDate(d.Date)}`);
          tooltip.select('text.line_2')
            .text(`${(d.opp)}`);
          tooltip.select('text.line_3')
            .text(`${(d.PTS)}`);
          tooltip
            .attr('transform', `translate(${[d3.mouse(this)[0], d3.mouse(this)[1]]})`)
        })
       .on("mouseover", function(d){

          d3.select(this).style("cursor", "pointer");
          move_tooltip_to_front();

          // activate tooltip
          svg.select('.line_tooltip')
             .style('display', null);

          // highlight circle
          d3.select(this)
            .style("fill", "#6EA4BB")
            .style("cursor", "pointer");

        })
        .on("mouseout",function(d){ 

          // deactivate tooltip
          svg.select('.line_tooltip').style('display', 'none'); 

          // highlight circle
          d3.select(this)
            .style("fill", "black")
            .style("cursor", "pointer");
        })

    // Projections
    var projections = [player.proj_FanDuel, player.proj_DraftKings, player.proj_FantasyDraft, player.proj_Draft, player.proj_Yahoo]

    // Get previous game (points, date) (FIND BETTER WAY TO DO THIS)
    player_data.sort(function(a,b) {
      return b.Date - a.Date;
    });
    previous_game_pts = player_data[0].PTS
    previous_game_date = player_data[0].Date

    for (i=0; i < projections.length; i++) {

      pair = [{Date:future_date, PTS:projections[i]}, 
              {Date:previous_game_date, PTS:previous_game_pts}]

      // Create projection line
      line_graph.append("path")
        .data([pair])
        .attr("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "0.5px")
        .style("stroke-dasharray", ("3, 3"))
        .attr("class", "proj_line")
        .attr("d", valueline)
        .attr("id", function(d) {
          return player.name.replace(/[\W_]+/g, "");
        })
        .on("mouseover", function(d) {

          // activate tooltip
          svg.select('.line_tooltip')
             .style('display', null); 

          // highlight circle
          d3.select(this)
            .style("fill", "#6EA4BB")
            .style("cursor", "pointer");

        });
    } 

    line_graph.append("text")
    .attr("y", y_line(player.fpts) - 5)
    .attr("x", x_line(future_date) + 5)
    .attr("dy", "0.71em")
    .attr("class", "playername")
    .attr("id", function(d) {
        return player.name.replace(/[\W_]+/g, "");
    })
    .style("font", "10px sans-serif")
    .attr("fill", "black")
    .text(player.name)
    .on("click", function(d) {
      var first_name = player.name.split(' ')[0]
      var last_name = player.name.split(' ')[1];
      window.open("https://mdalfaro.github.io/fantasy_bball/index_player.html?Player=" + first_name + "-" + last_name);
    })
    .on("mouseover", function(d){

      // Highlight Text
      d3.select(this)
        .style("fill", "#6EA4BB")
        .style("cursor", "pointer");

      var playerid = player.name.replace(/[\W_]+/g, "");

      // Highlight line
      d3.selectAll("#" + playerid)
        .selectAll('.lines')
          .style("stroke-width", 2)
          .style("stroke", "#6EA4BB")

      // Highlight projection
      d3.selectAll("#" + playerid)
        .selectAll('.proj_line')
          .style("stroke", "#6EA4BB");

      d3.selectAll("#" + playerid)
        .selectAll('circle')
          .style("fill", "#6EA4BB");

      d3.selectAll('circle:not(#' + playerid).style("opacity", "0.1");
      d3.selectAll('.lines:not(#' + playerid).style("opacity", "0.1");
      d3.selectAll('.proj_line:not(#' + playerid).style("opacity", "0.1");
      d3.selectAll('.playername:not(#' + playerid).style("opacity", "0.1");
    })
    .on("mouseout",function(d){ 

      // Tooltips
      d3.select(this)
        .style('fill', 'black');

      var playerid = player.name.replace(/[\W_]+/g, "");

      // Revert everything back 
      d3.select("#" + playerid).style("stroke-width", '0.5px')
                               .style("stroke", "black");
      d3.selectAll('circle').style("opacity", "1");
      d3.selectAll('text').style("opacity", "1");
      d3.selectAll('path').style("opacity", "1");

      });

  });
}

