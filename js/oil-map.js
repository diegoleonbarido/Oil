(function(){  
	
var margin = {top: 20, right: 100, bottom: 50, left: 50};
    width = 750 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

var svg = d3.select("#oil-map").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

queue()
    // The data sets have to be inputed in order. We use queue() when we have two different data sets that we'd like to work with
    .defer(d3.csv, "oil.csv")
    .defer(d3.json, "mexico.json")
    .await(ready);

function ready(error, oil, mexico) {

  // My first file is oil, my second file is Mexico
  // console.log("mexico", mexico, oil);

  //Making the variable counties before we begin
  var states = topojson.feature(mexico, mexico.objects.layer1); //Topojson function -- look at the data
  
  // convert our data into numbers so we can get ready to merge
  oil.forEach(function(d) {
    d.year = +d.year;
    d.bbd = +d.bbd;
    d.NUM_EDO = +d.NUM_EDO;
  });

  // d3.nest the data by county then by year
  // We're creating a data structure called a map 
  var dataByStateByYear = d3.nest()
    // The order in which we write this down will determin the order in which we nest
    .key(function(d) { return d.NUM_EDO; })
    .key(function(d) { return d.year; })
    .map(oil);
    
  // window.dataByStateByYear = dataByStateByYear;

  // merge geo data with our census data
  states.features.forEach(function(currentStateInLoop) {
    var currentEdo = currentStateInLoop.properties.NUM_EDO;
    var yearDataForThisState = dataByStateByYear[currentEdo];
    currentStateInLoop.properties.yearData = yearDataForThisState;
  }); 
  
  var color = d3.scale.linear()
  .domain([0,1])
  .range(["gold","red"])
  
  var projection = d3.geo.mercator()
      .center([-102, 23])
      .scale(width * 0.5)
      .translate([width/7, height/2]);

  var path = d3.geo.path()
    .projection(projection);

  //data join  
  var countyShapes = svg.selectAll(".county")
      .data(states.features)
      .enter().append("path")
      .attr("class", "county")
      .attr("d", path)
      .style("fill", function(d) { 
        if (d.properties.ENTIDAD === "VERACRUZ DE IGNACIO DE LA LLAVE" || d.properties.ENTIDAD === "TAMAULIPAS"  || d.properties.ENTIDAD === "CAMPECHE" || d.properties.ENTIDAD === "TABASCO") {
          return "gold";
        } else {
          return "black";
        }
         });
}

})();