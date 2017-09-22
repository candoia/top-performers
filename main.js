'use strict';
$(window).load(function() {
  let scm = new ColorScheme;
  scm.from_hue(21).scheme('triade').distance(0.1).add_complement(false).variation('pastel').web_safe(true);
  let colors = scm.colors();
  let status = $('#status');
  status.html('Retrieving Repository Metadata');
  let instance = api.instance.get();
  status.html('Running Boa Query');
  let json = api.boa.run('top-performers.boa');


  let canvas = $('#chart-output').get(0).getContext("2d");
  let chartData = [];
  let count = 0;
  status.html('Processing the Data');
  for(let index in json.DEVs) {
    count++;
    $('#numToShow').append(`<option value="${count}"> ${count} </option>`);
    chartData.push({
        label: index,
        value: json.DEVs[index],
        color: '#' + _.sample(colors)
    });
  }

  $('#numToShow').change(function() {
    $('#output').html('<canvas id="chart-output"> </canvas>');
    canvas = $('#chart-output').get(0).getContext('2d');
    display($('#numToShow').val());
  });
  status.html('Preparing Data');
  chartData = _.sortBy(chartData, function(line) {
    return Number(-line.value);
  });

  $('#loading').hide();
  $('#content').show();

  display(1);

  $('#app-title').html(`Number of Commits per Developer on ${instance.repos.name}`);

  function display(num) {
    let limitedData = _.first(chartData, num);

    $('#table-output-body').html('');
    _.each(limitedData, function(element, index, list) {
      let num = index + 1;
      $('#table-output-body').append(`<tr><td> ${num} </td> <td> ${element.label} </td> <td> ${element.value} </td> </tr>`)
    });

    let outputChart = new Chart(canvas).Pie(limitedData, {responsive: true});
  }

});
