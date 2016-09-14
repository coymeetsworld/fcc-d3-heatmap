$(document).ready(function() {

  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var margin = {top: 20, right: 30, bottom: 30, left: 40}
	var chartWidth = 1200;
	var chartHeight = 600;
	var x = d3.scaleLinear().range([0, chartWidth]);
	var y = d3.scaleTime().domain([new Date(2016,11,31), new Date(2016,0,1)]).range([chartHeight, 0]);
	var chart = d3.select('.chart')
								.attr("width", 1200+margin.left+margin.right)
								.attr("height", 600+margin.top+margin.bottom)
								.append("g")
								.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	function buildXAxis(x) {
		chart.append("g")
				 .attr("transform", "translate(0," + chartHeight + ")")
				 .call(d3.axisBottom(x));

		//Add text label for x-axis
		chart.append("text")
				 .attr("transform", "translate(" + (chartWidth/2) + "," + (chartHeight+50) + ")")
				 .attr("class", "axisLabel")
				 .text("Years");
	}

	function buildYAxis(y) {
		chart.append("g")
				 .attr("transform", "translate(0,0)")
				 .call(d3.axisLeft(y)
				 				 .ticks(d3.timeMonth)
								 .tickSize(16,0)
								 .tickFormat(d3.timeFormat("%B")));

		//Add Text label for the y-axis
		chart.append("text")
				 .attr("transform", "rotate(-90)")
				 .attr("y", -125)
				 .attr("x", chartHeight/-2+50)
				 .attr("class", "axisLabel")
				 .attr("dy", "2em")
				 .text("Months");
	}

	function getGridColor(temp) {
		if (temp <= 0) 					{ return "gradient11"; }
		else if (temp <= 2.7) 	{ return "gradient10"; }
		else if (temp <= 3.9) 	{ return "gradient9"; }
		else if (temp <= 5) 		{ return "gradient8"; }
		else if (temp <= 6.1) 	{ return "gradient7"; }
		else if (temp <= 7.2) 	{ return "gradient6"; }
		else if (temp <= 8.3) 	{ return "gradient5"; }
		else if (temp <= 9.4) 	{ return "gradient4"; }
		else if (temp <= 10.5) 	{ return "gradient3"; }
		else if (temp <= 11.6) 	{ return "gradient2"; }
		else 										{ return "gradient1"; }
	}


	var colorCodes = ['#f00', '#00f'];


	d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(error, heatData) {
		if (error) throw error;

		x.domain(d3.extent(heatData.monthlyVariance, function(d) { return d.year; }) );
		//x.domain([1753,2016]);
		console.log(d3.extent(heatData.monthlyVariance, function(d) { return d.year; }) );

		console.log("Number of cells: " + heatData.monthlyVariance.length);
		var baseTemp = heatData.baseTemperature;
		var numYears = Math.ceil(heatData.monthlyVariance.length/12);
		//var numYears = heatData.monthlyVariance.length/12;
		console.log("Years: " + numYears);
		var cellWidth = (chartWidth+margin.left+margin.right)/numYears;
		var cellHeight = (chartHeight+margin.top+margin.bottom)/12;
		console.log("chartWidth: " + chartWidth);
		console.log("cell width: "+ cellWidth);

		var cards = chart.selectAll("g")
									 .data(heatData.monthlyVariance)
									 .enter().append("rect")
									 .attr("title", function(d) { return `${d.year} ${d.month}`; })
									 .attr("x", function(d) { return x(d.year); })
									 .attr("y", function(d) { var me = new Date('2016-' + (d.month) + '-01'); return y(me); })
									 .attr("height", cellHeight)
									 .attr("class", function(d) { return getGridColor(baseTemp + d.variance); })
									 .attr("width", cellWidth)
									 .on("mouseover", function() {
										 console.log(d3.select(this).datum());
									 });
		buildXAxis(x);
		buildYAxis(y);
		});

});
