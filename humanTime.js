function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min + 1;
}

exports.delayedResponse = () => {
  return getRandomInt(10, 60) * 1000;
};

exports.normalResponse = () => {
  return getRandomInt(5, 35) * 1000;
};

exports.fastResponse = () => {
  return getRandomInt(1, 25) * 1000;
};
