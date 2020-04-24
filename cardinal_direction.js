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

    function CompassDirectionNode(config) {
        RED.nodes.createNode(this,config);
        this.language    = config.language;
        this.inputField  = config.inputField;
        this.outputField = config.outputField;
        this.textMap     = new Map();
        
        var node = this;
        
        // Convert the specified subset to the corresponding enum value
        switch (config.subset) {
            case "full":
                // Enables all possible cardinal directions to be retunedt
                node.subset = Compass.CardinalSubset.Full;
                break;
            case "basic":
                // Restricts the possible returned cardinals to N, E, S, W
                node.subset = Compass.CardinalSubset.Basic;
                break;
            case "ordinal":
                // Extends Basic to include NE, SE, SW, NW
                node.subset = Compass.CardinalSubset.Ordinal;
                break;
            case "inter":
                // Extends Ordinal to include NNE, ENE, ESE, SSE, SSW, WSW, WNW, NNW
                node.subset = Compass.CardinalSubset.Intercardinal;
                break;
        }
        
        // Load the descriptions and abbreviations in the specified language
        node.translations = require('./languages/' + node.language + '.js');

        node.on("input", function(msg) {
            var inputValue;
            
            try {
                // Get the input value from the specified message field
                inputValue = RED.util.getMessageProperty(msg, node.inputField);
            } 
            catch(err) {
                node.error("Error getting value from msg." + node.inputField + " : " + err.message);
                return;
            }
            
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
            var result = {
                direction: node.translations.abbreviations[cardinalDirection],
                description: node.translations.descriptions[cardinalDirection]
            }
            
            try {
                // Set the converted value in the specified message field
                RED.util.setMessageProperty(msg, node.outputField, result, true);
            } catch(err) {
                node.error("Error setting value in msg." + node.outputField + " : " + err.message);
            }

            node.send(msg);
        });
    }

    RED.nodes.registerType("cardinal-direction", CompassDirectionNode);
}