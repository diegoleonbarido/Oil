(function(){
var margin = {top: 20, right: 80, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
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

var svg = d3.select("#innovation").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/innovation.csv", function(error, data) {
  data.forEach(function(d) {
    d.GII = +d.GII;
    d.GDP_CAPITA = +d.GDP_CAPITA;
  });

  data.sort(function(a,b) {
    return a.GII - b.GII;
  });

  // console.log(d.GII);

  x.domain(d3.extent(data, function(d) { return d.GDP_CAPITA; })).nice();
  y.domain(d3.extent(data, function(d) { return d.GII; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("GDP per Capita");

  svg.append("g")
      .attr("class", "y axis")
	  .attr("transform", "translate(" + width + ",0)" )	
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Global Innovation Score")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "innovators")
      .attr("r", 7.5)
      .attr("cx", function(d) { return x(d.GDP_CAPITA); })
      .attr("cy", function(d) { return y(d.GII); });
      // .style("fill", function(d) { return color(d.GDP_CAPITA); });
      
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
          .attr("cx", function(d) { return x(d.GDP_CAPITA); })
          .attr("cy", function(d) { return y(d.GII); })
          .on("mouseover", function(d) { 
            //Making sure that the text is coming in
            // d3.select("#oilprod").text(d.bbd);   
            console.log("mouseover",highlightCircle)
            // console.log()
            highlightCircle
                .attr("cx", x(d.GDP_CAPITA))
                .attr("cy", y(d.GII))

            highlightText
                .attr("x",x(d.GDP_CAPITA) )
                .attr("y",y(d.GII))
                .text(d.Country);
                // .attr("class","stylizing");
          }).on("mouseout", function(d) {
            highlightText.text("")
            highlightCircle.attr("cx", 1000)
          })    
      
      
      
      

  // var legend = svg.selectAll(".legend")
  //     .data(color.domain())
  //   .enter().append("g")
  //     .attr("class", "legend")
  //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // legend.append("rect")
  //     .attr("x", width - 18)
  //     .attr("width", 18)
  //     .attr("height", 18)
  //     .style("fill", color);

  // legend.append("text")
  //     .attr("x", width - 24)
  //     .attr("y", 9)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "end")
  //     .text(function(d) { return d; });

});
})();