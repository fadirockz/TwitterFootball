/**
* The tweetBox.js file implements the Twitter live stream to be displayed 
*
* @author  Murtadha Arif Sahbudin & Nur Azmina Mohamad Zamani
* @version 1.0
* @since   2016-04-09
*/


/*pre-processing twitter text to embed URL for hashtag
    1. var tweetText - Get first text entities.
    2. var hashtagText - nested loop 2nd dimension array for no. of hash tag 
    3. var linkReplace - string replace with embed link of URL to twitter hashtag page
*/
/**
 * This method is to POST the Twitter query request to be displayed on Web interface
 * myArr is an array of Twitter objects consisting of author name, hashtag, text, mention, date and other Twitter features of tweet
 * tweetText holds the value of the Twitter text
 * author name, user profile picture, tweet link to Twitter.com, tweet date and geolocation (if available)
 * will be posted as the display result of Twitter live stream
 * 
 */
function setTweet()
{
  //dynamically create div box twitter based on the JSON size resopnse
  for (var i = 0; i < myArr.statuses.length; i++) 
  {   
    $('<div class="panel collapse tweetBox" style="display: inline-block;"><div class="left" id="' + totData + '"></div></div>').prependTo("#result").hide().slideDown(800);
      
    var tweetText;
    tweetText = myArr.statuses[i].text;
               
    wordArr = wordArr.concat(wordToken(myArr,i));
    authorArr = authorArr.concat(authorToken(myArr,i));
    tweetText = urlText(tweetText,i);

    //tweet username
    var username;
    username = myArr.statuses[i].user.screen_name;

    //tweet author name
    var auhtorName;
    auhtorName = myArr.statuses[i].user.name;

    var tweetId;      
    tweetId = myArr.statuses[i].id_str;

    var tweetLink;
    tweetLink = "https://twitter.com/" + username + "/status/" + tweetId;
    tweetLink = "<a href=" + tweetLink + " target='_blank'>" + "<i class='fa fa-twitter fa-lg'> </i>Original Link</a>&nbsp<br>"

    var tweetProfilePic;
    tweetProfilePic = myArr.statuses[i].user.profile_image_url;

    var tweetProfileInfo;
    tweetProfileInfo = '<div class="boxer"><div class="box-row"><div class="box"><img src="'+ tweetProfilePic
                                                                +'"></div><div class="box"><strong> '+ auhtorName
                                                                +' </strong><br><a href="https://twitter.com/'+ username +'" target="_blank">@'+ username
                                                                + '</a></div></div></div>';

    var tweetDate;        
    tweetDate = '<div class="boxerBottom"><div class="boxBottom-row"><div class="boxTop">' + tweetLink + '</div><div class="boxBottom">' +
                            myArr.statuses[i].created_at + '</div></div></div>';
    tweetDate = tweetDate.replace('+0000', '');
                 
    var geoLng;
    var geoLat;
    var geo;
    var place;     
    var tweetDiv;
    var tweetPlace;

    tweetDiv = document.getElementById(totData);
                
    totData ++;

    geo = myArr.statuses[i].geo;
    place = myArr.statuses[i].place;
                
    if(geo != null)
    {
      geoLat = myArr.statuses[i].geo.coordinates[0];
      geoLng = myArr.statuses[i].geo.coordinates[1];
      tweetDiv.innerHTML = tweetProfileInfo + tweetText + "<br>" +tweetDate;  
      mapMarker(geoLat,geoLng,map,tweetDiv.innerHTML);
    }
    else if(place != null)
    {
      placeName = myArr.statuses[i].place.full_name;
      var geocoder = new google.maps.Geocoder();
      tweetPlace = '<div class="boxerBottom"><div class="boxBottom-row"><div class="boxTop">' + placeName + '</div></div></div>'
      tweetDiv.innerHTML = tweetProfileInfo + tweetText + tweetPlace + "<br>" +tweetDate;   
      geocodeAddress(placeName,geocoder, map,tweetDiv.innerHTML);
      place=null;
      tweetPlace = '';
    }
    else
    {
      tweetDiv.innerHTML = tweetProfileInfo + tweetText + tweetDate; 
    }
   // document.getElementById("1").innerHTML("fahad");
  }
} 

/**
 * This method implements the preprocessing of handling hashtag link embedded in Twitter text
 * @param text This is the tweet text
 * @param i This is the index of the object array myArr
 * @return the text
 * 
 */
function urlText(text,i)
{  
  for (var n = 0; n < myArr.statuses[i].entities.hashtags.length; n++)
  {                
    var hashtagText = myArr.statuses[i].entities.hashtags[n].text;
    var hashtagNew = '#' + myArr.statuses[i].entities.hashtags[n].text;
    var str = text;
    var linkReplace = '<a href="https://twitter.com/hashtag/'+hashtagText+'?src=hash" target="_blank">'+ hashtagNew + '</a>'; 
    text = str.replace(hashtagNew, linkReplace);
  }

  for (var n = 0; n < myArr.statuses[i].entities.user_mentions.length; n++) 
  {
    var auhtorText = myArr.statuses[i].entities.user_mentions[n].screen_name;
    var authorNew = '@' + myArr.statuses[i].entities.user_mentions[n].screen_name;
    var linkReplace1 = '<a href="https://twitter.com/' + auhtorText + '" target="_blank">' + authorNew + '</a>';
    text = text.replace(authorNew, linkReplace1);
  }

  //external link
  for (var n = 0; n < myArr.statuses[i].entities.urls.length; n++) 
  {
    var urlNew = myArr.statuses[i].entities.urls[n].url;
    var linkReplace2 = '<a href="'+ urlNew + '" target="_blank">' + urlNew + '</a>';
    text = text.replace(urlNew, linkReplace2);
  }

  //media link
  if(myArr.statuses[i].entities.hasOwnProperty('media')==true)
  {
    for (var n = 0; n < myArr.statuses[i].entities.media.length; n++) 
    {
      var mediaNew = myArr.statuses[i].entities.media[n].url;
      var linkReplace3 = '<a href="'+ mediaNew + '" target="_blank">' + mediaNew + '</a>';
      text = text.replace(mediaNew, linkReplace3);
    }
  } 
  
  return text;
}

$(function () {
    $("#clickme").click(function () {
        if($(this).parent().hasClass("popped")){
        $(this).parent().animate({right:'-280px'}, {queue: false, duration: 500}).removeClass("popped");
    }else {
        $(this).parent().animate({right: "0px" }, {queue: false, duration: 500}).addClass("popped");}
    });
});
