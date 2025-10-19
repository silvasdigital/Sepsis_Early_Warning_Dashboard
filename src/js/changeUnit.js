const changeFtoC = (valueF) => {
  const valueC = (valueF - 32) * (5 / 9);
  return valueC;
};

const changeCtoF = (valueC) => {
  const valueF = valueC * (9 / 5) + 32;
  return valueF;
};

export { changeFtoC, changeCtoF };
