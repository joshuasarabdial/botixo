/**
 * A module that brings up manual pages found in OS terminal.
 * 
 * Note: bot must be running on a linux or MAC OS
 */

module.exports = function(controller) {

    controller.hears('man *', ['message', 'direct_message'], async (bot, message) => {

        // parse out the command name
        const messageText = message.text;
        const messageParts = messageText.split(" ");
        const functionName = messageParts[1];
        
        let numLinesString = null;
        let isValidInputNum = false;
        if (messageParts.length > 2) {
            numLinesString = messageParts[2];
            isValidInputNum = !isNaN(numLinesString);
        }
        
        // pipe to col -bx to fix formatting
        // pipe to head -n 15 to return just top of man page
        let numLines = 15;
        if (isValidInputNum == true) {
            numLines = numLinesString;
        }

        const cmdStr = `man ${functionName} | col -bx | head -n ${numLines}`;
        

        // slack formatting 
        const formatStr = '```';

        const { exec } = require('child_process');

        /**
         * Runs terminal command and saves the output
         * @return Promise<string> top 15 lines of man page
         */
        async function runCmd(cmdStr) {

            let execPromise = new Promise((resolve, reject) => 
                exec(cmdStr, (err, stdout, stderr) => {
                    if (!err) { 
                        // exec will either output to stdout or stderr depending on the result
                        // both dont flag the error so you have to check for which output stream
                        const string = stdout.length > stderr.length ? stdout : stderr;
                        resolve(string);
                    } else {
                        reject('invalid');
                    }
                })
            );
            return execPromise;
        }

        runCmd(cmdStr).then(async (value) => {
            const formattedStr = formatStr + value + formatStr;
            await bot.changeContext(message.reference);
            await bot.reply(message, formattedStr); 
        });
    });

};
