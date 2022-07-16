import * as utils from "../utils";
import { pad } from "../pad";
import * as portAudio from "naudiodon"
const fs = require("fs");


// TODO: IDK install another mic or take auio from mic
// and then use that to get the audio data
// and magically analyze it every 100ms or some shit idk tbh

export const idfk = () => {
    console.log(portAudio.getDevices());
    // Create an instance of AudioIO with inOptions (defaults are as below), which will return a ReadableStream
let ai = portAudio.AudioIO({
    inOptions: {
      channelCount: 1,
      sampleFormat: portAudio.SampleFormat16Bit,
      sampleRate: 44100,
      deviceId: 51, // Use -1 or omit the deviceId to select the default device
      closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
    }
  });
  
  // Create a write stream to write out to a raw audio file
  let ws = fs.createWriteStream('rawAudio.raw');
  
  //Start streaming
  ai.pipe(ws);
  ai.start();
  
};
