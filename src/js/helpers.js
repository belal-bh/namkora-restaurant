export const wait = (seconds) => {
  // console.log(`Waiting for ${seconds} seconds...`);
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
