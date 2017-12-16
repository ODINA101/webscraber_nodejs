const phantom = require('phantom');
var fs = require('fs');
var bodyParser = require('body-parser')
var jsonfile = require('jsonfile')
var file = 'output.json';
var next = require('./next');
var express = require('express');
var app = express();
var request = require('request');
var fs = require('fs');
var obj;

var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.set('view engine','ejs');



var dat1 = {name:'',videoSD:'',videoHD:'',des:'',imdb:'',photo:''}


app.get('/',(req,res)=>{
  res.render('index',dat1);
});

app.get('/clipboard.js',(req,res)=>{
  res.sendFile(__dirname + '/views/clipboard.js');
});

app.post('/',urlencodedParser,function(req,res){
  console.log(req.body);
  (async function() {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', function(requestData) {
      console.info('Requesting', requestData.url);
    });
    var dat = {name:'',videoSD:'',videoHD:'',des:'',imdb:'',photo:''}
    const status = await page.open(req.body.url);
    const content = await page.property('content');
    page.evaluateJavaScript('function() { return document.querySelector(\'#left-info > .cont > .title\').innerHTML; }').then(function(html){
  dat1.name = html;
  });
  page.evaluateJavaScript('function() { return document.querySelector(\'#right-movie-block\').querySelector(\'.text > p\').innerHTML;}').then(function(html){
    dat1.des = html.trim();
    });
    page.evaluateJavaScript('function() { return document.querySelector(\'.imdb\').innerHTML;}').then(function(html){
      dat1.imdb = html;
      });
      
      page.evaluateJavaScript('function() { return document.getElementById(\'left-movie-block\').querySelector(\'img\').src;}').then(function(html){
        dat1.photo = html;
        });

       
      
  page.evaluateJavaScript('function() { return document.querySelector(\'.typeS\').getElementsByTagName(\'div\')[1].dataset.href; }').then(function(html){
  dat1.videoSD = html;
  dat1.videoHD = html.replace('300','1500');
   
  var json = JSON.stringify(dat1);
  fs.writeFile('output.json', json, 'utf8', function(callback){
      console.log(callback);
  });
      });


      fs.readFile('./output.json','utf8',(err,data)=>{
       obj = JSON.parse(data);
        
    
res.render('index',obj);
      });

  page.render('espn.png');
  
    await instance.exit();
    next.go();
  })();

  
});


 
app.listen(3010);


 

 