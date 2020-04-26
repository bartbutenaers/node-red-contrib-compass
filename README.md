# node-red-contrib-compass
A Node-RED node to convert a degree to a compass point, or the other way around.

## Install

Run the following npm command in your Node-RED user directory (typically ~/.node-red):
```
npm install node-red-contrib-compass
```

## Node usage

The following example flow demonstrates how to convert a degree into a compass point, or a compass point in into a degree:

![Basic flow](https://user-images.githubusercontent.com/14224149/80318468-a35c3100-880a-11ea-8684-8b76de6e289c.png)

```
[{"id":"bec07115.9b64a","type":"compass-point","z":"11289790.c89848","direction":"toCompass","subset":"secondary","language":"en","inputField":"payload","outputField":"payload","name":"","x":620,"y":680,"wires":[["cc38d99.2386a28"]]},{"id":"122e96c9.988c69","type":"inject","z":"11289790.c89848","name":"","topic":"","payload":"270","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":450,"y":680,"wires":[["bec07115.9b64a"]]},{"id":"cc38d99.2386a28","type":"debug","z":"11289790.c89848","name":"Compass point","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","x":830,"y":680,"wires":[]},{"id":"6e6a70de.f4f7e","type":"compass-point","z":"11289790.c89848","direction":"toDegree","subset":"secondary","language":"en","inputField":"payload","outputField":"payload","name":"","x":620,"y":740,"wires":[["f863e65b.64a378"]]},{"id":"bba77ff8.e726","type":"inject","z":"11289790.c89848","name":"","topic":"","payload":"W","payloadType":"str","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":450,"y":740,"wires":[["6e6a70de.f4f7e"]]},{"id":"f863e65b.64a378","type":"debug","z":"11289790.c89848","name":"Degree","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","x":810,"y":740,"wires":[]}]
```

+ Conversion from degree to compass point:
   + The input message needs to contain a degree, which is a number between 0 and 360. 
   + The output message will contain both the compass point and its description (in the selected language).  For example:
      ```
      direction: "NNE"
      description: "Noth-northeast"
      ```
+ Conversion from compass point to degree:
   + The input message needs to contain a compass point (see table of allowed values below). 
   + The output message will contain the degree as a number.
   
## Node properties

### Direction
Specify the direction of the convertion:
+ Degree to compass point
+ Compass point to degree

### Subset
A subset can be used to fine tune the result, when the direction is "degree to compass point".
For example to round to the nearest accepted cardinal direction.

The following subset filters can be selected:
+ ***Cardinal (4):*** Restrict the possible cardinals to the main compass quadrant N, E, S, W.
+ ***Principal (8):*** Extends the 'Cardinal' option to include NE, SE, SW, NW.
+ ***Principal + Secondary (16):*** Extends the 'Principal' to include NNE, ENE, ESE, SSE, SSW, WSW, WNW, NNW.

### Language
The language which needs to be used:
+ In the output message, in case the direction is "degree to compass point".
+ In the input message, in case the direction is "compass point to degree".

Remark: when your language is not supported yet and you want to contribute by creating a translation, please have a look at the files in the [languages](https://github.com/bartbutenaers/node-red-contrib-compass/blob/master/languages/fr.js) folder and share your translation with me.

### Input field
The field name in the input message, that will contain the value that needs to be converted.  By default the input value will be located inside the ```msg.payload``` field.

### Output field
The field name in the output message, that will contain the converted value.  By default the output value will be located inside the ```msg.payload``` field.

## Available cardinal directions
There are 16 major directions available on a compass:

| Name | Legend             |
| ---- | ------------------ |
| N    | North              |
| NNE  | Noth-northeast     |
| NE   | Northeast          |
| ENE  | East-northeast     |
| E    | East               |
| ESE  | East-southeast     |
| SE   | Southeast          |
| SSE  | South-southeast    |
| S    | South              |
| SSW  | South-southwest    |
| SW   | Southwest          |
| WSW  | West-southwest     |
| W    | West               |
| WNW  | West-northwest     |
| NW   | Northwest          |
| NNW  | North-northwest    |
