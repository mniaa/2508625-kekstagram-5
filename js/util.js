const DEFAULT_DELAY = 500;

const createDebouncedFunction = (callback, delay = DEFAULT_DELAY) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), delay);
  };
};

const determineCommentEnding = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'комментария';
  }
  return 'комментариев';
};

const mixArrayElements = (elements) => {
  const copiedArray = elements.slice();
  for (let index = copiedArray.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copiedArray[index], copiedArray[randomIndex]] = [copiedArray[randomIndex], copiedArray[index]];
  }
  return copiedArray;
};

export { createDebouncedFunction, determineCommentEnding, mixArrayElements };

