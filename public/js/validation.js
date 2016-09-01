/**
* The vaidation.js file implements the validation of user input into the query boxes
* with exception handling
*
* @author  Murtadha Arif Sahbudin & Nur Azmina Mohamad Zamani
* @version 1.0
* @since   2016-04-09
*/

//alert box
function showAlertDiv(message)
{

  var theAlertDiv;
  theAlertDiv = document.getElementById('alert'); 
  theAlertDiv.classList.remove('collapse');   
  theAlertDiv.innerHTML = message;

}

/**
 * Input Validation
 * to ensure no symbols are allowed in the query input
 * to ensure no spaces are allowed 
 * @exception if there are any symbols being keyed into the query boxes
 * @exception if there is space between the input word in the query boxes
 */ 
document.getElementById('hashtag').addEventListener('keyup', function() 
{
  var field;
  field = document.getElementById('hashtag').value;

  var space; 
  space = field.indexOf(' ');

  var theAlertDiv;
  theAlertDiv = document.getElementById('alert'); 
  theAlertDiv.classList.add('collapse'); 
      
  if (field == '#') 
  {
    showAlertDiv('Please start your query <strong>without</strong> the hashtag'); 
  } 

  if (space !== -1 ) 
  { 
    showAlertDiv('Please do not enter any space, written as one word'); 
  }
});              


document.getElementById('mentioned').addEventListener('keyup', function() 
{
  var field;
  field = document.getElementById('mentioned').value;
  
  var space; 
  space = field.indexOf(' ');

  var theAlertDiv;
  theAlertDiv = document.getElementById('alert'); 
  theAlertDiv.classList.add('collapse'); 
      
  if (field == '@') 
  {
    showAlertDiv('Please start your query <strong>without</strong> the symbol @'); 
  }

  if (space !== -1 ) 
  { 
    showAlertDiv('Please do not enter any space, written as one word'); 
  }        
});              