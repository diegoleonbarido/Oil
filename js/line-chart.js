(function(){
//We'll start by makig a scatterplot, for which we'll need two scaales. First we need svg element to put our chart into. This code goes into anything potentially useful	
var margin = {top:10, right: 100, bottom: 50, left:50 };	
var width = 750 - margin.left - margin.right,
 height = 750 - margin.top - margin.bottom;

//Because we're making a chart we need to specify the D3 Select
var svg = d3.select("#line-chart-1").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yScale = d3.scale.linear()
  .range([height,0]);

// Now we'll need an xScale
var xScale = d3.scale.linear()
 .domain([1979,2013])
 .range([0,width]);

var line = d3.svg.line()
	.x(function(d) {return xScale(d.year); })
	.y(function(d) {return yScale(d.bbd) });
	
	
var xAxis = d3.svg.axis()
  .scale(xScale)
  // .tickFormat(function(d) {return d; })
  .orient("top")
  .tickSize(3)
  .tickPadding(1);

var yAxis = d3.svg.axis()
 .scale(yScale)
 .orient("left");
  
nolabel1 = ["Finland", "Denmark", "Japan", "Germany", "Uruguay"];
	
//Loading the data
d3.csv("data/bbd.csv", function(data) {

// set min and max dynamically

//TODO, fix this
// yScale.domain([d3.min(data, function(d) { return d.money;}), d3.max(data, function(d) { return d.money;}) ]);

yScale.domain([-500,12000])

//Turning variables into numbers
data.forEach(function(d) {
  d.bbd = +d.bbd;
  d.year = +d.year;	
});

// window.data = data;

dataByCountry = d3.nest()
    .key(function(d) { return d.country})
    .entries(data);
    
var countryGroup = svg.selectAll(".country-group")
    .data(dataByCountry)
    .enter().append("g")
    .attr("class", "country-group");
    
    countryGroup.append("text")
    .text(function(d) { 
      label = nolabel1.indexOf(d.key) > -1 ? "" : d.key ;
     return label; 
      })
     .attr("x", xScale(2012) )
     .attr("y", function(d) { 
      lastVal = d.values[d.values.length-1].bbd;
      return yScale(lastVal);
      });
  
  var extraLabel = svg.append("text")
  .text("Finland, Denmark, Japan, Germany, Uruguay")
  .attr("x", xScale(2000))
  .attr("y", yScale(490));
   
    
  var countryLine = countryGroup.append("path")
      .attr("d", function(d) { return line(d.values); })
      .attr("class", function(d) { return "g-line " + d.key; });

  //Rounding up some numbers before passing them on
  var simple_bbd = d3.format(",.0f");

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
      .attr("r", 20)
      .style("opacity", 0)
      .attr("cx", function(d) { return xScale(d.year); })
      .attr("cy", function(d) { return yScale(d.bbd); })
      .on("mouseover", function(d) { 
        //Making sure that the text is coming in
        // d3.select("#oilprod").text(d.bbd);   
        console.log("mouseover",highlightCircle)
        // console.log()
        highlightCircle
            .attr("cx", xScale(d.year))
            .attr("cy", yScale(d.bbd))
               
        highlightText
            .attr("x",xScale(d.year) )
            .attr("y",yScale(d.bbd) )
            .text(simple_bbd(d.bbd));
            // .attr("class","stylizing");
      }).on("mouseout", function(d) {
        highlightText.text("")
        highlightCircle.attr("cx", 1000)
      })
          
    //By adding a height below we are able to change whether the x-axis appears at the bottom of the graph or above
svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
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
    .text("Total Oil Supply (Thousand Barrels Day)");
    
  	// Let's use this generator to generate some svg code
// var xAxis = svg.append("g")
//      .attr("class","axis")
//      //This piece of codes brings it to the bottom
//      .attr("transform", "translate(0, " + height + ")")
//      .call(xAxis);


// //Mouseover begins here

//Adds the circle that tracks the value
var focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");
   
//actually appends the circle
focus.append("circle")
     .attr("r", 4.5);    
     
//actually appends the text to the mouseover
focus.append("text")
    .attr("x", 9)
    .attr("dy", ".35em");
  

// //Appending a rectangle for some reason    
// svg.append("rect")
//   .attr("class", "overlay")
//   .attr("width", width)
//   .attr("height", height)
//   .on("mouseover", function() { focus.style("display", null); })
//   .on("mouseout", function() { focus.style("display", "none"); })
  // .on("mousemove", mousemove);         

  // function mousemove() {
  //       console.log("I AM INSIDE MOUSEMOVE!!")
  //       // var x0 = xScale.invert(d3.mouse(this)[0]),
    //        i = bisectDate(data, x0, 1),
    //        d0 = data[i - 1],
    //        d1 = data[i],
    //        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
    //    focus.select("text").text(formatCurrency(d.close));
    //     }

});
})();