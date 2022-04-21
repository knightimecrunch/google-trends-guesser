var express = require('express');
var router = express.Router();
var app = express();
module.exports = router;
const fetch = require('node-fetch');
var startYear = 1800;
var endYear = 2000;

const regexp = /data=(.*)\]/g;
const regexp1 = /\d.\d+[e]\-\d*|\d.\d/g;
var link;
var title = 'NGRAM Guesser';
var matches = [];

var interleaveResult = new Array();
async function interleave(array1, array2) {
  var result = new Array();
  console.log(typeof array1);
  console.log(typeof array2);
  i, l = Math.min(array1.length, array2.length);
  for (i = 0; i < l; i++) {
    result.push(array1[i], array2[i] + "\n");
  }
  interleaveResult = result
}

async function fetchNgram(phrases) {
  console.log("ngram(", phrases, ")");
  const params = new URLSearchParams();
  params.set('content', phrases.join(','));
  params.set('year_start', startYear);
  params.set('year_end', endYear);
  params.set('corpus', '15');  // English
  params.set('smoothing', '3');
  const response = await fetch('https://books.google.com/ngrams/graph?' + params.toString()); //params applied to url
  link = response.url;
  var responseText = await response.text(); //get n-grams url internal html
  //parse internal html to find "ngrams.data"
  responseText = responseText.replace(/[\r\n\s]+/gm, "");
  var cleanedText = regexp.exec(responseText);
  cleanedText = cleanedText[1].toString(); 

  while((match = regexp1.exec(cleanedText)) !== null) {
    if(typeof match !== "undefined"){matches.push(match.toString()); //match is a list, converted to string before push()
    }
  }  
 
  console.log(matches);
  yearList = []
  for (i = startYear; i < endYear; i++) { //create year list
    yearList.push(i)
  }
  
  interleave(yearList,matches)
  console.log(interleaveResult)
}

function hideData() {
  document.getElementById("data").style.display = "none";
}

fetchNgram(['analingus']);

router.get('/', function(req, res, next) {
  res.render('index', { title: title, link: link, data : interleaveResult});
});