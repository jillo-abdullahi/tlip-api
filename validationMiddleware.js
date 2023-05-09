const Ajv = require("ajv");
const ajv = new Ajv();

const validatePayload = (schema) => {
  return (req, res, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);

    if (!valid) {
      return res.status(400).json({
        error: "Invalid request payload",
        details: validate.errors,
      });
    }

    // If the payload is valid, continue to the route handler
    next();
  };
};

module.exports = validatePayload;
