/**
* The textProcess.js file implements the text processing  
* involves tokenisation, capitalisation and removal of stop words
* for counting and ranking of words
*
* @author  Murtadha Arif Sahbudin & Nur Azmina Mohamad Zamani
* @version 1.0
* @since   2016-04-09
*/

/**
 * This method is to get the author screen name
 * @param staturArr This is the list (array) of the Twitter object using Twitter REST API
 * @param i This is the index of the array which represents each author
 * @return the array of author screen names
 */
function authorToken(statusArr,i)
{
  var textArr = statusArr.statuses[i].user.screen_name;
  return textArr;
}

/**
 * This method implements the preprocessing of words from Twitter data retrieved
 * @param staturArr This is the list (array) of the Twitter object using Twitter REST API
 * @param i This is the index of the array which represents each author
 * textArr is an array that stores the Twitter texts tweeted by the authors
 * 
 * urlText gets any URLs retrieved in the text and remove it. Once removed, it is stored into textArr array
 * regex is used to check for special characters in the texts
 * .toLowerCase() is used for capitalisation process to ensure accuracy of the words obtained and avoid duplicate of the same words
 * any stopwords found will be removed
 * @return filtered text
 */
function wordToken(statusArr,i)
{  
  var textArr;
  textArr = statusArr.statuses[i].text;
  
  //1.remove any URL within text
  for (var n = 0; n < statusArr.statuses[i].entities.urls.length; n++) 
  {
    var urlText = statusArr.statuses[i].entities.urls[n].url;
    textArr = textArr.replace(urlText, '');
  }

  //media link
  if(statusArr.statuses[i].entities.hasOwnProperty('media')==true)
  {
    for (var n = 0; n < statusArr.statuses[i].entities.media.length; n++) 
    {
      var mediaNew = statusArr.statuses[i].entities.media[n].url;
      textArr = textArr.replace(mediaNew, '');
    }
  } 

  //2.drop any special characters filter only word 
  var regex = /[a-zA-Z]+/g;
  var filterText = textArr.match(regex);
  
  if(filterText!=null){
    if (filterText.hasOwnProperty('length')==true){

        for (var n = 0; n < filterText.length; n++) 
        {
          filterText[n] = filterText[n].toLowerCase(); //3. capitalisation
        }

        //4. remove stop word 
        for(var i = 0; i < stopWord.length; i++)
        {
          filterText = $.grep(filterText, function(value) 
          {
            return value != stopWord[i]; 
          });
        }
    }
}
  return filterText;
}

/**
 * This method is to count the filtered words
 * @param wordArr This is the array containing filtered words
 * the filtered words are counted to get the frequency of each word
 * @return countObj which returns the sorted words from the most used words to the least used words
 */
function objCount(wordArr)
{   
  var countObj = {
      value: []
  };
   
  var current = null;
  var cnt = 0;

  for (var i = 0; i < wordArr.length; i++) 
  {
    if (wordArr[i] != current)
    {
      if (cnt > 0) 
      {
        countObj.value.push(
        { 
          "Count" : cnt,
          "id"  : current
        });
      }
            
      current = wordArr[i];
      cnt = 1;
    }
    else 
    {
      cnt++;
    }
  }
  
  if (cnt > 0) 
  {
    countObj.value.push(
    { 
      "Count" : cnt,
      "id"  : current
    });
  }

  return countObj.value.sort(function(a,b){return a.Count - b.Count}).reverse(); 
}

/**
 * This method displays the sorted word and word counts on the Web interface
 * only the Top 20 words are displayed
 * @param countObj This is array of filtered words
 * @param divName This return the display name of the users (author)
 * @param olName This return the screen name of the users (author)
 * @param topNo This return the ranking of the users
 * @return the top 20 most frequently used words
 */
function displayCount(countObj,divName,olName,topNo)
{
  var countDiv = document.getElementById(divName);
  var ol = document.getElementById(olName);  
  ol.parentNode.removeChild(ol);
  ol = document.createElement('ol');
  ol.id = olName;  
  
  for(var i=0;i<countObj.length;i++) 
  {
    var li = document.createElement('li'),
    content = document.createTextNode(countObj[i].id+' '+countObj[i].Count);   
    li.appendChild(content);  
    ol.appendChild(li); 

    if(i==topNo-1)
    {
      break;
    }
  }

  countDiv.appendChild(ol);  

  return countObj.slice(0,topNo);
}

/**
 * This function is to display the count of the number of tweets for the most active users
 * @param countObj This return the number of user object 
 * @param divName This return the display name of the users (author)
 * @param olName This return the screen name of the users (author)
 * @param topNo This return the ranking of the users
 * @param authorRank This return the ranking of the users based on the tweet counts (active users)
 */
function displaySubCount(countObj,divName,olName,topNo,authorRank)
{
  var countDiv = document.getElementById(divName);
  var ol = document.getElementById(olName);  
  ol.parentNode.removeChild(ol);
  ol = document.createElement('ol');
  ol.id = olName;  
  
  for(var i=0;i<countObj.value.length;i++) 
  {
    var li = document.createElement('li');
    var br = document.createElement('br');
    var p = document.createElement('p');
    var p1 = document.createElement('p');
    
    var img1 = document.createElement('img');
    img1.src = countObj.value[i].profile_image_url; 
    li.appendChild(img1);
    var name = document.createTextNode('@'+countObj.value[i].screen_name);
    li.appendChild(name); 
    li.appendChild(br);
    var noTweet = document.createTextNode('No of Tweets:'+authorRank[i].Count);
    li.appendChild(p);
    li.appendChild(noTweet);
    li.appendChild(br);
    var content1 = document.createTextNode('most frequent words: ');
    li.appendChild(content1);
    for (var n=0;n<countObj.value[i].words.length;n++) {
      
      content = document.createTextNode(countObj.value[i].words[n].id+'('+countObj.value[i].words[n].Count+'), ');
      li.appendChild(content); 
    } 
    li.appendChild(p1);
    ol.appendChild(li); 

  }
  countDiv.appendChild(ol); 
}

//this function is to group all the texts of each author (Top 10 most active users)
//the steps for this process are as follows:
//1) From the list of Top 10 most active users, gather all the tweets (from the 100 displayed tweets) of each user 
//by concatenating their texts from their different tweet posts
//2) Once all the texts has been grouped to the specific author, the texts are then filtered (preprocessing)
//3) Count the words used by each author
//4) Sort the words accordingly for each author screen name in the Top 10 list of most active users 
function subCount(collArr,auhtorArr)
{ 
	var filterArr ={
    	statuses: []
  	};

  	var filterArrNew ={
    	statuses: []
  	};
  	
  	var combineArr={
    	value: []
  	};
  
  	var resultArr={
    	value: []
  	};
  
  	var j = 0;
 	var h = 0;
 
  //process top 10 auhtor for words count from passed param for main app
	if(authorSubArr==null)
    {
      authorSubArr = collArr.statuses;
    }
    else
    {
      if(collArr.statuses.length!=0)
      { 
        authorSubArr = $.extend(authorSubArr, collArr.statuses);
      }  
      else
      {
        authorSubArr = authorSubArr;
      }
    }
	
  //compare from whole collection with top 10 author and put it in a new array
	for (var n=0;n<auhtorArr.length;n++)
  	{  
    	for(var i=0;i<authorSubArr.length;i++)
    	{
      		if(auhtorArr[n].id == authorSubArr[i].user.screen_name)
      		{
        		filterArr.statuses[j] = authorSubArr[i];
        		j++;
      		}
    	}
  	}

	var filterArrNew = Object.assign({},filterArr);
	filterArrNew.statuses = filterArrNew.statuses.slice(0,auhtorArr.length); 

  //group all the value into a single array location for words that related to and author
	for (var n=0;n<auhtorArr.length;n++)
	{
  		var text = " ";
   		
   		for(var i=0;i<filterArr.statuses.length;i++)
   		{
      		if(auhtorArr[n].id == filterArr.statuses[i].user.screen_name)
      		{
        		filterArrNew.statuses[h].user.screen_name = filterArr.statuses[i].user.screen_name;
        		filterArrNew.statuses[h].user.profile_image_url = filterArr.statuses[i].user.profile_image_url;
        		text = text+" "+filterArr.statuses[i].text;
      		}      
   		}
    	
    	filterArrNew.statuses[h].text = text;
    	text = " ";
    	h++;
 	}

    //tokenis the words and get the number of word ounts 
  	for(var i=0;i<filterArrNew.statuses.length;i++)
  	{
    	var words = wordToken(filterArrNew,i);
    	
    	if(words != null)
    	{
    		combineArr.value.push(
        	{ 
          		"screen_name" : filterArrNew.statuses[i].user.screen_name,
          		"words"  : objCount(words.sort()),
          		"profile_image_url" : filterArrNew.statuses[i].user.profile_image_url
        	});
      	}
    }
  	//return value to main application
  	return combineArr;
}
