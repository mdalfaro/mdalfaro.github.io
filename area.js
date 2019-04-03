var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 210, left: 40},
    margin2 = {top: 330, right: 20, bottom: 130, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

var parseDate = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.Date); })
    .y0(height)
    .y1(function(d) { return y(d.PTS); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.Date); })
    .y0(height2)
    .y1(function(d) { return y2(d.PTS); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var player = 'Buddy Hield';
initializeRadar(player);

d3.csv("player_history/Buddy Hield.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.Date; }));
  y.domain([0, d3.max(data, function(d) { return d.PTS; })]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)
      .style('fill', "6EA4BB");;

  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);

  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr('fill', "#6EA4BB")
      .attr("d", area2)
      .style('fill', "6EA4BB");;

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

  svg.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);
});

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();

  var date_range = s.map(x2.invert, x2); 
  create_arcs(date_range)

  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;

  var date_range = t.rescaleX(x2).domain();
  create_arcs(date_range)

  x.domain(t.rescaleX(x2).domain());
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
  d.Date = parseDate(d.Date);
  d.PTS = +d.PTS;
  return d;
}

function create_scales() {
  scale_FPts = d3.scaleLinear()
                     .domain([0, 80])
                     .range([0, radius])
  scale_Fgp = d3.scaleLinear()
                     .domain([0, 100])
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
                     .domain([0, 10])
                     .range([0, radius])
  scale_Minutes = d3.scaleLinear()
                     .domain([0, 48])
                     .range([0, radius])
  var scales = [scale_FPts, scale_Fgp, scale_Points, scale_Assists,
                scale_Steals, scale_Turnovers, scale_Rebounds, scale_Minutes]
  return scales
}

var width_radial = 400,
    height_radial = 500,
    margin_radial = {top: 200, right: 0, bottom: 0, left: 200},
    radius = Math.min(width_radial, height_radial) / 2 - 30;

var scales = create_scales()

var r = d3.scaleLinear()
    .domain([0, .5])
    .range([0, radius]);

var svg_radial = d3.select("body").append("svg")
    .attr("width", width_radial)
    .attr("height", height_radial)
  .append("g")
    .attr("transform", "translate(" + margin_radial.left + "," + margin_radial.top + ")");

function create_context() {
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
    scale_names = ['FPts', 'FG %', 'Points', 'Assists', 'Steals', 'Turnovers', 'Rebounds', 'Minutes']
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
        .attr("transform", function(d) {return "rotate(" + d.rot + ")"} )
        .style("text-anchor", "middle")
        .text(function(d) { return d.name; });

    /*
    ga.append("text")
       .attr("x", radius + 6)
       .attr("dy", ".35em")
       .style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
       .attr("transform", function(d) { return d < 270 && d > 90 ? "rotate(180 " + (radius + 6) + ",0)" : null; })
       .text(function(d) { return d + "°"; });
    */
}

function create_arcs(date_range) {

    // reset radials
    svg_radial.selectAll('*').remove('*')

    // Update data based on selected range
    var updated_data = player_data.filter(function(d) { return date_range[0] < d.Date & d.Date < date_range[1]})

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

    svg_radial.selectAll('.arc')
        .data(pairs)
        .enter()
        .append("path")
        .attr("class", "arc")
        .attr("d", arc)
        .style("fill", function(d, i) {
            if (i%2==0) {
                return "#6EA4BB"
            } else {
                return "#E7E7E6"
            }
        })
        .style("opacity", 1)
        .style("stroke-width", "0px")
        .on("mouseover", function(d){ 
          d3.select(this)
            .style("fill", "#FAFB97")
            .style("cursor", "pointer");
        })
        .on("mouseout", function(d, i){ 
          var orig_color = (i%2==0) ? "#6EA4BB" : "#E7E7E6"
          d3.select(this)
            .style("fill", orig_color)
            .style("cursor", "pointer");
        });

    // re-draw axes
    create_context()
}

// Getting player data
var parseTime = d3.timeParse("%Y-%m-%d");

var player_data = []

function initializeRadar(player) {

  var filepath = 'player_history/' + player + '.csv'

  d3.csv(filepath, function(error, data) {
    if (error) {throw error};

    data.forEach(function(d) {
        var player = {
            Date: parseTime(d.Date),
            PTS: +d.PTS,
            opp: d.opp,
            Fgp: +d.Fgp,
            Points: +d.Points,
            Assists: +d.Assists,
            Steals: +d.Steals,
            Turnovers: +d.Turnovers,
            Rebounds: +d.Rebounds,
            Minutes: +d.Minutes,
        }
        player_data.push(player)
    });

    var time_range = d3.extent(player_data, function(d) {return d.Date})
  })
}

function getMeanValues(data) {

    // Calculate mean values
    var mean_FPts = d3.mean(data, function(d) { return d.PTS; });
    var mean_Fgp = d3.mean(data, function(d) { return d.Fgp; });
    var mean_Points = d3.mean(data, function(d) { return d.Points; });
    var mean_Assists = d3.mean(data, function(d) { return d.Assists; });
    var mean_Steals = d3.mean(data, function(d) { return d.Steals; });
    var mean_Turnovers = d3.mean(data, function(d) { return d.Turnovers; });
    var mean_Rebounds = d3.mean(data, function(d) { return d.Rebounds; });
    var mean_Minutes = d3.mean(data, function(d) { return d.Minutes; });
    
    var values = [mean_FPts, mean_Fgp, mean_Points, mean_Assists,
                mean_Steals, mean_Turnovers, mean_Rebounds, mean_Minutes]

    return values
}


