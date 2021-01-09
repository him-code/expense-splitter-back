const validateKeys = (Obj, keys) => {
  let result = 1;
  keys.map((key) => {
    if (!Obj.hasOwnProperty(key)) result = 0;
  });
  return result;
};

module.exports = { validateKeys };
