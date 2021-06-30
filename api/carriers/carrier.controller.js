const { messages } = require("../constants/messages");
const {
  create,
  getJourneyByIdService,
  getJourneyByCarrierIdService,
  getJourneyByLocationService,
  updateCarrierProposalService,
} = require("./carrier.service");
const {
  sendPartialSuccessResponse,
  sendErrorResponse,
  sendSuccessResponse,
} = require("../common/common.utils");

const { Carriers } = messages;

const getJourneyById = (req, res) => {
  // const journeyId = req.params.carrierId.split("=")[1];
  const journeyId = req.query.id;
  getJourneyByIdService(journeyId, (err, results) => {
    if (err) {
      sendErrorResponse(err, res);
    } else if (!results || results.length === 0) {
      sendPartialSuccessResponse(res, Carriers.JourneyDoesntExist);
    } else {
      sendSuccessResponse(res, "", results);
    }
  });
};

const getJourneyByLocation = (req, res) => {
  const journeyStartLocation = req.query.carrierStartLocation;
  getJourneyByLocationService(journeyStartLocation, (err, results) => {
    if (err) {
      sendErrorResponse(err, res);
    } else if (!results || results.length === 0) {
      sendPartialSuccessResponse(res, Carriers.JourneyDoesntExist);
    } else {
      sendSuccessResponse(res, "", results);
    }
  });
};

module.exports = {
  createCarrier: (req, res) => {
    const { body } = req;
    create(body, (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      } else {
        sendSuccessResponse(res, Carriers.CarrierCreationSuccess, {
          results,
        });
      }
    });
  },
  getCarriers: (req, res) => {
    // if (Object.keys(req.query).length) {
    if (req.query?.carrierStartLocation) {
      getJourneyByLocation(req, res);
      // } else if (req.params.carrierId.split("=")[0] === "id") {
    } else if (req.query?.id) {
      getJourneyById(req, res);
    } else if (req.query?.carrierId) {
      // const userId = req.params.carrierId.split("=")[1];
      const userId = req.query?.carrierId;
      getJourneyByCarrierIdService(userId, (err, results) => {
        if (err) {
          sendErrorResponse(err, res);
        } else if (!results || results.length === 0) {
          sendPartialSuccessResponse(res, Carriers.JourneysDoesntExist);
        } else {
          sendSuccessResponse(res, "", results);
        }
      });
    }
  },
  updateCarrierProposal: (req, res) => {
    const carrierProposer = req.body.carrier_proposer;
    const carrierJourneyId = req.body.carrier_journeyId;
    const data = {
      carrierProposer,
      carrierJourneyId,
    };
    updateCarrierProposalService(data, (err, results) => {
      if (err) {
        sendErrorResponse(err, res);
      } else if (!results) {
        sendPartialSuccessResponse(res, Carriers.JourneyUpdateFail);
      } else {
        sendSuccessResponse(res, Carriers.JourneyUpdateSuccess, null);
      }
    });
  },
};
