/**
 * File contents obtained from: https://github.com/gratifyguy/botkit-mock/blob/master/examples/botkit-slack/tests/slack_features_spec.js
 */

const assert = require('assert');
const {BotMock, SlackApiMock} = require('botkit-mock');
const {SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware} = require('botbuilder-adapter-slack');
const fileBeingTested = require('../features/man_features');

async function setTimeoutAsync(timeout = 100) {
    return new Promise((r) => setTimeout(r, timeout));
}

describe('man_features file general-slack', () => {
    const initController = () => {
        const adapter = new SlackAdapter({
            clientSigningSecret: "some secret",
            botToken: "some token",
            debug: true,
        });
        adapter.use(new SlackEventMiddleware());
        adapter.use(new SlackMessageTypeMiddleware());

        this.controller = new BotMock({
            adapter: adapter,
        });

        SlackApiMock.bindMockApi(this.controller);

        fileBeingTested(this.controller);
    };

    beforeEach(() => {
        this.userInfo = {
            slackId: 'user1234',
            channel: 'channel1234',
        };
    });

    describe('controller.ready', () => {
        beforeEach(() => {
            process.env.MYTEAM = {};
            process.env.MYCHAN = 'my channel';
            process.env.MYUSER = 'my user';

            initController();
        });

    });

    describe('on message', () => {
        beforeEach(() => {
            initController();
        });
        it(`should reply "No man page for invalid"`, async() => {
            await this.controller.usersInput([
                {
                    type: 'message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'man invalid',
                            timeout: 500,
                            isAssertion: true,
                        }
                    ]
                }
            ]);
            await setTimeoutAsync(500);
            const reply = this.controller.detailed_answers[this.userInfo.channel][0].text;
            assert.strictEqual(reply, '```No manual entry for invalid\n```');
        });
        
    });

    describe('on message', () => {
        beforeEach(() => {
            initController();
        });
        it(`should reply "PWD manual page entry"`, async() => {
            await this.controller.usersInput([
                {
                    type: 'message',
                    user: this.userInfo.slackId, //user required for each direct message
                    channel: this.userInfo.channel, // user channel required for direct message
                    messages: [
                        {
                            text: 'man pwd',
                            timeout: 500,
                            isAssertion: true,
                        }
                    ]
                }
            ]);
            await setTimeoutAsync(500);            
            const actualData = this.controller.detailed_answers[this.userInfo.channel][0].text;
            // MAC expected data
            // const expectedData = "```\nPWD(1)                    BSD General Commands Manual                   PWD(1)\n\nNAME\n     pwd -- return working directory name\n\nSYNOPSIS\n     pwd [-L | -P]\n\nDESCRIPTION\n     The pwd utility writes the absolute pathname of the current working\n     directory to the standard output.\n\n     Some shells may provide a builtin pwd command which is similar or identi-\n     cal to this utility.  Consult the builtin(1) manual page.\n```";
            
            // Linux Expected data
            const expectedData = "```PWD(1)                           User Commands                          PWD(1)\n\nNAME\n       pwd - print name of current/working directory\n\nSYNOPSIS\n       pwd [OPTION]...\n\nDESCRIPTION\n       Print the full filename of the current working directory.\n\n       -L, --logical\n              use PWD from environment, even if it contains symlinks\n\n       -P, --physical\n```";
            assert.strictEqual(actualData, expectedData);
        });
        
    });

});

// Data obj
// console.log(JSON.stringify(this.controller.detailed_answers));
// TODO: reading data from a file
// var fs = require('fs')
// const filePath = 'tests/man_data/ls.txt';
// const formatStr = '```';
// var testData = formatStr;
// await fs.readFile(filePath, 'utf8', function(err, data) {
//     if (err) throw err;
//     testData += data + formatStr;
// });