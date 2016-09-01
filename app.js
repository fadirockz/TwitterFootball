/**
* The app.js file is to connect the Web interface to the localhost
* requiring Twitter access token
*
* @author  Murtadha Arif Sahbudin & Nur Azmina Mohamad Zamani & Fahad Zulfiqar
* @version 1.0
* @since   2016-04-09
*/


/**
 * to get the files from npm install
 * these are the required node_modules
 */
var express = require('express'),
    cors = require('express-cors'),
    path = require('path'),
	  Twit = require('twit'),
    //DB
    assert = require('assert'),
    mongo = require('mongodb'); 
    fs = require('fs');

var url = 'mongodb://arifberg:arifberg@ds030829.mlab.com:30829/twitter';    
var queryRes = '';

/**
 * setting up the Twitter key and access token
 * to access public user accounts when doing the analysis
 */
var T = new Twit({
  consumer_key: 'B3BKl6GAvh9BgGtzlVSx47CYH',
  consumer_secret: 'erAtFcUt81wEY52rp2TYLt8SE8uds5VOTaxWVH1hJISNOp4NIT',
  access_token: '703232913832337408-qE8Ayz8ytQTHKI19Rem3szfwWgKnJXG',
  access_token_secret: 'O7UYcsH88rYuoTP4sxAM0p9ebz8jgjnVM3TokHSQxukXZ'
})


//setting up the port to 3000 on localhost
var app = express();
app.set('port', (process.env.PORT || 3000));
app.use(cors(
{
    allowedOrigins:
    [
        'twitter.com'
    ]
}));

/**
 * This is to fetch the .html file to be displayed on localhost:3000 at the browser
 * @exception fetch error if did not put the correct html
 */
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res)
{
  res.sendFile('index.html');
});
app.get('/api/search/:hashtag/:sinceid/:resultType', function(req, res)
{
  	T.get('search/tweets',
  	{ q: req.hashtag , since_id:req.sinceid , count:100,  result_type:req.resultType },

  	function(err, data, response)
  	{
    	if (err !== null)
    	{
      	res.send({ ok: false, message: 'error while fetching' });
      	console.log('fetch error', err);
    	}
    	else
    	{
     	 res.json(data);
       queryRes = data.search_metadata.query;
       // store data from twitter search to MongoDB if data result more than 0

      if(data.statuses.length!=0 && req.sinceid == 0 ){ 
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          db.collection('twitter-data').insertOne(data, function(err, result) {
            assert.equal(null, err);
            console.log('Item inserted to MongoDB');
            db.close();
          });
        });
      }

    	}
	});
});

//get from MongoDB 
app.get('/get-data', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('twitter-data').find(
      {"search_metadata.query" : queryRes},

      {statuses:1, search_metadata:1, _id:0}

      );
    
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.json(resultArray);
    });
  });
});

/**
* save xml/html file when player name is clicked
* @param urlname This is the URI
* @param name This is the name of player value
* @param position This is the position of the player
* @param number This is the jersey number of the player
* @param birthPlace This is the birth place of the player
* @param birthDate This is the date of birth of the player
* @param abstract This is the information/description of the player
*/ 
app.get('/save-file/:urlname/:name/:position/:number/:birthPlace/:birthDate/:abstract', function(req, res, next) {  
  console.log("here in node.js save file"+req.name);  
  
  var stringWrite = "<?xml version='1.0' encoding='UTF-8'?>"+
  "<playerinfo itemscope='item' itemtype='http://schema.org/Person'>"+
  "<player>"+
    "<name itemprop='name'>"+req.name+"</name>"+
    "<position itemprop='jobTitle'>"+req.position+"</position>"+
    "<jersey itemprop='alternateName'>"+req.number+"</jersey>"+
    "<birthplace itemprop='birthPlace'>"+req.birthPlace+"</birthplace>"+
    "<dob itemprop='birthDate'>"+req.birthDate+"</dob>"+
    "<description itemprop='description'>"+req.abstract+"</description>"+
    "</player>"+
  "</playerinfo>";

  var fileName = "public/page/"+req.name+".xml";

  fs.writeFile(fileName, stringWrite, function (err) {
    if (err) return console.log(err);
  
  });
});

app.param('urlname', function(req, res, next, urlname)
{
  
  req.urlname = encodeURIComponent(urlname);
  next();
  console.log(req.urlname);
});

app.param('name', function(req, res, next, name)
{
  req.name = name;
  next();
  console.log(req.name);
});

app.param('position', function(req, res, next, position)
{
  req.position = position;
  next();
  console.log(req.position);
});

app.param('number', function(req, res, next, number)
{
  req.number = number;
  next();
  console.log(req.number);
});

app.param('birthPlace', function(req, res, next, birthPlace)
{
  req.birthPlace = birthPlace;
  next();
  console.log(req.birthPlace);
});

app.param('birthDate', function(req, res, next, birthDate)
{
  req.birthDate = birthDate;
  next();
  console.log(req.birthDate);
});

app.param('abstract', function(req, res, next, abstract)
{
  req.abstract = abstract;
  next();
  console.log(req.abstract);
});

app.param('sinceid', function(req, res, next, sinceid)
{
  req.sinceid = sinceid;
  next();
  console.log(req.sinceid);
});

app.param('hashtag', function(req, res, next, hashtag)
{
	req.hashtag = hashtag;
	next();
  	console.log(req.hashtag);
});

app.param('resultType', function(req, res, next, resultType)
{
  req.resultType = resultType;
  next();
    console.log(req.resultType);
});

//listening to port
app.listen(app.get('port'), function()
{
  console.log('Node app is running on port', app.get('port'));
});
