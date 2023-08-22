const { STATUS } = require("../constants");
console.log({STATUS})
module.exports = function validator(req, res, next, model) {
  try {
    // Get the route model as Model
    if (model) {
      const data = req.method == "GET" ? req.query : req.body;
      // If model is present
      // Check for the keys
      for (const key in model) {
        let model_param = model[key];
        let data_source = data;
        if (model_param.source) data_source = model_param.source == "query" ? req.query : req.body;
        if (!data_source)
          return res.status(STATUS.BAD_REQUEST).send({ message: "Body does not have acceptable data." });
        let expected_type;

        // String preprocessing
        if (data_source[key] && data_source[key].constructor == String) {
          data_source[key] = data_source[key].trim();
        }

        // If value could not be found

        // if required and value is not in data, return error
        if (model_param.required) {
          if (
            !data_source.hasOwnProperty(key) ||
            (!data_source[key] && data_source[key].toString() != "false") ||
            data_source[key] === null ||
            data_source[key] === undefined
          ) {
            return res.status(STATUS.BAD_REQUEST).send({ message: `Required key '${key}' is missing or is Invalid.` });
          }
        }

        if (!data_source.hasOwnProperty(key) || !data_source[key]) {
          // check if it has a default value
          if (model_param.hasOwnProperty("default")) {
            // set default value if exists
            data_source[key] = model_param.default;
          }
        }

        // if data for the key in the model is still not present in the body, just continue
        // TODO: maybe have a strict mode where the keys in the model must exist in request body
        if (!data_source.hasOwnProperty(key)) continue;

        // if direct "type" is given
        if (typeof model_param === "function") {
          // just assign the model_param = {type: given_type}
          model_param = { type: model_param };
        }

        // just sortening
        expected_type = model_param.type;

        // check - 1. if the type doesn't match and
        if (data_source[key].constructor != expected_type) {
          let input_value;
          // 2. if it can be typecasted

          // Keep typecasting limited to number, boolean, string, ObjectID and date
          // expand as needed
          // console.log(expected_type.name);
          try {
            if (expected_type == Date) {
              input_value = new model_param.type(data_source[key]);
            } else if (expected_type == String) {
              input_value = new model_param.type(data_source[key]).trim();
            } else if (expected_type == Boolean) {
              input_value = data_source[key];
              input_value === "true"
                ? (input_value = true)
                : input_value === "false"
                ? (input_value = false)
                : (input_value = null);
            } else if (expected_type == Number || expected_type == String || expected_type.name == "ObjectID") {
              input_value = model_param.type(data_source[key]);
            }
          } catch (e) {
            const error = new Error();
            error.message = `Input for Key '${key}' is Invalid.`;
            error.name = "CastingError";
            throw error;
          }

          // check for invalid typecasting specific to non-primitive type(s)
          // Date or Number
          if (expected_type == Date || expected_type == Number) {
            if (isNaN(input_value)) input_value = null;
          }

          if (input_value === null || input_value === undefined) {
            return res.status(STATUS.BAD_REQUEST).send({
              message: `Key '${key}' is '${data_source[key].constructor.name}'. Expected '${expected_type.name}'.`,
            });
          }
          // Assign typecased value
          data_source[key] = input_value;
        }

        if (expected_type) {
          if (data_source[key].constructor != expected_type) {
            return res.status(STATUS.BAD_REQUEST).send({
              message: `Key '${key}' is '${data_source[key].constructor.name}'. Expected '${expected_type.name}'.`,
            });
          }
        }

        if (model_param.enum) {
          if (model_param.enum.indexOf(data_source[key]) == -1) {
            return res.status(STATUS.BAD_REQUEST).send({ message: `Input for Key '${key}' is Invalid.` });
          }
        }

        if (model_param.min) {
          if (data_source[key] < model_param.min) {
            return res.status(STATUS.BAD_REQUEST).send({ message: `Minimum value for '${key}' is ${model_param.min}` });
          }
        }
        if (model_param.max) {
          if (data_source[key] > model_param.min) {
            return res.status(STATUS.BAD_REQUEST).send({ message: `Maximum value for '${key}' is ${model_param.min}` });
          }
        }
      }
    }
    return next();
  } catch (error) {
    if (error.name == "CastingError") {
      return res.status(STATUS.BAD_REQUEST).send({ message: error.message });
    }
    throw error;
  }
};
