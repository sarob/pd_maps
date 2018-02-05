
$(document).ready(function() {
    var url = $(location).attr('href'),
    parts = url.split("/"),
    last_part = parts[parts.length-2];
    name = last_part.replace(/%20/g,' ');
    console.log('name is', name);
    // $(window).scrollTop(elem.offset().top).scrollLeft(elem.offset().left);
    // $('html,body').animate({ scrollTop: 9999 }, 'slow');
    // $('#chart_1').show();
    // $('#chart_2').show();
    $('#city-heading').html(name);
    // $('#city-heading').show();

    $.getJSON('/plot/'.concat(name), function (chart_data){
       draw_chart(chart_data, name);
     });
});

function draw_chart(chart_data){

   $('#chart_1').highcharts({
      chart: {type: "column", height: 400, options3d:{enabled:'true', alpha: "10", beta: "10", depth: "80", viewDistance: "20"}},
      title: {text: "Projected CalPERS Contributions"},
      // type: category' specifies that x axis in the data is actually the category names
      xAxis: {title: {text: "Year"}, type: "category"},
      yAxis: {title: {text: "Projected Contributions ($)"}},
      series: [{ showInLegend: false, name: 'Contributions', data: chart_data.projections }],
      credits: {enabled: false}
      });
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
