# Slack Botkit Starter Kit

## Installation
1. Download the 'echobotixo' branch.
2. In terminal, locate the echobotixo directory and run 'npm install'.
3. (May need updating) Run 'npm i botkit'. You may need some additional dependencies.

## Creating a Slack app
1. Go to https://api.slack.com/apps, and 'Create New App'. Choose a workspace.
2. On the side bar, click on Bot Users. Give a cool name to your bot and click always show bot online (probably not necessary but havent tested). Click 'Add Bot User'.
3. On the side bar, click on Install App and hit 'Install app'. We'll come back to this later.

## Linking to Slack
Here comes the really annoying part. Botkit docs don't really explain this too well. They tend to mix newer stuff with old deprecated botkit version stuff.
1. You will need to create a tunnel for your application to be exposed to the internet. I went with 'ngrok' but you can choose anything else (ngrok on restart will generate a new url you must replace every time in your slack app).
2. The port number is 8765 (You can change it in the '.env' file). The tunnel application (keep this running in the background) should give you some url. Keep note of that for the next steps.
3. Copy the App Credentials on your Slack app's Basic Information page into your .env file. You can find the Bot Token in the OAuth & Permissions side bar.
4. Also under OAuth & Permissions, click 'Add New Redirect URL'. Type in 'https://<Your-Tunnel-url.xx>/install/auth' (the botkit docs have not been updated to reflect this change in the url, took me forever to figure this out). Click 'Done' and 'Save URLs'.
5. In a new terminal in your directory, run 'npm start'. Now type in 'https://<Your-Tunnel-url.xx>' into your web browser and if everything is working correctly, it shoud display: "This app is running Botkit 4.5.0". Keep the node app running.
6. Back to your Slack app, go to Event Subscriptions in the side bar. Enable them and type in for the Request URL 'https://<Your-Tunnel-url.xx>/api/messages' (Again, they changed this and it's not reflected anywhere in the documentation). It should then verify that the app has responded with the challenge parameter.
7. Further down, we want to add Bot User Events. Type and add 'message.channels' and 'message.im' and click 'Save Changes'.
8. Almost there! Under Manage Distribution, under Embeddable Slack Button hit Add to Slack. It will ask if your bot can join your workspace and on success it should display: "Success! Bot installed.". Alternatively, you can type in 'https://<Your-Tunnel-url.xx>/install' in your web browser and it should work. 
9. Finally, you must add your bot to a channel in your workspace. Click on one of your channels in Slack and type "/invite @my-bot". Now type in "hello" and the bot should respond with "Echo: hello".

### Notes
If you are having trouble working with my repo you may want to install the default botkit slackbot instead.
Make a bot folder then in terminal, type 'npm install -g yo generator bot-kit' then 'yo botkit'.
It will ask you several options. Give the bot a name. Choose Slack as your messaging platform and hit "Enter" for the following options.
It should create a default app with echo features already in it.
Follow the same steps above to connect your bot to Slack.


This is a Botkit starter kit for slack, created with the [Yeoman generator](https://github.com/howdyai/botkit/tree/master/packages/generator-botkit#readme).

To complete the configuration of this bot, make sure to update the included `.env` file with your platform tokens and credentials.

[Botkit Docs](https://botkit.ai/docs/v4)

This bot is powered by [a folder full of modules](https://botkit.ai/docs/v4/core.html#organize-your-bot-code). 
Edit the samples, and add your own in the [features/](features/) folder.

## Unit Tests
1. Run `npm install` to make sure your modules are up to date
1. Run `npm test`, which will run all unit tests from files in the tests directory

## Running the App Using Docker
1. Make sure you have [docker](https://www.docker.com/products/docker-desktop) installed and it is running
1. From the app's root directory, run `docker build -t <image_name> .`, replacing `<image_name>` with the name you want for the image
1. Run `docker run -it <image_name> npm start`

## Production Server Notes
The production server is running on a free-tier Heroku app, found at https://botixo-production.herokuapp.com. Because it is free tier, the server will go to sleep after 30 minutes of inactivity. When this happens, any new requests will cause the server to restart, which takes about 30 seconds. So, if the prod_bot does not respond right away, go to the url above to see if the server is awake. If active, it will display "This app is running Botkit 4.5.0.". If not, wait about 30-seconds for it to load.
