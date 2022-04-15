const words = [
  'secretary',
  'imperial',
  'butterfly',
  'board',
  'embrace',
  'grain',
  'ego',
  'legislation',
  'delay',
  'variation',
  'unlikely',
  'soap',
  'ritual',
  'brag',
  'finish',
  'prey',
  'designer',
  'behead',
  'battle',
  'dribble',
  'interference',
  'bench',
  'baby',
  'photography',
  'gasp',
  'remind',
  'winner',
  'loot',
  'folk',
  'sphere',
  'default',
  'celebration',
  'sigh',
  'miracle',
  'population',
  'provision',
  'index',
  'bulb',
  'belt',
  'meadow',
  'challenge',
  'sight',
  'profession',
  'field',
  'trustee',
  'resource',
  'soft',
  'oral',
  'favorable',
  'offspring',
];

const lastChars = [ '.', '?', '!' ];

const getRandomInt = max => Math.floor(Math.random() * max);

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

const generateRandomText = () => {
  let result = '';
  const wordsCount = getRandomInt(6)+1;
  for (let i=0; i< wordsCount; i++) {
    let word = words[getRandomInt(words.length)];
    if (!i) {
      word = capitalizeFirstLetter(word);
    } else {
      word = ` ${word}`;
    }
    result += word;
  }
  result += lastChars[getRandomInt(3)];
  return result;
};

export default generateRandomText;