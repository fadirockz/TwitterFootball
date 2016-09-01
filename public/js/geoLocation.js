/**
* The geoLocation.js file implements the locations to be displayed on map
* showing the markers of each location on the map
*
* @author  Murtadha Arif Sahbudin & Nur Azmina Mohamad Zamani
* @version 1.0
* @since   2016-04-09
*/

/**
 * This method is used to initialize the map display on web interface
 * @param of GOOLE map API{center|zoom|minZoom|mapTypeID|scrollwheel|navigationControl|mapTypeControl|scaleControl|draggable} 
 * the coordinate of the map is needed and UK is set to be the center initially
 * the function allows the map to be controllable such as zooming and dragging
 */
function initMap()
{
	map = new google.maps.Map(document.getElementById('map-canvas'), 
	{
        center: new google.maps.LatLng(53.3280601, -1.3460479), //UK in the center
        zoom: 2,
        minZoom: 2, 
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: true,
        navigationControl: true,
        mapTypeControl: true,
        scaleControl: true,
        draggable: true
    });  
}  

/** This method enables the location markers to be displayed on the map
 *  @param geoLat This is the latitude for the coordinate
 *  @param geoLng This is the longitude for the coordinate
 *  @param resultsMap This is the marker to be shown on map
 *  @param html This is the display of the map
 *  var marker uses Google Map API with @param {position|map|icon}
 *  @param position This is the coordinate of where the marker will be placed
 *  @param map This is to show the whole map obtain from @param resultsMap
 *  @param icon This is the image of the marker
 *  @return bindInfoWindow @param {marker|resultsMap|infowindow|html} This returns the result on the map interface
 */

function mapMarker(geoLat,geoLng,resultsMap,html)
{ 
     var marker = new google.maps.Marker(
     {
        position: 
        {
          lat: geoLat, 
          lng: geoLng
      	},
        map: resultsMap,
        icon: 'iconmap2.png'
    });

    bindInfoWindow(marker, resultsMap, infowindow, html);
} 

/** 
 * This method is to convert addresses into latitude and longitude
 * reverse geocoding for place retrive from twitter and request LAT/LNG from google 
 * @param placeName This is the address retrieved from Tweet data
 * @param geocoder This is the converted address into coordinates
 * @param resultsMap This is the marker to be shown on the map
 * @param html This is the display of the map
 * 
 * @exception to check the geocoder status with @param address and @param {function} results and status
 * Display status if status not OK
 */
function geocodeAddress(placeName,geocoder, resultsMap,html) 
{
	var address = placeName;
  	geocoder.geocode({'address': address}, function(results, status) 
  	{
    	if (status === google.maps.GeocoderStatus.OK) 
    	{      		
      		var marker = new google.maps.Marker(
      		{
        		map: resultsMap,
        		position: results[0].geometry.location,
        		icon: 'iconmap2.png'
      		});

      		bindInfoWindow(marker, resultsMap, infowindow, html);  
    	} 
    	else 
    	{
      		console.log('Geocode was not successful for the following reason: ' + status);
    	}
  	}); 
}
  
/**
 * This method is to display information for the marker 
 * @param informarker This is the information (if any) when action "click" is performed
 * @param map This is the whole map displayed on the interface
 * @param info This is the information description
 * @param html This is the display of the map 
 * 
 * actionlistener is implemented for the "click" action
 * @return the information on click
 */
function bindInfoWindow(infomarker, map, info, html) 
{ 
  	google.maps.event.addListener(infomarker, 'click', function() 
  	{ 
    	info.setContent(html); 
    	info.open(map, infomarker);
  	}); 

  	infowindow =  new google.maps.InfoWindow(
  	{
        content: ''
    });
}
