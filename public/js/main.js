/**
* The main.js file implements the process:
* 1. GET query request from user inputs and sets variable
* 2. Construct the URL encoded header for search format to request add app.js
* 3. Set an interval of request for 30 sec for each request query
* 4.
* 
* @author  Murtadha Arif Sahbudin & Nur Azmina Mohamad Zamani
* @version 1.0
* @since   2016-04-09
*/


/**
* Global variables initialization
* @param hashtag value field input twitter hashtag
* @param authorname value field input for all tweet by auhtor
* @param mentioned value field input any auhtor id mentioned in a tweet
* @param anyword value field input ay term/word need to be included
* @param checkboxhash value field input 
* @param checkboxauthor value field input 
* @param myArr raw JSON object from twitter search repond
* @param map initiaite and instance object of google map
* @param sinceID paramter controls the next request need to be retrived
* @param totData total data count of tweet recieved
* @param xhr instance of XMLHttpRequest for request server side
* @param infowindow create and info window for marked location
* @param wordArr contains tokenized word for count
* @param authorArr contains author ranked by top 10 based number of count
* @param authorWord contains tokenized word of ranked auhtor
* @param authorSubArr and extend of auhtor array for processing
* @param stopWord contains list of words to be remove from text
* @param file load external file "stop_list.txt"
* @firstIter iteration control for first load
*/
var hashtag;
var authorname;
var mentioned;
var anyword;
var checkboxhash;
var checkboxauthor;
var resultType;
var myArr;
var map;
var resultDiv
var sinceID = 0;
var totData = 0;
var xhr;
var xhrDB;
var infowindow;
var wordArr = new Array();
var authorArr = new Array();
var authorWord = new Array();
var authorSubArr= null;
var stopWord;
var file = "stop_list.txt"; 
var firstIter;
var tweetCount;
var tweetDBCount;

/**
 * This jquery reads the stop list from text file 
 * This is the stop words in the text file which reads using the "\n" 
 * Then assigns to stopWord
 */
$.get(file,function(txt)
{
  stopWord = txt.split("\n");
}); 

/** 
 * actionListener of getting the query occurs when "Search" button is clicked once query has been input
 * This method is to retrieve input from query boxes
 * @param url This is the GET search/tweets from Twitter REST API
 * to obtain the Twitter data
 * @exception if all query boxes have no inputs
 * @see initMap() This will display the markers for those tweets that use geolocation on the map * 
 * 
 */

document.getElementById('submitButton').addEventListener('click', getQuery);

function getQuery(url)
{
  hashtag = '';
  authorname = '';
  mentioned = '';
  anyword = '';
  checkboxhash = '';
  checkboxauthor = '';
  resultType = '';
  firstIter = 1; 
  requestIter = 0; 
  sinceID = 0;
  totData = 0;
  wordArr = new Array();
  authorArr = new Array();
  vauthorWord = new Array();
  resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';
  tweetCount = 0;
  tweetDBCount = 0;
  getVar();

  //validation for both field empty before processing
  if(hashtag == '' && authorname == '' && mentioned == '' && anyword == ''){
    showAlertDiv('Opps! Please <strong>fill</strong> in at least one field'); 
  }
  else {  
    //self-invoking, recursive function provide request to server side
    if(sinceID==0){
       $.when($.ajax(getRequest())).then(function () {
            if(document.getElementById("cacheDB").checked==true){               
            getRequestDB();
            }
        });
    }

    //initiate first load for google map API     
    initMap();

    //set interval of 30 second of interval
    (function next(){
      setTimeout(function(){
        getRequest();
         next();
      },30000);
    })();
}
 
/**
 * This method is to retrieve Twitter data using Twitter REST API
 * XMLHttpRequest() is used to send a request to the server
 * wordArr is the array to store the words from the tweets. Then, to be counted and sorted for ranking of Top words
 * displayCount() will show the top 20 most used words from the tweets retrieved
 * @return xhr This returns the GET search/tweets function of the query request
 */
function getRequest()
{  
  //construct URL encode header to be request on app.js server side
  //include '#' 'FROM:' '@' with AND/OR operators plus the since ID for controling new stream tweet
  if(authorname=='' && mentioned!=''){
    var url = '/api/search/' +hashtag+' '+checkboxhash+' '+mentioned+' '+anyword+'/'+sinceID+'/'+resultType;
  }
  else if(mentioned=='' && authorname!=''){
    var url = '/api/search/' +hashtag+' '+checkboxhash+' '+authorname+' '+anyword+'/'+sinceID+'/'+resultType;
  }
  else if (authorname=='' && mentioned==''){
    var url = '/api/search/' +hashtag+' '+anyword+'/'+sinceID+'/'+resultType;
  }
  else{
    var url = '/api/search/' +hashtag+' '+checkboxhash+' '+authorname+' '+checkboxauthor+' '+mentioned+' '+anyword+'/'+sinceID+'/'+resultType;
  }

  //instance of request headers
  xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send();
  xhr.onreadystatechange = function() 
  {
    //check on server respond status OK then start processing the JSON obejcts
    if (this.status == 200 && this.readyState == 4) 
    {
      //parse JSON object for deserialization
     myArr = JSON.parse(this.responseText);
     //console.log("original JSON");
     //console.log(myArr);

     infoDBDiv = document.getElementById("dbinfo-results");
     tweetCount+=myArr.statuses.length;
     infoDBDiv.innerHTML = "Live Tweet: "+ tweetCount + "<br>Tweet Cache From DB: " + tweetDBCount;
     
      
      myArr.statuses.reverse();
      sinceID = myArr.search_metadata.max_id_str;

      //send for box tweet display construction
      setTweet(); 

      //send data for author top 10 ranking and word processing count
      //and print out on interface
      if(myArr.statuses.length!=0){
        authorArr.sort();
        authorWord = objCount(authorArr).slice(0,10);
        displaySubCount(subCount(myArr,authorWord),'authorBox','olAuthor',10,authorWord);
      }

      //send for general word count for whole collection
      //and print out on interface
      wordArr.sort();
      displayCount(objCount(wordArr),'analysisBox','olAnalysis',20);      
    }
    //handling for bad response form server 
    else if (this.status == 404){ 
      showAlertDiv('404 - Oops. Something went wrong.');
    }
  };
 }  
  return xhr;
}

/**
* This function will get the data from database
* @param xhrDB instance of XMLHttpRequest for request database (server side)
*/
function getRequestDB()
{  
  var url = '/get-data';  

  //instance of request headers
  xhrDB = new XMLHttpRequest();
  xhrDB.open('GET', url);
  xhrDB.send();
  xhrDB.onreadystatechange = function() 
  {
    //check on server respond status OK then start processing the JSON obejcts
    if (this.status == 200 && this.readyState == 4) 
    {
      //parse JSON object for deserialization
      var JsonArr;
      JsonArr= JSON.parse(this.responseText);

      for (var i=0;i<JsonArr.length;i++){
        $.extend(myArr, JsonArr[i]);
      }
      
      tweetDBCount =  myArr.statuses.length;       
      myArr.statuses.reverse();      

      //send for box tweet display construction
      setTweet(); 

      //send data for author top 10 ranking and word processing count
      //and print out on interface
      if(myArr.statuses.length!=0){
        authorArr.sort();
        authorWord = objCount(authorArr).slice(0,10);
        displaySubCount(subCount(myArr,authorWord),'authorBox','olAuthor',10,authorWord);
      }

      //send for general word count for whole collection
      //and print out on interface
      wordArr.sort();
      displayCount(objCount(wordArr),'analysisBox','olAnalysis',20);      
    }    
    //handling for bad response form server 
    else if (this.status == 404){ 
      showAlertDiv('404 - Oops. Something went wrong in DB.');
    }
  }; 
  return xhrDB;
}

/**
 * This method is to GET the values from the web based on the combination selected of either AND/OR
 * @param no parameter for getVar() function
 */
function getVar()
{
  //GET values from web
  var textHashtag = '';
  var textAuhtorname = '';
  var textMentioned = '';
  var textAnyword = '';


  //get values from radio button for result type require, mixed, rencent or popular
  resultType = $("input[name='resultType']:checked").val();
  
  //encoded URL for '#' as %23
  if(document.getElementById('hashtag').value != ''){
    hashtag = '%23' + document.getElementById('hashtag').value;
    textHashtag = ' #' +  document.getElementById('hashtag').value;
  } 
  
  //added a word FROM: for twitter api return value all tweet by an auhtor
  if(document.getElementById('authorname').value != ''){
    authorname = 'FROM:' + document.getElementById('authorname').value;
    textAuhtorname = ' '+authorname;
  } 
  //encoded URL for '@' as %40     
  if(document.getElementById('mentioned').value != ''){
    mentioned = '%40' + document.getElementById('mentioned').value;
    textMentioned = ' @'+ document.getElementById('mentioned').value;
  } 

  if(document.getElementById('anyword').value != ''){
    anyword = document.getElementById('anyword').value;
    textAnyword = '<strong>ADD </strong>'+ anyword;
  } 
        
  //GET values for AND/OR check boxes
  if(hashtag != ''){
    if(document.querySelector('.checkboxhash:checked')){
      checkboxhash = "AND";
    }
    else{
      checkboxhash = "OR";
    }
  }
        
  if(authorname != ''){
    if(document.querySelector('.checkboxauthor:checked')){
      checkboxauthor = "AND";
    }
    else{
      checkboxauthor = "OR";
    }
  }
  //show in interface of queries combination
  showAlertDiv("Your search:<br>"+' '+textHashtag+' <strong>'+checkboxhash+'</strong> '+textAuhtorname+'<strong> '+checkboxauthor+'</strong> '+textMentioned+' '+textAnyword);
}