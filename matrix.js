// Matrix 

var canvas_x;
var canvas_y;
var numVert; // number of unique vertices
var dict // maps unique verteces -> all vertices they point to 

function preload() {
	table = loadTable("cleanedData.csv", "csv", "header");
}

function setup() {

	// canvas creation
	canvas_x = 2000;
	canvas_y = 2000;
	createCanvas(canvas_x, canvas_y);

  	dict = {};
  	numVert = 0;

  	// fill dictionary
  	for (var i = 0; i < table.getRowCount(); i++) {

    	var v1 = int(table.getString(i, 0)); // vertex 1
    	var v2 = int(table.getString(i, 1)); // vertex 2

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

  	print(dict[594]);
}

function draw() {

	background(255, 248, 220); // draw background with cream color 

	// Title

	 textSize(50);
	 fill(143, 216, 210);
	 text("Adjacency Matrix", 30, 70);
	 fill(123, 196, 190);
	 text("Adjacency Matrix", 32, 72);

	// ..............................
	var emptySpace = 300; // for axis names & tick info 
	var canvasMin = min(canvas_x, canvas_y); // to determine square height 
	var marginLength = emptySpace / 2;
	var matrixLength = canvasMin - emptySpace; // (height & width) of the matrix 

	// Matrix 
	fill(255, 248, 220);
	rect(marginLength, marginLength, matrixLength, matrixLength);

	// draw hash lines
	var inc = matrixLength / numVert; // distance between lines

	var i = marginLength + inc;
	textSize(11); // axis name specs
	fill(49, 54, 57); 

	// draw grid & label axes
	for (vert in dict) {

		fill(0); // axis-label color

		// X-Axis
		line(i, marginLength, i, marginLength + matrixLength); // draw vertical lines
		text(vert, i - inc, marginLength - 10); // x-axis labels

		// Y-Axis
		line(marginLength, i, marginLength + matrixLength, i); // draw horizontal lines (increment y)
		text(vert, marginLength - 30, i-10); // y-axis labels 

		i += inc; 
	}

	// fill in grid
	var outer = marginLength;

	for (v1 in dict) {

		var inner = marginLength; // reset inner increment

		for (v2 in dict) {

			for (var j = 0; j < dict[v1].length; j++) { // for each vertex that v1 maps to
				if ((dict[v1][j]) == v2 || (v1 == v2)) {
					
					fill(0);
					rect(inner, outer, inc, inc); // plot

					if ((mouseX > inner) && (mouseX < inner + inc) && (mouseY > outer) && (mouseY < outer + inc)) {
						fill(143, 216, 210); // rect info
						rect(inner, outer, inc, inc); // highlight the square
						rect(marginLength, outer, inner - marginLength, inc); // draw a horizontal highlight
						rect(inner, marginLength, inc, outer - marginLength); // draw a vertical highlight

						text(v2, inner, marginLength - 10); // x-axis labels
						text(v1, marginLength - 30, outer + inc - 10); // y-axis labels
					}
				}
			}
			inner += inc;
		}
		outer += inc;
	}
}