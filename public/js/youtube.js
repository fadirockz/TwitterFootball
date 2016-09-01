/**
* The youtube.js file implements the YouTube videos to be displayed 
* as part of the query results for the additional feature of the whole program
*
* @author  Murtadha Arif Sahbudin & Nur Azmina Mohamad Zamani
* @version 1.0
* @since   2016-04-09
*/

$(function() 
{
	/**
	 * This method is used to submit the query request to obtain the YouTube videos
	 * which displays 10 most viewed videos in YouTube
	 * var search is the jquery of getting the values of the 3 queries - #hashtag, #mentioned and #authorname
	 * var keyword is for the URL encoding to be handled when submitting the request
	 * var request is to get the YouTube data in JSON  
	 * using @param q to get the keyword to search on YouTube
	 * using @param part is to get the title of each videos
	 * using @param type is to get only the videos
	 * using @param viewCount to get only the videos with most views
	 * using @param maxResult to only display the top 10 most viewed videos
	 * @param publishedAfter to retrieve the media after the assigned date and time
	 * @see resetVideoHeight for the method of resizing the size of each videos on Web interface
	 */
    $("form").on("submit", function(e) 
    {
      if($("#hashtag").val() != "" || $("#mentioned").val()!= "" || $("#authorname").val()!="" || $("#anyword").val() != ""){
         e.preventDefault();
         var search = $("#hashtag").val() + $("#mentioned").val() + $("#authorname").val() + $("#anyword").val();
         var keyword= encodeURIComponent(search).replace(/%20/g, "+");
         var request = gapi.client.youtube.search.list({
              q: keyword,
              part: "snippet",
              type: "video",
              order: "viewCount",
              maxResults: 10,
              relevanceLanguage: "en",
              publishedAfter: "2016-01-01T00:00:00Z"
         }); 
      
       request.execute(function(response) 
       {
          var results = response.result;
          $("#results").html("");
          $.each(results.items, function(index, item) 
          {
            $.get("iFrame.html", function(data) 
            {
                $("#results").append(JSONKey(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
            });
          });
          resetVideoHeight();
       });
       }
    });
    
    $(window).on("resize", resetVideoHeight);
});

/**
 * This method implements the height of the displayed videos
 * initial video size is set
 */
function resetVideoHeight() 
{
    $(".video").css("height", $("#results").width() * 9/16);
}

/**
 * This method loads YouTube videos via API
 */
function init() 
{
    gapi.client.setApiKey("AIzaSyBS16EWE5ZdjVOQxIS3EtsGrFrIZbWcfPY");
    gapi.client.load("youtube", "v3", function() {
    });
}

/**
 * This method is to request the YouTube videos
 * @param template This is to get the data in a correct JSON format
 * {@sequence} @return data retrieved
 * @return the @param template as the result retrieved
 */
function JSONKey(template, data) 
{
  res = template;
  for(var i = 0; i < data.length; i++) 
  {
    res = res.replace(/\{\{(.*?)\}\}/g, function(match, j) 
    { 
      return data[i][j];
    })
  }
  return res;
} 