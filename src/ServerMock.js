import React from "react";
const url = require("url");

async function makeItWait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function APIEndpoint(myUrl) {
  console.log("request received");
  let res = "";
  let exists = false;

    let block = await makeItWait(600);
    const URL = url.parse(myUrl);

    let dirStruct = ["/hello", "/about", "/index", "/images", "/jams"];
    let fileStruct = ["/images/dog","/images/music","/images/popcorn","/jams/saxBlues","/jams/bigBass","/jams/sweaty","/jams/space"];
    if (URL.hostname === "cool.jazz") {
        if(!URL.pathname || URL.pathname==='/'){
            exists=true;
            res="directory";

        }else
        if(dirStruct.includes(URL.pathname)){
            res="directory"
            exists=true;
        }else if(fileStruct.includes(URL.pathname)){
            res="file";
            exists=true;
        }
    } else {
      res = "That is not our domain. Try: https://cool.jazz";
      exists = false;
    }
  

  return { result: res, exists: exists };
}

export default APIEndpoint;
