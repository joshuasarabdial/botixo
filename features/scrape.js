/**
 * This module is an early stage of a web scrapper used to fetch information on algorithms.
 * Information received from https://rosettacode.org/
 * 
 * Note: Cannnot lookup tasks yet. 
 */

module.exports = function(controller) {
    const rp = require('request-promise');
    const cheerio = require('cheerio');

    controller.hears('lookup *','message,direct_message', async (bot, message) => {
      
        await bot.reply(message, "Looking up code...\n");

        // Parse user message
        const originalMessage = message.text;
        const messageTokens = originalMessage.split(" ");
        const programLanguage = replaceCharacters(messageTokens[1]);

        /**
         * Converts the original language selection from the user to match the special syntax
         * contained in the Rosetta Code's html documents
         * @param1 string the programming language token of user text
         * @return string programming language name with special syntax
         */
        function replaceCharacters(str) {
            let newStr = "";

            for (var i=0; i<str.length; i++) {
                if (str[i] == '*') {
                    newStr += "\\.2A";
                }
                else if (str[i] == '+') {
                    newStr += "\\.2B";
                }
                else if (str[i] == '#') {
                    newStr += "\\.23";
                }
                else {
                    newStr += str[i];
                }
            }

            return newStr;
        }

        /**
         * Requests a html doc from Rosetta Code website and parses the page
         * @return Promise<string> parsed algrothim from request
         */
        async function scrape() {

            // Sets options for request to get the html docs
            let options = {
                uri: 'https://rosettacode.org/wiki/Loops/For',
                transform: function (body) {
                    return cheerio.load(body, {
                        lowerCaseTags: true,
                        lowerCaseAttributeNames: true
                    });
                }
            };

            return rp(options)
                .then(async function ($) {                                        
                    // Gets C code
                    let msg = "Tutorial for Loops/For in ";
                    msg += messageTokens[1] + ":\n```";

                    let content = $("#" + programLanguage).parent().next();

                    // Removes line breaks from the html
                    while (content.html().match("<br>")) {
                        content = cheerio.load(content.html().replace("<br>", '\n'));
                    }

                    msg += content.text() + "```";
                    return msg;
                })
                .catch(function (err) {
                    return "error";
                });

        }
  
        scrape().then(async function(value) {
            await bot.changeContext(message.reference);
            await bot.reply(message,value);  
        });
      
    });
};
