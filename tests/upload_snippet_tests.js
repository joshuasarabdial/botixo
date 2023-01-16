const assert = require('assert');
const uploadCodeSnippet = require('../features/helpers/upload_snippet');

describe('upload_snippet file tests', () => {
    const botToken = "xoxb-791085767639-789016982644-n92oQMNQsu5XECm3clTIG4SU"; //bot user made specifically for testing file uploads
    const channel = "CQ8E2QJFR"; //"file_upload_testing" channel on botixo workspace

    const filename = "binary_search.txt";
    const filepath = "code_examples/C";
    const filetype = "c";

    describe('invalid arguments', () => {
        it('null channel is invaild', async () => {
            assert.throws(() => {
                uploadCodeSnippet(botToken, filename, filepath, filetype, null);
            }, new Error("Invalid channel argument"));
        });

        it('not existent file is invaild', async () => {
            assert.throws(() => {
                uploadCodeSnippet(botToken, "not_a_file", "not/a/file/path", filetype, channel);
            }, new Error("The file does not exist"));
        });
    });

    it('file upload is valid', async () => {
        await uploadCodeSnippet(botToken, filename, filepath, filetype, channel)
            .then(function (body) {
                const data = JSON.parse(body);

                assert.strictEqual(data.ok, true);

                const file = data.file ? data.file : null;
                assert.notEqual(file, null);
                assert.strictEqual(file.name, filename);
                assert.strictEqual(file.filetype, filetype);
                assert.strictEqual(file.channels.includes(channel) || file.groups.includes(channel), true);

                //delete the uploaded file
                const request = require('request');
                request.post("https://slack.com/api/files.delete", {
                    form: {
                        token: botToken,
                        file: file.id
                    }
                }, function(error, response) {
                    if (error) {
                        assert.fail("Delete file error: " + error);
                    }

                    assert.strictEqual(JSON.parse(response.body).ok, true);
                });
            });
    });
});
