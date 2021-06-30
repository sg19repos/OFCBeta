const async = require("async");
const pool = require("../../config/database");

const getRequests = (reqParam, sqlQuery, callBack) =>
  // return pool.query(sqlQuery, [reqParam], (error, results, fields) => {
  // eslint-disable-next-line implicit-arrow-linebreak
  pool.query(sqlQuery, [reqParam], (error, results) => {
    if (error) {
      callBack(error);
    }
    return callBack(null, results);
  });
module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into ofc_carriers(carrier_id, carrier_startinglocation, carrier_endlocation, carrier_starttime, carrier_lastupdatedtime, carrier_accepted, carrier_startingLocationObject, carrier_endLocationObject, carrier_journeyMode) values(?,?,?,?,?,?,?,?,?)",
      [
        data.journey_carrierId,
        data.journey_StartLocation,
        data.journey_EndLocation,
        data.journey_StartTime,
        data.journey_LastUpdatedTime,
        data.journey_accepted,
        JSON.stringify(data.journey_StartLocationObject),
        JSON.stringify(data.journey_EndLocationObject),
        JSON.stringify(data.journey_Mode),
      ],
      (error, results) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getJourneyByIdService: (journeyId, callBack) => {
    getRequests(
      journeyId,
      // "select * from ofc_carriers where carrier_journeyId=?",
      "SELECT t1.*, t2.user_firstname, t2.user_lastname, t2.user_email, t2.user_phone FROM ofc_carriers t1, ofc_users t2 WHERE t2.user_id=t1.carrier_id AND carrier_journeyId=?",
      callBack
    );
  },
  getJourneyByLocationService: (journeyStartLocation, callBack) => {
    getRequests(
      `'%${journeyStartLocation}%'`,
      `${
        // eslint-disable-next-line no-useless-concat
        /*"select * from ofc_carriers where carrier_startinglocation like " + "'%"
      }${journeyStartLocation}%'`,*/
        "SELECT t1.*, t2.user_firstname, t2.user_lastname, t2.user_email, t2.user_phone FROM ofc_carriers t1, ofc_users t2 WHERE t2.user_id=t1.carrier_id AND carrier_startinglocation like " +
        "'%"
      }${journeyStartLocation}%'`,
      callBack
    );
  },
  getJourneyByCarrierIdService: (carrierId, callBack) => {
    getRequests(
      carrierId,
      "select * from ofc_carriers where carrier_id=?",
      callBack
    );
  },
  updateCarrierProposalService: (data, callBack) => {
    let returnData = {};
    async.waterfall(
      [
        (callback) => {
          pool.query(
            `select carrier_journeyProposals from ofc_carriers where carrier_journeyId=${data.carrierJourneyId}`,
            {},
            (err, results) => {
              if (err) {
                return callback(err);
              }
              const proposals = results[0].carrier_journeyProposals;
              callback(null, proposals);
            }
          );
        },
        (proposals, callback) => {
          let proposedTime;
          if (![undefined, null].includes(proposals?.[data.carrierProposer])) {
            delete proposals?.[data.carrierProposer];
          } else {
            proposedTime = new Date().getTime();
          }

          const newObj = `'{"${data.carrierProposer}": ${proposedTime}}'`;
          const q4 = `SELECT JSON_MERGE_PATCH('${
            proposals && JSON.stringify(proposals)
          }',${
            proposedTime ? newObj : null
          }) as merged_proposals from ofc_carriers where carrier_journeyId=${
            data.carrierJourneyId
          }`;

          pool.query(q4, {}, (err, mergedResults) => {
            if (err) {
              return callback(err);
            }
            returnData = mergedResults[0].merged_proposals;
            callback(null, mergedResults[0].merged_proposals);
          });
        },
        (mergedProposals, callback) => {
          const params =
            mergedProposals && `'${JSON.stringify(mergedProposals)}'`;
          const q5 = `UPDATE ofc_carriers set carrier_journeyProposals=${params} where  carrier_journeyId=${data.carrierJourneyId}`;
          pool.query(q5, {}, (err, results) => {
            if (err) {
              return callback(err);
            }
            returnData = results;
            callback(null, results);
          });
        },
      ],
      (err) => {
        return callBack(null, returnData);
      }
    );
  },
};

// TODO add intermediate states to track current status, finished status etc
