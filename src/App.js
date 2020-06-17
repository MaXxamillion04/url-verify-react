import React, { useState } from "react";
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

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUrl(value);

    sendToAPI(value);
  };

  function sendToAPI(aURL) {
    if (checkValidURLFormat(aURL)) {
      setMessage("Awaiting response from API...");

      if (isReady) {
        //this boolean is to prevent throttling
        (async () => {
          setIsReady(false);
          setSentURL(aURL);
          let response = await APIEndpoint(aURL);
          console.log(response);

          if (response.exists) {
            setMessage("API Response: " + response.result);
          } else {
            setMessage("URL endpoint does not exist. " + response.result);
          }
          setIsReady(true);
        })();
      } else {
        setMessage("API is busy, click 'resend' in a moment");
      }
    } else {
      setMessage(
        "URL is of an invalid format! try  https://cool.jazz/<some extension>"
      );
    }
  }

  const handleClick = (e) => {
    e.preventDefault();
    sendToAPI(url);
  };

  function checkValidURLFormat(aURL) {
    //const URLRegex=/^https:\/\/.+()/;
    if (aURL === "") {
      console.log("url is null");
      return false;
    }
    //console.log(typeof aURL);
    try {
      /*let preFormat=JSON.stringify(url);
      preFormat=preFormat.replace(/^\[\"/,"");
      preFormat=preFormat.replace(/\"\]$/,"");
      */
      setMyURL(urlCheck.parse(aURL));
      //console.log(myURL);

      if (myURL.hostname) {
        return true;
      }
    } catch (error) {
      //formatted incorrectly
      console.log("url sucks:" + error);
      return false;
    }
    return false;
  }

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <span>Put your URL in here!</span>
        <form>
          <label>
            Try a URL:
            <input
              type="text"
              className="App-input"
              value={url}
              onChange={handleChange}
            />
            <button className="App-input" onClick={handleClick}>
              Resend
            </button>
          </label>
        </form>
        <br />
        <span>{myURL.href}</span>
        <br />
        <br />
        <span>API Info</span>
        <span>URL sent: {sentURL}</span>
        <span>{message}</span>
        <br/>
        <br/>
        <p>scroll down for info on the spoofed server</p>
      </div>

      <p>
        the following urls are valid: <br/>https://cool.jazz/hello<br/>
        https://cool.jazz/about<br/> https://cool.jazz/index<br/> https://cool.jazz/images<br/>
        images: /popcorn /dog /music <br/>
        https://cool.jazz/jams <br/>
        jams: jams/saxBlues, /bigBass, /sweaty, /space
      </p>
    </div>
  );
}

export default App;
