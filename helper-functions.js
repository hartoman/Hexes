export const shuffleArray = (array) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const randomBetween = (min, max) => {
  // Ensure the min and max are integers
  min = Math.ceil(min);
  max = Math.floor(max);
  // Generate a random integer between min and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomBoolean = () => {
  return Math.random() < 0.5; // Returns true if random number is less than 0.5, otherwise false
};
