(function(){
var margin = {top: 20, right: 100, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#education").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/education.csv", function(error, data) {
  data.forEach(function(d) {
    d.year = +d.year;
    d.expstudent_prim_pctgdpcapita = +d.expstudent_prim_pctgdpcapita;
  });

  x.domain(d3.extent(data, function(d) {return d.year; })).nice();
  y.domain(d3.extent(data, function(d) {return d.expstudent_prim_pctgdpcapita; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Expenditure per student, primary (% of GDP per capita)")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.year); })
      .attr("cy", function(d) { return y(d.expstudent_prim_pctgdpcapita); })
      .style("fill", function(d) { return color(d.country); });

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width + 15)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width + 98)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
      
    var sigs = d3.format(",.0f");    
      
   var highlightCircle = svg.append("circle")
  .attr('class', "highlight")
  .attr("r", 10);

  var highlightText = svg.append("text")
          .attr('class', "highlight-label")
      
  var circle = svg.selectAll(".mouse-circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "mouse-circle")
      .attr("r", 10)
      .style("opacity", 0)
      .attr("cx", function(d) { return x(d.year); })
      .attr("cy", function(d) { return y(d.expstudent_prim_pctgdpcapita); })
      .on("mouseover", function(d) { 
        //Making sure that the text is coming in
        // d3.select("#oilprod").text(d.bbd);   
        // console.log("mouseover",highlightCircle)
        // console.log()
        highlightCircle
            .attr("cx", x(d.year))
            .attr("cy", y(d.expstudent_prim_pctgdpcapita))
  
        highlightText
            .attr("x",x(d.year) )
            .attr("y",y(d.expstudent_prim_pctgdpcapita) )
            .text(sigs(d.expstudent_prim_pctgdpcapita));
            // .attr("class","stylizing");
      }).on("mouseout", function(d) {
        highlightText.text("")
        highlightCircle.attr("cx", 1000)
      })

});
})();