const cc = (variable, str = '') => {
  if (str) {
    console.log(`${str} ${variable} :`, variable);
  } else {
    console.log(`${variable} :`, variable);
  }
};

export default cc;