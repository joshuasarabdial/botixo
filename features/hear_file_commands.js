/**
 * Brings up common algortihms quickly from the bot's local files.
 * Looks up specific programming language specified.
 * Includes: C, Java, Javascript, and Python 
 */

module.exports = function (controller) {

    controller.hears('getcode *', ['message', 'direct_message'], async (bot, message) => {
        const fs = require('fs'); 
        const formatStr = '```';
        let text = message.text.split(" ");

        /**
         * Searches through code_examples folder for algorithms
         * @return Promise<string> algorithm of specific language
         */
        async function getFile() {
            
            let somePromise = new Promise((resolve, reject) => { 
                
                // Searches code_examples for language folder then algorithm file
                fs.readFile('code_examples/' + text[1] + '/' + text[2] + '.txt', (err, data) => { 
                    if (err){
                        if(text[1].toUpperCase() != "JAVA" && text[1].toUpperCase() != "C" && text[1].toUpperCase() != "JAVASCRIPT" && text[1].toUpperCase() != "PYTHON"){
                           resolve("Invalid Language Input. Valid languages are C, JavaScript, Java, and Python.");
                        }
                        resolve("Invalid Algorithm Input.");    
                    } 
                    else{
                        resolve(data.toString());
                    }
                });
                
            });    

            return somePromise;
        }
      
        getFile().then(async (value) => {
            // Add slack formatting
            const formattedStr = formatStr + value + formatStr;
            await bot.changeContext(message.reference);
            await bot.say(formattedStr);
        });  
      
    });   

    controller.hears('linkcode *', ['message', 'direct_message'], async (bot, message) => {
        const fs = require('fs'); 
        var text = message.text.split(" ");

        
        async function getFile() {
            
            let somePromise = new Promise((resolve, reject) => { 
        
                fs.readFile('code_directories/' + text[1] + '/' + text[2] + '.txt', (err, data) => { 
                    if (err){
                        if(text[1].toUpperCase() != "JAVA" && text[1].toUpperCase() != "C" && text[1].toUpperCase() != "JAVASCRIPT" && text[1].toUpperCase() != "PYTHON"){
                           resolve("Invalid Language Input. Valid languages are C, JavaScript, Java, and Python.");
                        }
                        resolve("Invalid Algorithm Input.");    
                    } 
                    else{
                        resolve(data.toString());
                    }
                });
                
            });    

            return somePromise;
        }
      
        getFile().then(async (value) => {
            await bot.changeContext(message.reference);
            await bot.say(value);
        });  
      
    });
    
};
