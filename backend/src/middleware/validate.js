const validate = (schemas) => (req, _res, next) => {
  for (const key of ["params", "query", "body"]) {
    if (schemas[key]) req[key] = schemas[key].parse(req[key]);
  }
  next();
};
module.exports = validate;
