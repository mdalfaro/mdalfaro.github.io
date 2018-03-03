var numVert;
var dict; // maps unique verteces -> all vertices they point to 
var loc_dict; // maps unique verteces -> current location
var k;
var area;
var edges;
var canvas_x;
var canvas_y;

function preload() {
	table = loadTable("cleanedData.csv", "csv", "header");
}

function setup() {

  	canvas_x = 800;
  	canvas_y = 800;

	createCanvas(canvas_x, canvas_y);
	area = canvas_x * canvas_y;

  	dict = {};
  	loc_dict = {};
  	edges = [];
  	numVert = 0;

  	// fill dictionary
  	for (var i = 0; i < table.getRowCount(); i++) {

    	var v1 = int(table.getString(i, 0)); // vertex 1
    	var v2 = int(table.getString(i, 1)); // vertex 2

    	// add [v1, v2] to edges list
    	var a = [v1, v2];
    	edges[i] = a;

	    // add (v1 -> v2) to dict
	    if (v1 in dict) {
	    	var len = dict[v1].length;
	    	dict[v1][len] = v2; 
	    } else {
	    	dict[v1] = [v2];
	    	numVert += 1; 
	    }

	    // add (v2 -> v1 to dict)
	    if (v2 in dict) {
	    	var len = dict[v2].length;
	    	dict[v2][len] = v1;
	    } else {
	    	dict[v2] = [v2];
	    	numVert += 1; 
	    }
  	}

  	k = sqrt(area / numVert);

  	ellipse_width = 10;

  	// fill location dictionary..........vertex -> [x_pos, y_pos, x_disp, y_disp]
  	for (vert in dict) {
  		var x = Math.round(random(ellipse_width, canvas_x - ellipse_width));
  		var y = Math.round(random(ellipse_width, canvas_y - ellipse_width));

  		var array = [x, y, 0, 0];

  		loc_dict[vert] = array;
  	}

}

function draw() {

	background(255, 248, 220);

	 textSize(50);
	 fill(143, 216, 210);
	 text("Force Directed Graph", 30, 70);
	 fill(123, 196, 190);
	 text("Force Directed Graph", 32, 72);

	// Algorithm

	// No need for iterations because draw() simply loops infinitely

	// Calculate REPULSIVE forces..........................................
	for (v1 in dict) { // for each vertex

		var x_disp = 0; // displacement of x
		var y_disp = 0; // displacement of y

		loc_dict[v1][2] = 0; // set displacement to 0 
		loc_dict[v1][3] = 0; // set displacement to 0

		var x_v1 = loc_dict[v1][0]; // x-coordinate of v1
		var y_v1 = loc_dict[v1][1]; // y-coordinate of v1
			
		for (v2 in dict) { // for each other vertex

			if (v1 != v2) { // if the vertices are different

				var x_v2 = loc_dict[v2][0]; // x-coordinate of v2
				var y_v2 = loc_dict[v2][1]; // y-coordinate of v2

				var x_diff = x_v1 - x_v2;
				var y_diff = y_v1 - y_v2;

				if (x_diff != 0) { 
					x_disp = x_disp + (x_diff / abs(x_diff)) * (k**2) / abs(x_diff); // update displacement
				}

				if (y_diff != 0) {
					y_disp = y_disp + (y_diff / abs(y_diff)) * (k**2) / abs(y_diff); // update displacement
				}
			}
		}

		loc_dict[v1][2] = x_disp;
		loc_dict[v1][3] = y_disp;
	}

	// Calculate ATTRACTIVE forces...........................................
	
	for (v1 in dict) {

		for (var i = 0; i < dict[v1].length; i++) {

			var v2 = dict[v1][i]; // v2 key value

			var v1_x = loc_dict[v1][0]; // x location of v1
			var v1_y = loc_dict[v1][1]; // y location of v1
			var v2_x = loc_dict[v2][0]; // x location of v2
			var v2_y = loc_dict[v2][1]; // y location of v2

			var x_diff = v1_x - v2_x; // difference between the x of v1 & v2
			var y_diff = v1_y - v2_y; // difference between the x of v1 & v2

			var x_disp = 0; // x displacement of v1
			var y_disp = 0; // y displacement of v1

			if (x_diff != 0) { // check for division by 0
				x_disp = (x_diff / abs(x_diff)) * (x_diff**2) / k; // update displacement
			} 
			if (y_diff != 0) { // check for division by 0
				y_disp = (y_diff / abs(y_diff)) * (y_diff**2) / k; // update displacement
			}

			loc_dict[v1][2] -= x_disp; // update x displacement of v1
			loc_dict[v1][3] -= y_disp; // update y displacement of v1
			loc_dict[v2][2] += x_disp; // update x displacement of v2
			loc_dict[v2][3] += y_disp; // update y displacement of v2

		}
	}

	// Limit max displacement & print
	for (v in dict) {

		var x1_pos = loc_dict[v][0];
		var y1_pos = loc_dict[v][1];

		var x1_disp = loc_dict[v][2];
		var y1_disp = loc_dict[v][3];

		if (x1_disp != 0) {
			x1_pos = x1_pos + (x1_disp / abs(x1_disp));
		}

		if (y1_disp != 0) {
			y1_pos = y1_pos + (y1_disp / abs(y1_disp));
		}

		x1_pos = min(canvas_x - 50, max(10, x1_pos));
		y1_pos = min(canvas_y - 50, max(10, y1_pos));

		loc_dict[v][0] = x1_pos;
		loc_dict[v][1] = y1_pos;

		// Plotting ..................................................

		// Drawing vertex..........................
		strokeWeight(0); // ellipse info
		fill(143, 216, 210); // ellipse info
		ellipse(x1_pos, y1_pos, 20); // draw vertex ellipse

		// Drawing connection......................
		strokeWeight(1); // connection line info
		fill(0); // connection line info

		for (var i = 0; i < dict[v].length; i++) { // for each vertex that connects to vert

			var x2 = loc_dict[dict[v][i]][0];
			var y2 = loc_dict[dict[v][i]][1];

			line(x1_pos, y1_pos, x2, y2); // draw connecting line
		}

		// interaction
		if (dist(mouseX, mouseY, x1_pos, y1_pos) < 5) {

			fill(255, 145, 146); // rect info
			strokeWeight(0); // rect info
			rect(x1_pos, y1_pos - 30, 70, 30);


			fill(255, 248, 220); // text info
			strokeWeight(1); // text info
			
			textSize(25);
			text(v, x1_pos, y1_pos - 10);

			strokeWeight(0); // ellipse info
			fill(255, 145, 146); // ellipse info
			ellipse(x1_pos, y1_pos, 20); // draw vertex ellipse
		}
	}
}