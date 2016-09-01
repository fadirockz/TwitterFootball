/**
* The journalist.js file implements the SPARQL query to obtain the information for each Football Team
* from DBpedia and display on the interface.
*
* @author  Murtadha Arif Sahbudin & Nur Azmina Mohamad Zamani & Fahad Zulfiqar
* @version 1.0
* @since   2016-05-16
*/

/**
* This function will get the query from user input of which Football team to view the information.
* @param result This return the SPARQL query to obtain the following information on the Football Team:
* 1) ?team dbo:abstract ?abstract. is the description of the Football Team
* 2) ?team dbp:name ?player1. is the players of the particular Football Team
* 3) ?stadium1 dbo:thumbnail ?stadium_pic. is the image of the Home Stadium of the Football Team
* 4) ?stadium1 dbo:abstract ?stadium_desc. is the description of the Home Stadium of the Football Team
* 5) ?manager1 dbo:thumbnail ?manager_pic. is the image of the manager of the Football Team
* 6) ?player1 dbo:thumbnail ?picture.  is the image of the players of the Football Team
* 7) ?player1 dbo:position [rdfs:label ?position]. is the position of the players of the Football Team
* 8) ?player1 dbp:birthDate ?dob. is the date of birth of the players of the Football Team
* 9) ?team dbp:ground ?stadium1. is the name of the Home Stadium of the Football Team
* 10) ?team dbp:manager ?manager1. is the name of the manager of the Football Team
*/
function getSparql(result){
  var team;

  if(result == "result1"){
    team = "team1";
  }
  else{
    team = "team2";
  }

  var resultDivJournal;
  var totData1 = 1;  
  var team1 = document.getElementById(team).value;
  
  resultDivJournal = document.getElementById(result);
  resultDivJournal.innerHTML = '';

  var url = "http://dbpedia.org/sparql";
  var query = ' PREFIX dbp: <http://dbpedia.org/property/>'+ 
             'PREFIX dbo: <http://dbpedia.org/ontology/>'+ 
             'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'+
             'PREFIX foaf: <http://xmlns.com/foaf/0.1/>'+

            'SELECT * WHERE'+
            ' {'+
            '?team rdfs:label "'+team1+'"@en .'+

            'OPTIONAL { ?team dbo:abstract ?abstract. } '+
            'OPTIONAL { ?team dbp:name ?player1. }'+

            '?stadium1 dbo:thumbnail ?stadium_pic. '+
            '?stadium1 dbo:abstract ?stadium_desc. '+

            '?manager1 dbo:thumbnail ?manager_pic.'+

            '?player1 dbo:thumbnail ?picture.  '+
            '?player1 dbo:position [rdfs:label ?position]. '+
            '?player1 dbp:birthDate ?dob. '+

            '?team dbp:ground ?stadium1. '+
            '?stadium1 rdfs:label ?stadium. '+
            '?team dbp:manager ?manager1. '+
            '?manager1 rdfs:label ?manager. '+
            '?player1 rdfs:label ?player. '+

            'FILTER(langMatches(lang(?stadium_desc),"en"))' +
            'FILTER(langMatches(lang(?abstract),"en"))'+
            'FILTER(langMatches(lang(?manager),"en"))'+
            'FILTER(langMatches(lang(?stadium),"en"))'+
            'FILTER(langMatches(lang(?player),"en"))'+
            'FILTER(langMatches(lang(?position),"en"))'+
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

          //to display all the players data
          for ( var i in results ) {
            $('<div class="panel collapse journalistBox" style="display: inline-block;"><div class="left" id="'+result+'' 
              +totData1 + '"></div></div>').prependTo("#"+result).hide().slideDown(800);
              var profilePicPlayer = results[i].picture.value;
              var playerName = results[i].player.value;
              var position  = results[i].position.value;
              var dateOfBirth = results[i].dob.value;
              var playerNameQ = "'"+playerName+"'"
                  
              var n = playerName.split("/");
                  n = n[n.length - 1];
                  playerName = n;

              var n = position.split("/");
                  n = n[n.length - 1];
                  position = n;
                  
              tweetProfileInfo = '<div class="boxer"><div class="box-row"><div class="box"><img src="'+ profilePicPlayer
                                  +'" width = "100" height = "130"></div><div class="box"><strong><a href="player.html?playerName='+playerName+'" target="_blank">'+ playerName
                                  +' </a></strong><br/> <b>Position:</b>' + position
                                  +' <br/> <b>DOB:</b>' + dateOfBirth
                                  + '</div></div></div>';
              document.getElementById(result+totData1).innerHTML = tweetProfileInfo;
              totData1++;
          }

          //to display stadium information
          var stadiumPic = results[0].stadium_pic.value;            
          var stadiumName = results[0].stadium.value;
          var n = stadiumName.split("/");
              n = n[n.length - 1];
              stadiumName = n;
          var stadiumDesc = results[0].stadium_desc.value;
          $('<div class="panel collapse journalistBox" style="display: inline-block;"><div class="left" id="'+result+'' 
              +totData1 + '"></div></div>').prependTo("#"+result).hide().slideDown(800);
          
          stadiumInfo = '<div class="boxer"><div class="box-row"><div class="box"><img src="'+ stadiumPic
                          +'" width = "100" height = "130"></div><br/><strong><b> Stadium: </b></strong> <br/>'+ stadiumName 
                          + '<br/><i>' + stadiumDesc                                                                                                                                
                          + '</i></div></div>';
          document.getElementById(result+totData1).innerHTML = stadiumInfo;

          //to display manager picture and name
          var managerPic = results[0].manager_pic.value;
          var managerName = results[0].manager.value;

          var n = managerName.split("/");
              n = n[n.length - 1];
              managerName = n;
          $('<div class="panel collapse journalistBox" style="display: inline-block;"><div class="left" id="'+result+'' 
              +totData1 + '"></div></div>').prependTo("#"+result).hide().slideDown(800);
          managerInfo = '<div class="boxer"><div class="box-row"><div class="box"><img src="'+ managerPic
                          +'" width = "100" height = "130"></div><br><strong> Manager: </strong> <br/>'+ managerName                                                                                                                                 
                          + '</div></div>';
          document.getElementById(result+totData1).innerHTML = managerInfo;

          //to display description of the Football Team
          var description = results[0].abstract.value;
          $('<div class="panel collapse journalistBox" style="display: inline-block;"><div class="left" id="'+result+'' 
              +totData1 + '"></div></div>').prependTo("#"+result).hide().slideDown(800);
          document.getElementById(result+totData1).innerHTML = "<h1>"+team1+"</h1>"+description;
              
        }
      });
      totData1++;
}