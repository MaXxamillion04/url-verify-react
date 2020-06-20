import React, { useState, useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import APIEndpoint from "./ServerMock";

const urlCheck = require("url");

function App() {
  let [url, setUrl] = useState("");
  let [myURL, setMyURL] = useState(urlCheck.parse(""));
  let [message, setMessage] = useState();
  let [sentURL, setSentURL] = useState();

  let [isReady, setIsReady] = useState(true);
  let [send, setSend] = useState(false);

  let [validURL, setValidURL] = useState(false);

  let APICall;
  const currentURL=useRef(sentURL);
  const validColor=validURL?"green":"red";
  currentURL.current=sentURL;
  const sendRef=useRef(send);
  sendRef.current=send;



  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUrl(value);

    prepareAPICall(value);
  };


  /**
   * useEffect is triggered on every update of the 'send' variable, which is set when a valid URL is detected
   * it is set up to send the current value of URL in the text field, so it should always send the most recently typed value, 
   * aka what you see, and not any previous value that was typed
   */
  useEffect(() => {
    if (send) {
      clearTimeout(APICall);
      

      console.log("pre timeout" + url);
      APICall = setTimeout(() => {
        console.log("send:" + send);
        (async() => {
        let response = await APIEndpoint(currentURL.current);
        console.log(response);
          if(sendRef.current){
        if (response.exists) {
          setMessage("API Response: " + response.result);
        } else {
          setMessage("URL endpoint does not exist. " + response.result);
        }
        setSend(false);
      }
      })();
      }, 750);
    }
  },[send]);


  /**
   * prepareAPICall checks if the input URL is valid, then arms the throttled timer within useEffect, which will send the actual API request when it fires
   */
  function prepareAPICall(aURL) {
    if (checkValidURLFormat(aURL)) {
      setValidURL(true);
      setMessage("Awaiting response from API...");

      setSentURL(aURL);
      setSend(750);

    } else {
      setValidURL(false);
      clearTimeout(APICall);
      setSend(false);
      setMessage(
        "URL is of an invalid format! try  https://cool.jazz/<some extension>"
      );
    }
  }

  function checkValidURLFormat(aURL) {
    //URL formatting lite
    //if it can parse a 'hostname' then the URL is well-formed enough to be considered valid
    //info on this package:
    //https://nodejs.org/api/url.html

    if (aURL === "") {
      console.log("url is null");
      return false;
    }

    try {
      let myURLrn=urlCheck.parse(aURL)
      setMyURL(myURLrn); //parse using URL
      //console.log(myURL);

      let hn = myURL.hostname; //start by detecting hostname
      const matchURL=/\w+\.\w\w+/g;



      if (matchURL.test(myURLrn.hostname)) {
        //if 'hostname' exists, URL is valid and ready to send to server, even if domain is incorrect
        
        console.log("URL set");
        return true;
      }

    } catch (error) {
      //formatted incorrectly
      console.log("url rejected:" + error);
      return false;
    }
    return false;
  }

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <span>Put your URL in here!</span>
        <label>
          Try a URL:
          <input
            type="text"
            className="App-input"
            value={url}
            onChange={handleChange}
          />
        </label>
        <br />
        <span>{message}</span>
        <br />
        <span><div style={{color:validColor}}>[]</div>API Info</span>
        <span>Last URL sent: {sentURL}</span>

        <br />
        <br />
        <p>[scroll down for info on the spoofed server]</p>
      </div>

      <p>
        the following urls are valid: <br />
        https://cool.jazz/hello
        <br />
        https://cool.jazz/about
        <br /> https://cool.jazz/index
        <br /> https://cool.jazz/images
        <br />
        images: /popcorn /dog /music <br />
        https://cool.jazz/jams <br />
        jams: jams/saxBlues, /bigBass, /sweaty, /space
      </p>
    </div>
  );
}

export default App;
