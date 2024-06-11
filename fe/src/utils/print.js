const print = (variable, str = '') => {
  if (str) {
    console.log(`${str}에 있는 ${variable} :`, variable);
  } else {
    console.log(`${variable} :`, variable);
  }
};

export default print;
