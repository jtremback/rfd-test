var d3 = require('d3')
var React = require('react')
var ReactDOM = require('react-dom');
var ReactFauxDOM = require('react-faux-dom')

var Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array
  },
  render: function () {
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var area = d3.svg.area()
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.close); });

    var node = ReactFauxDOM.createElement('svg')
    var svg = d3.select(node)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const data = [{"date":"15-Sep-11","close":"192.96"},{"date":"14-Sep-11","close":"289.30"},{"date":"13-Sep-11","close":"384.62"},{"date":"12-Sep-11","close":"579.94"},{"date":"9-Sep-11","close":"277.48"},{"date":"8-Sep-11","close":"584.14"}]


    data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.close = +d.close;
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");
        
    return node.toReact()
  }
})


function render (data) {
  ReactDOM.render(React.createElement(Chart, {
    data: data
  }), document.getElementById('mount'))
}

d3.tsv('/data.tsv', function (error, data) {
  if (error) {
    throw error
  }

  render(data)
})