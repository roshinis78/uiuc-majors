
// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function() {
   d3.csv("relevant_data.csv").then(function(data) {
     // Write the data to the console for debugging:
     console.log(data);
 
     // Call our visualize function:
     visualize(data);
   });
 });
 
 
 var visualize = function(data) {
   // Boilerplate:
   var margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
       
   var svg = d3.select("#chart")
     .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .style("width", width + margin.left + margin.right)
     .style("height", height + margin.top + margin.bottom)
     .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
   // Visualization Code:
 
    var config = {
       numColleges: 7,
       spacing: 50,
       labelPosition: [0, 75, 280, 390, 510, 650, 850],
       colPosition: [20, 160, 310, 425, 550, 720, 865]
    }
 
    // get an array of all the colleges
    var allColleges = [...new Set(data.map(item => item.College))];
    
 
    console.log(allColleges);
 
    svg.selectAll('text')
       .data(allColleges)
       .enter()
       .append('text')
       .text(function(d, i) {
          return allColleges[i];
       })
       .attr("id", function(d, i) {
          return d.replace(/ /g, "-");
       })
       .attr('x', function(d, i) {
          return config.labelPosition[i];
       })
       .attr('y', height + 40)
 
    var vertScale = d3.scaleLinear()
                      .domain([1200, 0]) // get the maximum number
                      .range([0, height]);
 
    var positionMap = new Map();
    allColleges.forEach(function(element, index) {
       positionMap.set(element, config.colPosition[index]);
    });
 
   console.log(positionMap);
 
 
    var startX = [];
    var startY = [];
    var endX = [];
    var endY = [];
 
   svg.selectAll('left')
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "left")
      .attr("id", function(d, i) {
            return "start-" + i;
      })
      .attr("r", 3)
      .attr("cx", function(d, i) {
         var x = positionMap.get(d.College) - 30;
         startX.push(x);
         return x;
      })
      .attr("cy", function(d, i) {
         var y = vertScale(d["2004"]);
         startY.push(y);
         return y;
      })
      .attr("opacity", 0.5);
 
   svg.selectAll('right')
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "right")
      .attr("id", function(d, i) {
            return "end-" + i;
      })
      .attr("r", 3)
      .attr("cx", function(d, i) {
         var x = positionMap.get(d.College) + 30;
         endX.push(x);
         return x;
      })
      .attr("cy", function(d, i) {
         var y = vertScale(d["2018"]);
         endY.push(y);
         return y;
      })
      .attr("opacity", 0.5);
 
   console.log(startX);
   console.log(startY);
   console.log(endX);
   console.log(endY);
 
   svg.selectAll("number-left")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
              return d["2004"];
        })
        .attr("x", function(d, i) {
              return startX[i] - 35;
        })
        .attr("y", function(d, i) {
              return startY[i] + 5;
        })
        .attr("class", "number-left")
        .attr("id", function(d, i) {
              return "number-left-" + i;
        })
        .attr("opacity", 0);
 
      svg.selectAll("number-right")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
              return d["2018"];
        })
        .attr("x", function(d, i) {
              return endX[i] + 10;
        })
        .attr("y", function(d, i) {
              return endY[i] + 5;
        })
        .attr("class", "number-right")
        .attr("id", function(d, i) {
              return "number-right-" + i;
        })
        .attr("opacity", 0);
        
   var color = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(["green", "black", "red"]);

   svg.selectAll("slope-line")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "slope-line")
      .attr("id", function(d, i) {
           return "line-" + i;
      })
      .attr("x1", function(d, i) {
         return startX[i];
      })
      .attr("y1", function(d, i) {
         return startY[i];
      })
      .attr("x2", function(d, i) {
         return endX[i];
      })
      .attr("y2", function(d, i) {
         return endY[i];
      })
      .attr("stroke-width", 3)
      .attr("stroke", function(d, i){
         var m = ( endY[i] - startY[i] ) / (endX[i] - startX[i] )
         
         return color(m);
      })
      .attr("opacity", 0.5);
 
 
      svg.selectAll("slope-line-area")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "slope-line-area")
      .attr("x1", function(d, i) {
         return startX[i];
      })
      .attr("y1", function(d, i) {
         return startY[i];
      })
      .attr("x2", function(d, i) {
         return endX[i];
      })
      .attr("y2", function(d, i) {
         return endY[i];
      })
      .attr("stroke-width", 20)
      .attr("stroke", "white")
      .attr("opacity", 0)
      .on("mouseover", function(d, i) {
          d3.select("#" + d.College.replace(/ /g, "-")).text(d["Major Name"]);
          console.log(d["Major Name"]);
            document.getElementById("line-" + i).style.opacity = 1;
            document.getElementById("start-" + i).style.opacity = 1;
            document.getElementById("end-" + i).style.opacity = 1;
            document.getElementById("number-left-" + i).style.opacity = 1;
            document.getElementById("number-right-" + i).style.opacity = 1;
      }).on("mouseout", function(d, i){
          d3.select("#" + d.College.replace(/ /g, "-")).text(d.College);
          document.getElementById("line-" + i).style.opacity = 0.5;
            document.getElementById("start-" + i).style.opacity = 0.5;
            document.getElementById("end-" + i).style.opacity = 0.5;
            document.getElementById("number-left-" + i).style.opacity = 0;
            document.getElementById("number-right-" + i).style.opacity = 0;
      });
 
 
 
 };