/**
* The players.js file implements the the SPARQL query to obtain the information for each player of a Football Team
* from DBpedia and display on the interface for Player's Profile page.
*
* @author  Murtadha Arif Sahbudin & Nur Azmina Mohamad Zamani
* @version 1.0
* @since   2016-05-16
*/

window.getUrlVars();

/**
* This function will get all the player's data and saved the values of the data in XML file for RDFa 
* @param urlname This is the URI
* @param name This is the name of player value
* @param position This is the position of the player
* @param number This is the jersey number of the player
* @param birthPlace This is the birth place of the player
* @param birthDate This is the date of birth of the player
* @param abstract This is the information/description of the player
*/
function saveFile(urlname,name,picture,position,number,birthPlace,birthDate,abstract)
{
  
  var xhrSave;  
  var url = '/save-file/'+ urlname+ '/'+ name+ '/'+ position + '/'+ number + '/'+ birthPlace + '/'+ birthDate + '/'+ abstract;  

  //instance of request headers
  xhrSave = new XMLHttpRequest();
  xhrSave.open('GET', url);
  xhrSave.send();
  xhrSave.onreadystatechange = function() 
  {
    //check on server respond status OK then start processing the JSON obejcts
    if (this.status == 200 && this.readyState == 4) 
    {
      console.log("write XML file")
    }
    //handling for bad response form server 
    else if (this.status == 404){ 
      showAlertDiv('404 - Oops. Something went wrong in DB.');
    }
  };
 
  return xhrSave;
}

/**
* This function obtains the player name as the URL key and pass the data value onto XML file on a new web page/window location
*/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
    });
    return vars;
}

var urlname = getUrlVars()["playerName"];
var playerName = decodeURIComponent(urlname);
   
getPlayer(urlname,playerName);

/**
* This function will retrieve and send the players information to the HTML page 
* based on the player's name clicked.
* @param name This return the players information regarding the player selected to be viewed (based on the name)
* The information to be displayed for each player are:
* 1) ?player1 rdfs:label ?player. is the player name
* 2) ?player1 dbo:thumbnail ?picture. is the picture of the player
* 3) ?player1 dbo:position [rdfs:label ?position]. is the position of the player
* 4) ?player1 dbp:birthDate ?dob. is the date of birth of the player 
* 5) ?player1 dbp:birthPlace [rdfs:label ?birthPlace]. is the place of birth of the player
* 6) ?player1 dbo:abstract ?abstract. is the description of the player
* 7) ?player1 dbo:number ?number. is the jersey number of the player
*/
function getPlayer(urlname,name){
  var url = "http://dbpedia.org/sparql";
  var query = ' PREFIX dbp: <http://dbpedia.org/property/>'+ 
             'PREFIX dbo: <http://dbpedia.org/ontology/>'+ 
             'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'+
             'PREFIX foaf: <http://xmlns.com/foaf/0.1/>'+

            'SELECT * WHERE'+
            ' {'+
            '?player1 rdfs:label "'+name+'"@en .'+
            
            'OPTIONAL{?player1 dbo:thumbnail ?picture.} '+
            'OPTIONAL{?player1 dbo:position [rdfs:label ?position]. }'+      
            'OPTIONAL{?player1 dbp:birthDate ?dob. }'+
            'OPTIONAL{?player1 dbp:birthPlace [rdfs:label ?birthPlace]. }'+
            'OPTIONAL{?player1 dbo:abstract ?abstract. }'+
            'OPTIONAL{?player1 dbo:number ?number. }'+


            '?player1 rdfs:label ?player. '+

            'FILTER(langMatches(lang(?player),"en"))'+
            'FILTER(langMatches(lang(?position),"en"))'+
            'FILTER(langMatches(lang(?abstract),"en"))'+
            '}';

  /**
   * The SPARQL query will then produce output in JSON format and to be displayed on the interface
   * ajax is used to generate the SPARQL query in order to obtain JSON value and display as output
   * @param _data This return the value from the JSON to output on the interface
   * the player's information will be passed to a new window of player.html by @param name
   */    
  var queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
  $.ajax({
          dataType: "jsonp",  
          url: queryUrl,
          success: function( _data ) {
              var results = _data.results.bindings;
              var playerInfo="";
              var name = "none";
              var picture = "none";
              var position = "none";
              var abstract = "none";
              var birthPlace = "none";
              var birthDate = "none";
              var number = "none";

              for ( var i in results ) 
              {

                name = results[i].player.value;
                picture =results[i].picture.value;
                position =results[i].position.value;

                if (typeof results[i].abstract != "undefined") {
                  
                  abstract = results[i].abstract.value;
                }
                else{
                  abstract = abstract;
                }

                if (typeof results[i].birthPlace != "undefined") {
                  
                  birthPlace = results[i].birthPlace.value;
                }
                else{
                  birthPlace = birthPlace;
                }
                
                birthDate = results[i].dob.value;
                number = results[i].number.value;

              }
              var link = "page/"+urlname+".xml";
              document.getElementById("xmlLink").innerHTML = "<a href='"+link+"' target='_blank'>XML RDFa format</a>";
              document.getElementById("name").innerHTML = name;
              document.getElementById("picture").innerHTML = "<img src='" + picture + "'>";
              document.getElementById("position").innerHTML = position;
              document.getElementById("number").innerHTML =  number;
              document.getElementById("birthPlace").innerHTML = birthPlace;
              document.getElementById("birthDate").innerHTML = birthDate;
              document.getElementById("abstract").innerHTML = abstract;
           
              saveFile(urlname,name,picture,position,number,birthPlace,birthDate,abstract);
              
          }
      });

}
