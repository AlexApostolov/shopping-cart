"use strict"
import axios from 'axios';
import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
// This method allows you to render react components to a string
import {renderToString} from 'react-dom/server';
// The methods to enable react-router on the server
import {match, RouterContext} from 'react-router';

import reducers from './src/reducers/index';
import routes from './src/routes';

// Make HTTP request to books API, use port 3001 from server since no need to go through proxy
// and render inside the index.ejs template
function handleRender(req, res) {
  axios.get('http://localhost:3001/books')
    .then(function(response) {
      // var myHtml = JSON.stringify(response.data);
      // res.render('index', {myHtml});

      // STEP 1 CREATE A REDUX STORE ON THE SERVER
      const store = createStore(reducers, {'books': {'books': response.data}});
      // STEP 2 GET INITIAL STATE FROM THE STORE
      // Escape scripts tage to mitigate the risk of injection attacks--in addition to front-end form validation
      const initialState = JSON.stringify(store.getState()).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
      // STEP 3 IMPLEMENT REACT-ROUTER ON THE SERVER TO INTERCEPT CLIENT REQUESTS AND DEFINE WHAT TO DO WITH THEM
      const Routes = {
        routes: routes,
        location: req.url
      };
      // Use react-router match method, which accepts 2 params, 1st a configuration object with the routes & requested URLs,
      // 2nd a callback that determines what to do when a route is matched
      match(Routes, function(error, redirect, props) {
        if (error) {
          res.status(500).send("error fullfilling the request");
        } else if (redirect) {
          res.status(302, redirect.pathname + redirect.search)
        } else if (props) {
          const reactComponent = renderToString(
            <Provider store={store}>
              <RouterContext {...props} />
            </Provider>
          )
          res.status(200).render('index', {reactComponent, initialState});
        } else {
          res.status(404).send("Not Found");
        }
      })
    })
    .catch(function(err) {
      console.log("#Initial Server-side rendering error", err);
    })
}

module.exports = handleRender;
