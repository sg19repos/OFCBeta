const async = require("async");
const pool = require("../../config/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      "insert into ofc_consignments(consignment_id, consignment_consigner, consignment_createdtime, consignment_pickuplocation, consignment_droplocation, consignment_description, consignment_category,  consignment_weight, consignment_pickupLocationObject, consignment_dropLocationObject, consignment_pickuptime) values(?,?,?,?,?,?,?,?,?,?,?)",
      [
        data.consignment_id,
        data.consignment_consignerid,
        data.consignment_createdtime,
        data.consignment_pickuplocation,
        data.consignment_droplocation,
        JSON.stringify(data.consignment_description),
        data.consignment_category,
        data.consignment_weight,
        JSON.stringify(data.consignment_pickupLocationObject),
        JSON.stringify(data.consignment_dropLocationObject),
        data.consignment_pickuptime,
      ],
      (error, results) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getConsignmentsOfUserService: (userId, callBack) => {
    pool.query(
      "select * from ofc_consignments where consignment_consigner=?",
      [userId],
      (error, results) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getConsignmentByIdService: (consignmentId, callBack) => {
    pool.query(
      // "select * from ofc_consignments where consignment_id=?",
      // "select user_firstname from ofc_users where user_id=(select consignment_consigner from ofc_consignments where consignment_id=?) union select * from ofc_consignments where consignment_id=?",
      // "SELECT t1.*, t2.user_firstname FROM ofc_consignments t1, ofc_users t2 WHERE t2.user_id=(select consignment_consigner from ofc_consignments where consignment_id=1619947504840) AND consignment_id=?",
      "SELECT t1.*, t2.user_firstname, t2.user_lastname, t2.user_email, t2.user_phone FROM ofc_consignments t1, ofc_users t2 WHERE t2.user_id=t1.consignment_consigner AND consignment_id=?",
      [consignmentId],
      (error, results) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getConsignmentsByLocationService: (consignmentPickupLocation, callBack) => {
    pool.query(
      `${
        "select * from ofc_consignments where consignment_pickuplocation like " +
        "'%"
      }${consignmentPickupLocation}%'`,
      (error, results) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateConsignment: (data, callBack) => {
    pool.query(
      "update ofc_consignments set consignment_consigner=?, consignment_createdtime=?, consignment_pickuplocation=?, consignment_droplocation=?, consignment_acceptedcarrier=?, consignment_description=?, consignment_category=?, consignment_weight=?, consignment_accepted=?, consignment_acceptedplace=?, consignment_acceptedtime=? where consignmen_id=?",
      [
        data.consignment_consigner,
        data.consignment_createdtime,
        data.consignment_pickuplocation,
        data.consignment_droplocation,
        data.consignment_acceptedcarrier,
        data.consignment_description,
        data.consignment_category,
        data.consignment_weight,
        data.consignment_accepted,
        data.consignment_acceptedplace,
        data.consignment_acceptedtime,
      ],
      (error, results) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  deleteConsignment: (data, callBack) => {
    pool.query(
      "delete from ofc_consignments where consignment_id=?",
      [data.consignment_id],
      (error, results) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateConsignmentProposal: (data, callBack) => {
    let returnData = {};
    async.waterfall(
      [
        (callback) => {
          pool.query(
            `select consignment_proposals from ofc_consignments where consignment_id=${data.consignmentId}`,
            {},
            (err, results) => {
              if (err) {
                return callback(err);
              }
              const proposals = results[0].consignment_proposals;
              callback(null, proposals);
            }
          );
        },
        (proposals, callback) => {
          let proposedTime;
          if (
            ![undefined, null].includes(proposals?.[data.consignmentProposer])
          ) {
            delete proposals?.[data.consignmentProposer];
          } else {
            proposedTime = new Date().getTime();
          }

          const newObj = `'{"${data.consignmentProposer}": ${proposedTime}}'`;
          const q4 = `SELECT JSON_MERGE_PATCH('${
            proposals && JSON.stringify(proposals)
          }',${
            proposedTime ? newObj : null
          }) as merged_proposals from ofc_consignments where consignment_id=${
            data.consignmentId
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
          const q5 = `UPDATE ofc_consignments set consignment_proposals=${params} where  consignment_id=${data.consignmentId}`;
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
