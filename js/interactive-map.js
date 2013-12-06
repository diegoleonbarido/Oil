(function() {

	var margin = {
		top: 100,
		right: 20,
		bottom: 100,
		left: 20
	};
	
	width = 2500 - margin.left - margin.right;
	height = 750 - margin.top - margin.bottom;
	
	var legendData = [{
		color: "#FFDAB9",
		span: "0.43 - 0.46"
	}, {
		color: "#FFD700",
		span: "0.46 - 0.48"
	}, {
		color: "#FFA500",
		span: "0.48 - 0.51"
	}, {
		color: "#FF0000",
		span: "0.51"
	}]
	


	var html = d3.select("#interactive-map");

	var myLegend = html.append("div").attr("class", "my-legend");

	myLegend.append("div").attr("class", "legend-title").text("Gini Coefficient (0 = Perfect Equality; 1 = Perfect Inequality)");

	var legendScale = myLegend.append("ul").attr("class", "legend-scale");

	var legendItem = legendScale.selectAll("li").data(legendData).enter().append("li")
		.style("background", function(d) {
			return d.color;
		})
		.attr("class", "legendBox")
		
	legendItem.append("span")
		.text(function(d) { return d.span; })

	// <div class='my-legend'>
	//   <div class='legend-title'> Gini Coefficient (0 = Perfect Equality; 1 = Perfect Inequality) </div>
	// 
	//   <div class='legend-scale'>
	//     <ul class='legend-labels'>
	//       <li><span style='background:#FFDAB9'></span>0.43 - 0.46</li>
	//       <li><span style='background:#FFD700;'></span> 0.46 - 0.48 </li>
	//       <li><span style='background:#FFA500;'></span> 0.48 - 0.51 </li>
	//       <li><span style='background:#FF0000;'></span> > 0.51</li>
	//       <div class='my-legend'>
	//     </ul>
	//   </div>


	var svg = html.append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// We use queue when we're trying to load two different files 
	queue().defer(d3.csv, "gini.csv") //This is tab separated file
	.defer(d3.json, "mexico.json").await(ready);

	function ready(error, gini, mexico) {

		// My first file is oil, my second file is Mexico
		console.log("mexico", mexico, gini);

		//Making the variable counties before we begin
		var states = topojson.feature(mexico, mexico.objects.layer1); //Topojson function -- look at the data
		// convert our data into numbers so we can get ready to merge
		gini.forEach(function(d) {
			d.gini = +d.gini;
			d.NUM_EDO = +d.NUM_EDO;
		});

		// Even though we only thing we want to work with (we want to merge by entidad), we should still nest it so that it is easier to merge later
		var nestedGinis = d3.nest().key(function(d) {
			return d.Entidad;
		})
		//The rollup function allows us to select the Gini value from our different states
		// When in doubt use the mister nester website!
		.rollup(function(values) {
			return values[0].Gini;
		}).map(gini);

		// console.log(nestedGinis)
		// merge geo data with our gini data
		states.features.forEach(function(currentStateInLoop) {
			var currentEntidad = currentStateInLoop.properties.ENTIDAD;
			var Entidad_Gini = nestedGinis[currentEntidad];
			// console.log(currentEntidad, Entidad_Gini)
			currentStateInLoop.properties.ENTIDADGINI = Entidad_Gini;
		});

		// Check the consolde log to see if the states have our Gini values
		console.log(states)

		// To draw a map we need a map projection
		var projection = d3.geo.mercator().center([-102, 23])
		//Controls the size of the map and how it shows on the screen
		.scale(width * .7).translate([width / 5, height / 2]);

		var path = d3.geo.path().projection(projection);

		// Data join
		//Selecting by the Class "Entidad"
		var dataJoin = svg.selectAll(".Entidad").data(states.features);

		var EntidadGroups = dataJoin.enter().append("g").attr("class", "entidad")
			.on("mouseover", function(d) {
				d3.select(".entidadLabel-" + d.id).style("display", "block");
			})
			.on("mouseout", function(d) {
				d3.select(".entidadLabel-" + d.id).style("display", "none");
			})

		EntidadGroups.append("path").attr("d", path).style("fill", function(d) {
			var value = d.properties.ENTIDADGINI;
			if (value >= 0.43 && value <= 0.46) {
				return "#FFDAB9";
			}
			if (value > 0.46 && value <= 0.48) {
				return "#FFD700";
			}
			if (value > 0.48 && value <= 0.51) {
				return "FFA500";
			} else {
				return "#FF0000"
			}
		});
		
		svg.selectAll(".entidadLabel").data(states.features).enter().append("text")
			.attr("class", function(d) { return "entidadLabel entidadLabel-" + d.id })
			.attr("transform", function(d) {
				var c = path.centroid(d);
				return "translate(" + c[0] + "," + c[1] + ")";
			})
			.text(function(d) {
				return d.properties.ENTIDAD + " - " + d.properties.ENTIDADGINI
			})


	}

	// console.log(counties,data)
})();
