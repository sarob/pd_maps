function render_charts(chart_data){
    $('#agency_heading').html(chart_data.name);
    window.chart_data = chart_data;
    render_projections(chart_data);
    render_assets_liabilities(chart_data);
    window.other_scenarios = false;
}

$("#toggle_scenarios").click(function(){
   if (window.other_scenarios == false) {
       render_projections_with_scenarios(window.chart_data);
       $('#toggle_scenarios').html("Hide other scenarios");
       window.other_scenarios = true;
    }
   else {
      render_projections(window.chart_data);
      $('#toggle_scenarios').html("Show other scenarios");
      window.other_scenarios = false;
    }
});

function render_projections(chart_data){
  $('#chart_1').highcharts({
     chart: {type: "column", height: 400, options3d:{enabled:'true', alpha: "10", beta: "10", depth: "80", viewDistance: "20"}},
     title: {text: "Projected CalPERS Contributions"},
     // type: category' specifies that x axis in the data is actually the category names
     xAxis: {title: {text: "Year"}, type: "category"},
     yAxis: {title: {text: "Projected Contributions ($)"}},
     series: [{ showInLegend: false, name: 'Contributions', data: chart_data.projections }],
     credits: {enabled: false}
     });
}

function render_assets_liabilities(chart_data){
  $('#chart_2').highcharts({
     chart: {type: "column", height: 400, options3d:{enabled:'true', alpha: "10", beta: "10", depth: "80", viewDistance: "20"}}, // "alpha": "15", "beta": "15", "depth": "50", "viewDistance": "25"}},
     title: {text: "Projected CalPERS Assets and Liabilities"},
     // type: category' specifies that x axis in the data is actually the category names
     xAxis: {categories: ['Assets', 'Liabilities']},
     yAxis: {title: {text: "Projected Contributions ($)"}},
     series: [
       {showInLegend: true, name: 'Unfunded Liabilities', data: chart_data.unfunded_liabilities},
       {showInLegend: true, name: 'Others', data: chart_data.others}
     ],
     plotOptions: { column: { stacking: 'normal'} },
     credits: {enabled: false}
     });
}

function render_projections_with_scenarios(chart_data){
    $('#chart_1').highcharts({
       chart: {type: "column", height: 400, options3d:{enabled:'true', alpha: "10", beta: "10", depth: "80", viewDistance: "20"}}, // "alpha": "15", "beta": "15", "depth": "50", "viewDistance": "25"}},
       title: {text: "Projected CalPERS Contributions"},
       // type: category' specifies that x axis in the data is actually the category names
       xAxis: {title: {text: "Year"}, type: "category"},
       yAxis: {title: {text: "Projected Contributions ($)"}},
       series: [
          {showInLegend: true, name: 'Best Case', data: chart_data.best_cases},
          {showInLegend: true, name: 'Expected', data: chart_data.projections},
          {showInLegend: true, name: 'Worst Case', data: chart_data.worst_cases}
        ],
       plotOptions: { column: { stacking: 'normal'} },
       credits: {enabled: false}
      });
}
