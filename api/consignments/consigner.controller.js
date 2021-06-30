const { messages } = require("../constants/messages");
const {
  create,
  getConsignmentsOfUserService,
  getConsignmentByIdService,
  updateConsignment,
  deleteConsignment,
  getConsignmentsByLocationService,
  updateConsignmentProposal,
} = require("./consigner.service");
const {
  sendPartialSuccessResponse,
  sendErrorResponse,
  sendSuccessResponse,
} = require("../common/common.utils");

const { Consignments } = messages;

const getConsignmentById = (req, res) => {
  const consignmentId = req.query.id;
  getConsignmentByIdService(consignmentId, (err, results) => {
    if (err) {
      sendErrorResponse(err, res);
    } else if (!results || results.length === 0) {
      sendPartialSuccessResponse(res, Consignments.ConsignmentDoesntExist);
    } else {
      sendSuccessResponse(res, "", results);
    }
  });
};

const getConsignmentsByLocation = (req, res) => {
  const { consignmentPickupLocation } = req.query;
  // eslint-disable-next-line no-undef
  getConsignmentsByLocationService(
    consignmentPickupLocation,
    (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      } else if (!results || results.length === 0) {
        sendPartialSuccessResponse(res, Consignments.ConsignmentsDoesntExist);
      } else {
        sendSuccessResponse(res, "", results);
      }
    }
  );
};

module.exports = {
  createConsignment: (req, res) => {
    const { body } = req;
    create(body, (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      } else {
        sendSuccessResponse(res, Consignments.ConsignmentCreationSuccess, {
          results,
        });
      }
    });
  },
  getConsignments: (req, res) => {
    if (req.query) {
      if (req.query.id) {
        getConsignmentById(req, res);
      } else if (req.query.consignmentPickupLocation) {
        getConsignmentsByLocation(req, res);
      } else if (req.query.consignerId) {
        const userId = req.query.consignerId;
        getConsignmentsOfUserService(userId, (err, results) => {
          if (err) {
            sendErrorResponse(err, res);
          } else if (!results || results.length === 0) {
            sendPartialSuccessResponse(
              res,
              Consignments.ConsignmentsDoesntExist
            );
          } else {
            sendSuccessResponse(res, "", results);
          }
        });
      }
    } else {
      /*else if (req.params.consignerId.split("=")[0] === "id") {
      getConsignmentById(req, res);
    } */
      // const userId = req.params.consignerId.split("=")[1];
      /*getConsignmentsOfUserService(userId, (err, results) => {
        if (err) {
          sendErrorResponse(err, res);
        } else if (!results || results.length === 0) {
          sendPartialSuccessResponse(res, Consignments.ConsignmentsDoesntExist);
        } else {
          sendSuccessResponse(res, "", results);
        }
      });*/
    }
  },
  updateConsignment: (req, res) => {
    updateConsignment(body, (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      } else if (!results) {
        sendPartialSuccessResponse(res, Consignments.ConsignmentUpdateFail);
      } else {
        sendSuccessResponse(res, Consignments.ConsignmentUpdateSuccess, null);
      }
    });
  },
  deleteConsignment: (req, res) => {
    const data = req.body;
    deleteConsignment(data, (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      } else if (!results) {
        sendPartialSuccessResponse(res, Consignments.ConsignmentDeleteFail);
      } else {
        sendSuccessResponse(res, Consignments.ConsignmentDeleteSuccess, null);
      }
    });
  },
  updateConsignmentProposal: (req, res) => {
    const consignmentProposer = req.body.consignment_proposer;
    const consignmentId = req.body.consignment_id;
    const data = {
      consignmentProposer,
      consignmentId,
    };
    updateConsignmentProposal(data, (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      } else if (!results) {
        sendPartialSuccessResponse(res, Consignments.ConsignmentUpdateFail);
      } else {
        sendSuccessResponse(res, Consignments.ConsignmentUpdateSuccess, null);
      }
    });
  },
};
