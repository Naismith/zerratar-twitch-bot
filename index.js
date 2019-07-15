require('dotenv').config();
process.stdin.resume();
process.stdin.setEncoding('utf8');

const TwitchBot = require('twitch-bot');
const state = {
  activeUsers: [],
  activeRaid: false,
  previousTraining: '',
  defaultTraining: 'fishing'
};

const Bot = new TwitchBot({
  username: process.env.username,
  oauth: process.env['twitch-oauth'],
  channels: ['zerratar']
});

function handleBotResponses(chatter) {
  if (chatter.message.includes('raid boss has appeared')) {
    state.activeRaid = true;
    Bot.say('!raid');
  }
  if (state.activeRaid && chatter.message.includes('You found a')) {
    state.activeRaid = false;
    Bot.say(`!train ${state.previousTrain || state.defaultTraining}`);
  }
}

process.stdin.on('data', function(text) {
  Chat.say(text);
  if (text.includes('!train')) {
    state.previousTraining = text.replace('!train ', '');
  }
  if (text.trim() === 'quit') {
    process.exit();
  }
});

function handlePlayerResponses(chatter) {
  if (chatter.message === '!join') {
    state.activeUsers.push({ username: chatter.username });
    // activeUsers.push(chatter.username);
  }
}

Bot.on('message', chatter => {
  switch (chatter.username) {
    case 'zerrabot':
      return handleBotResponses(chatter);
    default:
      return handlePlayerResponses(chatter);
  }
});
