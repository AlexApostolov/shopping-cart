"use strict"
import axios from 'axios';

// Make HTTP request to books API, use port 3001 from server since no need to go through proxy
// and render inside the index.ejs template
function handleRender(req, res) {
  axios.get('http://localhost:3001/books')
    .then(function(response) {
      var myHtml = JSON.stringify(response.data);
      res.render('index', {myHtml});
    })
    .catch(function(err) {
      console.log('#Initial Server-side rendering error', err);
    })
}

module.exports = handleRender;
