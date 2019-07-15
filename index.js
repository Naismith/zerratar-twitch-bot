require('dotenv').config();
const humanTime = require('./humanTime');

process.stdin.resume();
process.stdin.setEncoding('utf8');

const TwitchBot = require('twitch-bot');
const state = {
  isGameActive: null,
  isJoined: false,
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
  if (chatter.message.includes('Ravenfall has not started')) {
    state.isGameActive = false;
  }

  if (chatter.message.includes('Welcome to the game!')) {
    console.log('gameisactive');
    state.isGameActive = true;
    if (!state.isJoined) Bot.say('!join');
  }

  if (chatter.message.includes('raid boss has appeared')) {
    state.activeRaid = true;
    setTimeout(() => Bot.say('!raid'), humanTime.normalResponse());
  }

  if (state.activeRaid && chatter.message.includes('You found a')) {
    state.activeRaid = false;
    setTimeout(
      () => Bot.say(`!train ${state.previousTrain || state.defaultTraining}`),
      humanTime.fastResponse()
    );
  }
}

process.stdin.on('data', function(text) {
  if (text.trim() === 'quit') {
    process.exit();
  }
  Bot.say(text);
  if (text.includes('!train')) {
    state.previousTraining = text.replace('!train ', '');
  }
});

function handlePlayerResponses(chatter) {
  return;
}

Bot.on('message', chatter => {
  switch (chatter.username) {
    case 'zerrabot':
      return handleBotResponses(chatter);
    default:
      return handlePlayerResponses(chatter);
  }
});
