const jwt = require("jsonwebtoken");
const {
  getConsignmentsOfUserService,
} = require("../consignments/consigner.service");
const { getJourneyByCarrierIdService } = require("../carriers/carrier.service");
const { messages } = require("../constants/messages");

const {
  create,
  getUserByUserEmail,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
} = require("./user.service");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const {
  sendErrorResponse,
  sendPartialSuccessResponse,
  sendSuccessResponse,
} = require("../common/common.utils");

const { login, Registration, Users, logout } = messages;

module.exports = {
  //Create User
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.user_password = hashSync(body.user_password, salt);
    create(body, (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      }
      sendSuccessResponse(res, Registration.UserCreationSuccess, {
        results,
      });
    });
  },

  //Login with user email and password
  login: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body, (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      }
      if (!results) {
        sendPartialSuccessResponse(res, login.InvalidCredentials);
      }
      if (body.user_loggedinstate === 0) {
        sendSuccessResponse(res, logout.LogoutSuccessful, {});
      } else {
        const result = compareSync(
          body.user_password.toString(),
          results?.[0]?.user_password
        );
        // const result = body.user_password === results.user_password;

        if (result) {
          results[0].user_password = undefined;
          // const jsonToken = sign({ result: results }, "qwe1234", {
          const jsonToken = sign({ result: results[0] }, process.env.JWT_KEY, {
            // expiresIn: "1h",
            expiresIn: 12000,
          });

          sendSuccessResponse(res, login.LoginSuccessful, {
            token: jsonToken,
            user_details: jwt.verify(
              jsonToken,
              process.env.JWT_KEY,
              (err, decoded) => {
                if (err) {
                  return {
                    success: 0,
                    message: "Invalid Token...",
                  };
                } else {
                  return decoded.result;
                }
              }
            ),
          });
        } else {
          sendPartialSuccessResponse(res, login.InvalidCredentials);
        }
      }
    });
  },

  //Get single user by given user ID
  getUserByUserId: (req, res) => {
    // const id = req.params.id;
    const { id } = req.query;

    let userWholeObject = {};

    getUserByUserId(id, (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      }
      if (!results) {
        sendPartialSuccessResponse(res, Users.UserNotFound);
      } else {
        results.user_password = undefined;
        userWholeObject = {
          ...results,
        };
        sendSuccessResponse(res, "", userWholeObject);
      }
    });
  },

  //Get list of all users
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      }
      sendSuccessResponse(res, "", results);
    });
  },

  //Update users details with given user ID
  updateUsers: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.user_password = hashSync(body.user_password, salt);
    updateUser(body, (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      }
      if (!results) {
        sendPartialSuccessResponse(res, Users.UserUpdateFail);
      }
      sendSuccessResponse(res, Users.UpdatedSuccess, null);
    });
  },

  //Delete user with given user ID
  deleteUser: (req, res) => {
    const data = req.body;
    deleteUser(data, (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      }
      if (!results) {
        sendPartialSuccessResponse(res, Users.UserDeletedFail);
      }
      sendSuccessResponse(res, Users.UserDeletedSuccess, null);
    });
  },
};

//TODO fetching all users should only be for Super user
//TODO don't forget to restrict the permissions
