const { messages, statuses } = require("../constants/messages");
const { Failure, Success } = statuses;
const { common } = messages;

const getResponseObject = (res, statusCode, status, errors, message, data) => {
  return res.status(statusCode).json({
    status: status,
    errors: errors,
    message: message,
    data: data,
  });
};

const sendPartialSuccessResponse = (res, message) => {
  return getResponseObject(res, 200, Failure, [], message, null);
};

const sendErrorResponse = (err, res) => {
  console.log(err);
  return getResponseObject(
    res,
    500,
    Failure,
    [err],
    common.InternalServiceError,
    null
  );
};

const sendSuccessResponse = (res, message, data) => {
  return getResponseObject(res, 200, Success, [], message, data);
};

module.exports = {
  getResponseObject,
  sendPartialSuccessResponse,
  sendErrorResponse,
  sendSuccessResponse,
};
