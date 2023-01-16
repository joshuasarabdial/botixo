var requestPromise = require('request-promise');
const fs = require('fs');
const path = require('path');

/**
 * Uploads a code file to Slack in the form of a code snippet
 * @param botToken The token for the bot user. Note: the bot must have the right permissions to upload files
 * @param filename The name of the file with its extension. This will also be the name of the file if downloaded from slack
 * @param filepath The absolute path to the file
 * @param filetype The type of file. See list of filetypes here: https://api.slack.com/types/file#file_types
 * @param channel The slack channel to post to. Note: the bot user must have access to this channel
 * @throws Error if channel is null/undefined
 * @throws Error if file does not exist or can't be accessed
 * @return promise
 */
module.exports = function(botToken, filename, filepath, filetype, channel)
{
    //check for valid channel argument
    if (!channel) {
        throw new Error("Invalid channel argument");
    }

    const fullFilepath = path.join(filepath, filename);

    //check the file actually exists
    try {
        fs.accessSync(fullFilepath, fs.constants.F_OK);
    } catch (err) {
        throw new Error("The file does not exist");
    }

    const options = {
        method: 'POST',
        url: 'https://slack.com/api/files.upload',
        formData: {
            token: botToken,
            filename: filename,
            filetype: filetype,
            channels: channel,
            file: fs.createReadStream(fullFilepath)
        }
    };

    return requestPromise(options);
};
