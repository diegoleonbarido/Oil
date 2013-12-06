(function(){	
//We'll start by makig a scatterplot, for which we'll need two scaales. First we need svg element to put our chart into. This code goes into anything potentially useful	
var margin = {top:100, right: 200, bottom: 100, left:50 };	
var width = 975 - margin.left - margin.right,
   height = 750 - margin.top - margin.bottom;

//Because we're making a chart we need to specify the D3 Select
var svg = d3.select("#line-chart-3").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yScale = d3.scale.linear()
    .range([height,0]);

// Now we'll need an xScale
var xScale = d3.scale.linear()
   .domain([1986,2013])
   .range([0,width]);

var line = d3.svg.line()
  	.x(function(d) {return xScale(d.year); })
  	.y(function(d) {return yScale(d.money) });
  	
  	
var xAxis = d3.svg.axis()
    .scale(xScale)
    .tickFormat(function(d) {return d; })
    .orient("top")
    .tickSize(3)
    .tickPadding(1);
    
var yAxis = d3.svg.axis()
       .scale(yScale)
       .orient("left");

nolabel = ["Brazil", "Finland","Denmark","Uruguay"];

//Loading the data
d3.csv("data/money.csv", function(data) {

  window.data = data;
  // set min and max dynamically

  //TODO, fix this
  // yScale.domain([d3.min(data, function(d) { return d.money;}), d3.max(data, function(d) { return d.money;}) ]);
  
  yScale.domain([-231467.1045,70000])

  //Turning variables into numbers
  data.forEach(function(d) {
    d.money = +d.money;
    d.year = +d.year;	
  });
  
  dataByCountry = d3.nest()
      .key(function(d) { return d.country})
      .entries(data);
      
  var countryGroup = svg.selectAll(".country-group")
      .data(dataByCountry)
      .enter().append("g")
      .attr("class", "country-group");
      
      countryGroup.append("text")
      .text(function(d) { 
        label = nolabel.indexOf(d.key) > -1 ? "" : d.key ;
       return label; 
        })
      .attr("x", xScale(2011) )
      .attr("y", function(d) { 
        lastVal = d.values[d.values.length-1].money;
        return yScale(lastVal);
        });
        
  var extraLabel = svg.append("text")
  .text("Brazil, Finland, Denmark, Uruguay")
  .attr("x", xScale(2011))
  .attr("y", yScale(0))

  var countryLine = countryGroup.append("path")
      .attr("d", function(d) { return line(d.values); })
      .attr("class", function(d) { return "g-line " + d.key; });
      
  //Rounding up some numbers before passing them on
  var simple_money = d3.format(",.0f");
      
      var highlightCircle = svg.append("circle")
          .attr('class', "highlight")
          .attr("r", 7);

      var highlightText = svg.append("text")
              .attr('class', "highlight-label")
              
      var circle = svg.selectAll(".mouse-circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "mouse-circle")
          .attr("r",15)
          .style("opacity", 0)
          .attr("cx", function(d) { return xScale(d.year); })
          .attr("cy", function(d) { return yScale(d.money); })
          .on("mouseover", function(d) { 
            //Making sure that the text is coming in
            // d3.select("#oilprod").text(d.bbd);   
            console.log("mouseover",highlightCircle)
            // console.log()
            highlightCircle
                .attr("cx", xScale(d.year))
                .attr("cy", yScale(d.money))

            highlightText
                .attr("x",xScale(d.year) )
                .attr("y",yScale(d.money) )
                .text(simple_money(d.money));
                // .attr("class","stylizing");
          }).on("mouseout", function(d) {
            highlightText.text("")
            highlightCircle.attr("cx", 1000)
          })                    
      
      
      //By adding a height below we are able to change whether the x-axis appears at the bottom of the graph or above
  svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0,0)")
          // .attr("transform", "translate(0,0)") -- Changing the (0,0) affects the placement of the x margin on the graph
          .call(xAxis);
              
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
     .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Petrodollars (Thousand Dollars Day -$US1970 Real Dollars)");
  
    	// Let's use this generator to generate some svg code
  // var xAxis = svg.append("g")
  //      .attr("class","axis")
  //      //This piece of codes brings it to the bottom
  //      .attr("transform", "translate(0, " + height + ")")
  //      .call(xAxis);
  

      
});
})();