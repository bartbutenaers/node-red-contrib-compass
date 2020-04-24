# node-red-contrib-cardinal-direction
A Node-RED node to convert a degree (0 - 360) to a correlated cardinal direction

## Install

Run the following npm command in your Node-RED user directory (typically ~/.node-red):
```
npm install node-red-contrib-cardinal-direction
```

## Node usage

The following example flow demonstrates how to convert a degree into a cardinal direction:

![Basic flow](https://user-images.githubusercontent.com/14224149/80259703-80087900-8686-11ea-9ed1-d87384c69c1f.png)

```
[{"id":"dea0ea23.c44fa8","type":"inject","z":"11289790.c89848","name":"","topic":"","payload":"20","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":670,"y":800,"wires":[["56710712.662768"]]},{"id":"22216adf.a25736","type":"debug","z":"11289790.c89848","name":"Cardinal direction","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":1090,"y":800,"wires":[]},{"id":"56710712.662768","type":"cardinal-direction","z":"11289790.c89848","subset":"full","language":"en","inputField":"payload","outputField":"payload","name":"","x":860,"y":800,"wires":[["22216adf.a25736"]]}]
```

+ The input message needs to contain a degree, which is a number between 0 and 360. 
+ The output message will contain both the cardinal direction and its description (in the selected language).  For example:
   ```
   direction: "NNE"
   description: "Noth-northeast"
   ```

## Node properties

### Subset
A subset can be used to fine tune the result, e.g. to round to the nearest accepted cardinal direction.

The following subset filters can be selected:
+ ***Full:*** All possible cardinal directions can be returned (see extended list below).
+ ***Basic:*** Restrict the possible cardinals to the main compass quadrant N, E, S, W.
+ ***Ordinal:*** Extends the 'Basic' option to include NE, SE, SW, NW.
+ ***Intercardinal:*** Extends the 'Ordinal' to include NNE, ENE, ESE, SSE, SSW, WSW, WNW, NNW.

### Language
The language which is required in the output message.

Remark: when your language is not supported yet and you want to contribute by creating a translation, please have a look at the files in the [languages](https://github.com/bartbutenaers/node-red-contrib-cardinal-direction/blob/master/languages/en.js) folder and share your translation with me.

### Input field
The field name in the input message, that will contain the value that needs to be converted.  By default the input value will be located inside the ```msg.payload``` field.

### Output field
The field name in the output message, that will contain the converted value.  By default the output value will be located inside the ```msg.payload``` field.

## Available cardinal directions
There are 32 cardinal directions available on a compass:

| Name | Legend             |
| ---- | ------------------ |
| N    | North              |
| NbE  | North by East      |
| NNE  | Noth-northeast     |
| NEbN | Northeast by North |
| NE   | Northeast          |
| NEbE | Northeast by East  |
| ENE  | East-northeast     |
| EbN  | East by North      |
| E    | East               |
| EbS  | East by South      |
| ESE  | East-southeast     |
| SEbE | Southeast by East  |
| SE   | Southeast          |
| SEbS | Southeast By South |
| SSE  | South-southeast    |
| SbE  | South be East      |
| S    | South              |
| SbW  | South by West      |
| SSW  | South-southwest    |
| SWbS | Southwest by South |
| SW   | Southwest          |
| SWbW | Southwest by West  |
| WSW  | West-southwest     |
| WbS  | West by South      |
| W    | West               |
| Wbs  | West by North      |
| WNW  | West-northwest     |
| NWbW | Northwest by West  |
| NW   | Northwest          |
| NWbN | Northwest by North |
| NNW  | North-northwest    |
| NbW  | North by West      |
