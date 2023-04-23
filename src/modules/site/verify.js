function verify(data, input, type) {
  return data.find((row) => {
    return row[type].toString() === input;
  });
}

export default verify;
