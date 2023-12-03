

const createError = ({ name = "Error", cause, message, code }) => {
    const error = new Error(message);
    error.name = name;
    error.cause = cause;
    error.code = code;
    return error;
  };
  
  module.exports = { createError };
  