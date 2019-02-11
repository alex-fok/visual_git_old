import React, { Component } from "react";
import {BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

const redirect = (host) => {
  console.log('redirect Reached');
  const currentloc = window.location.origin.concat(window.location.pathname).concat(window.location.hash);
  console.log("AUTH_SERVER: " + host);
  window.location = host + "/login?authorize=1&next=" + encodeURIComponent(currentloc);
}

const tokenIsValid = () => {
  if ("meJWT" in localStorage) {
    var payload = parseJWT(localStorage.getItem('meJWT'));
    if(payload && payload.exp >= new Date().getTime()*.001) return true;
  }
  return false;
};

const parseJWT = (token) => {
  if (token) {
    var base64Url = token.split('.')[1];
    return JSON.parse(window.atob(base64Url.replace('/-/g', '+').replace('/_/g', '/')));
  }
};

const setJWT = (jwtParam) => {
  localStorage.setItem("meJWT", jwtParam ? jwtParam: '');
};

const PrivateRoute = (props) => {
  setJWT(new URLSearchParams(window.location.search).get("jwt"));

  if (tokenIsValid()) {
    props.setAxiosHeader('Bearer ' + localStorage.getItem('meJWT'));
    return (
      <Router>
        {props.children}
      </Router>
    )
  } else {
    redirect(props.host);
  }
};

export default PrivateRoute;