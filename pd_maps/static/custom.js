window.onload = get_entities;

function get_entities(){
  $.getJSON('/get_entities/', function (entity_list){
    // entity_string = '"' + entity_list.join('","') + '"'; // used for the CartoDB SQL query
    entity_string = replace_and_join (entity_list);
    console.log('el is', entity_list);
    console.log('es is', entity_string);
    initialize_typeahead(entity_list);
    main(entity_string); //note that we are sending entity_string here and not entity_list
  });
}

function main(entity_string) {

  // cartodb.createVis('map', 'http://documentation.cartodb.com/api/v2/viz/2b13c956-e7c1-11e2-806b-5404a6a683d5/viz.json', {
  cartodb.createVis($('#map'), 'http://joffemd.carto.com/api/v2/viz/51ee3b2d-7fbc-4cbd-bed2-a99cd49c76a7/viz.json', {
  // cartodb.createVis('map', 'http://joffemd.carto.com/api/v2/viz/7f7809bd-bef5-473d-bead-290b06c2da62/viz.json', {
      shareable: false,
      // title: true,
      // description: true,
      search: false,
      tiles_loader: true,
      cartodb_logo: false,
      center_lat: 38,
      center_lon: -122,
      zoom: 7,

  })
  .done(function(vis, layers) {
    // layer 0 is the base layer, layer 1 is cartodb layer
    // setInteraction is disabled by default
    console.log(vis.getLayers());
    sql_statement = 'SELECT * FROM prod_california where name in (' + entity_string + ')'
    console.log(sql_statement);
    layers[1].getSubLayer(0).setSQL(sql_statement);
    layers[1].setInteraction(true);
    layers[1].getSubLayer(0).set({ 'interactivity': ['name'] });
    // layers[1].on('featureOver', function(e, latlng, pos, data) {
    // });
    layers[1].on('featureClick', function(e, latlng, pos, data) {
      cartodb.log.log(e, latlng, pos, data);
      render_chart(data.name);
    });
    // add the tooltip show when hover on the point
    vis.addOverlay({
       type: 'tooltip',
       layer: layers[1].getSubLayer(0),
       position: 'top|center',
       fields: [{ name: 'name' }],
       template: '<p>{{name}}</p>',
      //  template: '<p>{% templatetag openvariable %}name{% templatetag closevariable %}</p>', // not using curly brackets directly // https://stackoverflow.com/a/7772192/1526703
     });
    // you can get the native map to work with it
    // var map = vis.getNativeMap();
    // now, perform any operations you need
    // map.setZoom(8);
    // map.panTo([49, -123]);
  })
  .error(function(err) {
    console.log(err);
  });

  //hide the placeholders for charts
  $('#city-heading').hide();
  $('#chart_1').hide();
  $('#chart_2').hide();
}


function render_chart(name) {
    console.log('name is', name);
    // $(window).scrollTop(elem.offset().top).scrollLeft(elem.offset().left);
    $('html,body').animate({ scrollTop: 9999 }, 'slow');
    $('#chart_1').show();
    $('#chart_2').show();
    $('#city-heading').html(name);
    $('#city-heading').show();

     $.getJSON('/plot/'.concat(name), function (chart_data){
       draw_chart(chart_data, name);
     });
   }

function draw_chart(chart_data){

   $('#chart_1').highcharts({
      chart: {type: "column", height: 400, options3d:{enabled:'true', alpha: "10", beta: "10", depth: "80", viewDistance: "20"}},
      title: {text: name + "Projected CalPERS Contributions"},
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

function initialize_typeahead(entity_list) {
 $('#city-selector').typeahead({
     source: entity_list,
     afterSelect: function (item) {
       render_chart(item);
     },
 });
}

function replace_and_join(arr) {
  entity_str = "";
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].replace(/'/g,"''"); // replacing all occurences of ' within a name with '' (to escape single quotes in the sql query) // using regex to replace all
    entity_str += "'" + arr[i] + "'";
    if (i!=(arr.length-1)) { // not appending comma at the end to avoid syntax error
      entity_str += ",";
    }
  }
  return entity_str;
}
