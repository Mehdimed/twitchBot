//////////////////////////////////////////////////REFRESH TOKEN////////////////////////////////////////////////////
require("dotenv").config();

const axios = require("axios");
let access_token = ''

const refreshAccessToken = async () => {
  let body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: encodeURI(process.env.REFRESH_TOKEN),
  };

  let res = await axios.post("https://id.twitch.tv/oauth2/token", body);

  let data = res.data;
  console.log(data);
  access_token = data.access_token;

  connect(access_token);
};

//////////////////////////////////////////////////END REFRESH TOKEN/////////////////////////////////////////////////////

//////////////////////////////////////////////////TWITCH CONNEXION////////////////////////////////////////////////////

const connect = async (access_token) => {
  const tmi = require("tmi.js");

  // Define configuration options
  const opts = {
    identity: {
      username: "mylittleadventure",
      password: `oauth:${access_token}`,
    },
    channels: ["mylittleadventure"],
  };

  // Create a client with our options
  const client = new tmi.client(opts);

  // Register our event handlers (defined below)
  client.on("message", onMessageHandler);
  client.on("connected", onConnectedHandler);

  // Connect to Twitch:
  client.connect();

  // Called every time a message comes in
  function onMessageHandler(target, context, msg, self) {
    if (self) {
      return;
    } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim();

    // If the command is known, let's execute it
    if (commandName === "!dice") {
      const num = rollDice();
      client.say(target, `You rolled a ${num}`);
      console.log(`* Executed ${commandName} command`);
    } else {
      console.log(`* Unknown command ${commandName}`);
    }
  }

  // Function called when the "dice" command is issued
  function rollDice() {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }
};

//////////////////////////////////////////////////END TWITCH CONNEXION/////////////////////////////////////////////////////
refreshAccessToken();