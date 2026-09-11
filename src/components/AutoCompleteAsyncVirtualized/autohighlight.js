const SpecialCharsRegex = /[.*+?^${}()|[\]\\]/g;
const WordCharacterWithRussianRegEx = /[a-zа-я0-9_]/i;
const WhiteSpaceRegEx = /\s+/;

export function escapeRegexCharacters(str) {
  return str.replace(SpecialCharsRegex, '\\$&');
}

export function autoHighLightSpecialMatch(text, query) {
  return query
    .trim()
    .split(WhiteSpaceRegEx)
    .filter(word => word.length > 0)
    .reduce((result, word) => {
      const wordLength = word.length;
      const isMatch = WordCharacterWithRussianRegEx.test(word);

      if (isMatch) {
        const regex = new RegExp(escapeRegexCharacters(word), 'i');
        const index = text.search(regex);

        if (index > -1) {
          result.push([index, index + wordLength]);
          text =
            text.slice(0, index) +
            new Array(wordLength + 1).join(' ') +
            text.slice(index + wordLength);
        }
      }
      return result;
    }, []);
}

export function autoHighLightParse(text, matches) {
  const result = [];

  if (matches.length === 0) {
    result.push({
      text,
      highlight: false,
    });
  } else if (matches[0][0] > 0) {
    result.push({
      text: text.slice(0, matches[0][0]),
      highlight: false,
    });
  }

  matches.forEach((match, i) => {
    const startIndex = match[0];
    const endIndex = match[1];

    result.push({
      text: text.slice(startIndex, endIndex),
      highlight: true,
    });

    if (i === matches.length - 1) {
      if (endIndex < text.length) {
        result.push({
          text: text.slice(endIndex, text.length),
          highlight: false,
        });
      }
    } else if (endIndex < matches[i + 1][0]) {
      result.push({
        text: text.slice(endIndex, matches[i + 1][0]),
        highlight: false,
      });
    }
  });

  return result;
}
