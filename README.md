# launchpad-display
A Node.js server for running the Novation Launchpad as an interactive display

## What I've used
- Node.js - obviously (though not really, there are great .NET libs for Launchpad)
- [Lawrence Sans](https://github.com/codeincontext/Lawrence-Sans)
- [launchpad-mini](https://www.npmjs.com/package/launchpad-mini)

## Prerequisites
- Node.js (tested with 16.16.0)
- All requirements for the npm [midi](https://www.npmjs.com/package/midi) package (check for your OS)

## Run
```shell
npm install
npm start
```
## Modes
### Switching
You can switch between the modes by either pressing the buttons on the right side of the Launchpad or by using the API (described later).
In the order of buttons going from top you have:
- Clock
- Controls
- Character
- Draw
### Clock
In this mode Launchpad displays a digital clock. It fits the hour and minutes, as well as a blinking second indicator.  
You can use the 🔼 button to change the font face to:
- classic - 4x3 pixel arabic numbers
- modern - a custom 4x4 symbol set (unintuitive at first)
### Controls
Currently you can control:
- master audio volume
### Character
In this mode you can print to Launchpad a string of characters.  
There are 2 ways to do so:
- clicking on the 🔼 button
  - this will open a prompt in the Node.js terminal for a string input
- using the API

The text will scroll and the characters will be displayed in the Lawrence Sans 8x8 pixel font.

### Draw
Here you can draw anything you want on the main 8x8 grid with the use of the color picker.

Current options:
- clear all
- clear color
- green, amber and red in medium light
- green, amber and red in full

You can chose either of the option form the top row buttons.


## API
This project not only enables interactions with the Launchpad via, well, the Launchpad, but it's also a web server. There are several endpoints that allow you to control the Launchpad.

- `/` - hello world placeholder, for now
- `[GET]` `/clock` - toggles the clock font
- `[POST]` `/mode` - accepts `{mode: <string>}` and changes the mode according to the defined modes (so Clock, Controls, Character etc.)
- `[POST]` `/character` - accepts `{string: <string>}` and optionally `{color: <color>}`, where color is either red, green or amber (default). Will display passed in string in color (if provided).

## Future
- Add photos to this ReadMe
- Audio bars visualizer (was done with C# [here](https://github.com/P3Hi/launchpad-audio-visualizer-for-launchpad-mini), will try something similar)
- A better font than Lawrence Sans
- Non-fixed width font support (it's hardcoded 8 width)
- More clock fonts? Then the API would change from `GET` to `POST` and something like `{font: <string>}`
- API for Draw mode. Perhaps to send over an image?

## Notes
This project is kinda a resulf of "well, I'm not using it much often,w hat else could I do with it?" and then I remembered [Madeon Adventure Machine](https://adventuremachine.4thfloorcreative.co.uk/adventuremachine/) and went "oh, I can use JS".  
Now the aim is to have a fancy pixel display sitting somewhere in the room, so when guests come by they are like "ohh, fancy" and "how do you even read the time off that?".
