/**
* The soccerTeam.js file implements the SPARQL query to obtain the list of Football Team available
* from DBpedia and display for the user input.
*
* @author  Murtadha Arif Sahbudin & Nur Azmina Mohamad Zamani 
* @version 1.0
* @since   2016-05-16
*/

/**
* This function will display all the list of option of available Football Teams 
* for user input to view the football team's decription.
* SPARQL query is used to obtain this
* this function will return the Football Team names as the output list
*/
function getTeam(){

  var url = "http://dbpedia.org/sparql";
  var query = 'PREFIX dbo: <http://dbpedia.org/ontology/>'+
              'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'+

              'SELECT *'+
              'WHERE{'+
                  '?club a dbo:SoccerClub ;'+
                  'dbo:ground ?grounds;'+   
                  'rdfs:label ?teamName.'+
                  'FILTER('+

                  //get by country
                  'EXISTS {?grounds dbo:location dbr:Spain} ||'+
                  'EXISTS {?grounds dbo:location dbr:Malaysia} ||'+
                  'EXISTS {?grounds dbo:location dbr:United_Kingdom} ||'+
                  'EXISTS {?grounds dbo:location dbr:Italy} ||'+
                  'EXISTS {?grounds dbo:location dbr:Germany} ||'+ 
                  'EXISTS {?grounds dbo:location dbr:France} ||'+ 
                  'EXISTS {?grounds dbo:location dbr:Brazil} ||'+ 
                  'EXISTS {?grounds dbo:location dbr:Greece} ||'+ 
                  'EXISTS {?grounds dbo:location dbr:England} ||'+ 
                  'EXISTS {?grounds dbo:location dbr:Rusia} ||'+ 

                  //add more detail by english league
                  'EXISTS { ?club dbo:league [rdfs:label "Premier League"@en] } ||'+
                  'EXISTS { ?club dbo:league [rdfs:label "Football League One"@en] } ||'+
                  'EXISTS { ?club dbo:league [rdfs:label "Football League Two"@en] } ||'+
                  'EXISTS { ?club dbo:league [rdfs:label "National League (division)"@en] } ||'+
                  'EXISTS { ?club dbo:league [rdfs:label "National League North"@en] } ||'+
                  'EXISTS { ?club dbo:league [rdfs:label "Northern Premier League Premier Division"@en] } ||'+
                  'EXISTS { ?club dbo:league [rdfs:label "Football League Championship"@en] } ||'+

                  //famous world football league
                  'EXISTS { ?club dbo:league [rdfs:label "La Liga"@en] } ||'+
                  'EXISTS { ?club dbo:league [rdfs:label "Serie A"@en] } ||'+
                  'EXISTS { ?club dbo:league [rdfs:label "Bundesliga"@en] }'+
          
                  ').'+
                  'FILTER(langMatches(lang(?teamName),"en"))'+
              '}';
  /**
  * The SPARQL query will then produce output in JSON format and to be displayed on the interface
  * ajax is used to generate the SPARQL query in order to obtain JSON value and display as output
  * @param _data This return the value from the JSON to output on the interface
  */
  var queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
  $.ajax({
          dataType: "jsonp",  
          url: queryUrl,
          success: function( _data ) {
              var results = _data.results.bindings;
              var teamList="";

              for ( var i in results ) 
              {
                teamList += "<option id='t"+i+"' value='"+results[i].teamName.value+"'>" ; 
              }
              document.getElementById("teamName").innerHTML = teamList;
          }
  });
}
document.getElementById("teamName").innerHTML = getTeam();