/**
 * Copyright 2020 Bart Butenaers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
 module.exports = function(RED) {
    var settings = RED.settings;
    const Compass = require("cardinal-direction");

    function CompassPointNode(config) {
        RED.nodes.createNode(this,config);
        this.direction   = config.direction;
        this.language    = config.language;
        this.inputField  = config.inputField;
        this.outputField = config.outputField;
        this.textMap     = new Map();
                            
        var node = this;
        
        // Convert the specified subset to the corresponding enum value.
        // The "Full" option is not provided anymore in the config screen, since it is not much used and will result in translation issues.
        // (see https://discourse.nodered.org/t/convert-wind-direction-in-degrees-to-cardinal-points/10931/29?u=bartbutenaers)
        switch (config.subset) {
            case "cardinal":
                // Restricts the possible returned cardinals to N, E, S, W
                node.subset = Compass.CardinalSubset.Basic;
                break;
            case "principal":
                // Extends Basic to include NE, SE, SW, NW
                node.subset = Compass.CardinalSubset.Ordinal;
                break;
            case "secondary":
                // Extends Ordinal to include NNE, ENE, ESE, SSE, SSW, WSW, WNW, NNW
                node.subset = Compass.CardinalSubset.Intercardinal;
                break;
        }
        
        // Load the descriptions and abbreviations in the specified language
        node.translations = require('./languages/' + node.language + '.js');
        
        function getKeyByValue(object, value) { 
            for (var prop in object) { 
                if (object.hasOwnProperty(prop)) { 
                    if (object[prop] === value) {
                        return prop; 
                    }
                } 
            }
            return null;
        } 

        node.on("input", function(msg) {
            var inputValue;
            var outputValue;
            
            try {
                // Get the input value from the specified message field
                inputValue = RED.util.getMessageProperty(msg, node.inputField);
            } 
            catch(err) {
                node.error("Error getting value from msg." + node.inputField + " : " + err.message);
                return;
            }
            
            switch(node.direction) {
                case "toCompass": // Degree to Cardinal           
                    if (isNaN(inputValue)) {
                        node.error("The value in msg." + node.inputField + " should be a number");
                        return;
                    }
                    
                    inputValue = parseInt(inputValue);
                    
                    if (inputValue < 0 || inputValue > 360) {
                        node.error("The value in msg." + node.inputField + " should be a number between 0 and 360");
                        return;
                    }
                    
                    // Calculate the cardinal direction as an abbreviation (e.g. N)
                    var cardinalDirection = Compass.cardinalFromDegree(inputValue, node.subset);
                    
                    // Compose the output field in the specified language
                    outputValue = {
                        direction: node.translations.abbreviations[cardinalDirection],
                        description: node.translations.descriptions[cardinalDirection]
                    }
                    break;
                case "toDegree": // Cardinal to degree
                    var englishCardinal = getKeyByValue(node.translations.abbreviations, inputValue);
                    
                    if (englishCardinal == null) {
                        node.error("The value in msg." + node.inputField + " is not a valid cardinal (locale = " + node.language + ").");
                        return;
                    }
                    
                    outputValue = Compass.degreeFromCardinal(englishCardinal);
            }
            
            try {
                // Set the converted value in the specified message field
                RED.util.setMessageProperty(msg, node.outputField, outputValue, true);
            } catch(err) {
                node.error("Error setting value in msg." + node.outputField + " : " + err.message);
            }

            node.send(msg);
        });
    }

    RED.nodes.registerType("compass-point", CompassPointNode);
}