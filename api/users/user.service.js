const async = require("async");
const pool = require("../../config/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      `insert into ofc_users(user_email, user_firstname, user_lastName, user_gender, user_phone, user_password, user_loggedinstate, user_verifiedstatus, user_consignerrating, user_carrierrating) 
                values(?,?,?,?,?,?,?,?,?,?)`,
      [
        data.user_email,
        data.user_firstname,
        data.user_lastName,
        data.user_gender,
        data.user_phone,
        data.user_password,
        data.user_loggedinstate,
        data.user_verifiedstatus,
        data.user_consignerrating,
        data.user_carrierrating,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserByUserEmail: (data, callBack) => {
    const query1 = `update ofc_users set user_loggedinstate=${data.user_loggedinstate} where user_email="${data.user_email}"`;

    const query2 = `SELECT * from ofc_users where user_email="${data.user_email}"`;

    let returnData = {};

    async.parallel(
      [
        function (parallelDone) {
          pool.query(query1, {}, (err, result) => {
            if (err) {
              return parallelDone(err);
            }
            parallelDone();
          });
        },
        function (parallelDone) {
          pool.query(query2, {}, (err, results) => {
            if (err) return parallelDone(err);
            returnData = results;
            parallelDone();
          });
        },
      ],
      (err) => {
        return callBack(null, returnData);
      }
    );
  },
  getUserByUserId: (id, callBack) => {
    const query1 =
      `SELECT * from  ofc_consignments where consignment_consigner=` + id;
    const query2 = `SELECT * from  ofc_carriers where carrier_id=` + id;
    const query3 = `SELECT * from  ofc_users where user_id=` + id;

    const returnData = {};

    async.parallel(
      [
        function (parallelDone) {
          pool.query(query1, {}, function (err, results) {
            if (err) return parallelDone(err);
            returnData.user_consignments = results;
            parallelDone();
          });
        },
        function (parallelDone) {
          pool.query(query2, {}, function (err, results) {
            if (err) return parallelDone(err);
            returnData.user_journeys = results;
            parallelDone();
          });
        },
        function (parallelDone) {
          pool.query(query3, {}, function (err, results) {
            if (err) return parallelDone(err);
            returnData.user_details = results[0];
            parallelDone();
          });
        },
      ],
      function (err) {
        return callBack(null, returnData);
      }
    );
    /*pool.query(
      // `select id,firstName,lastName,gender,email,number from registration where id = ?`,
      `select * from ofc_users where user_id = ?`,
      // "SELECT t1.*, t2.user_firstname, t2.user_lastname FROM ofc_consignments t1, ofc_users t2 WHERE t2.user_id=t1.consignment_consigner AND consignment_id=?",
      // `SELECT t1.*, t2.*, t3.* FROM ofc_consignments t1, ofc_carriers t2, ofc_users t3  WHERE t1.consignment_consigner=t3.user_id AND t2.carrier_id=t3.user_id AND t3.user_id=?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }

        return callBack(null, results);
      }
    );*/
  },
  getUsers: (callBack) => {
    pool.query(
      // `select id,firstName,lastName,gender,email,number from registration`,
      // `select user_id,user_firstName,user_lastName,user_genders,user_email,user_phone from ofcdb_trial1.ofc_users`,
      `select * from ofc_users`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateUser: (data, callBack) => {
    pool.query(
      `update ofc_users set user_email=?, user_firstname=?, user_lastName=?, user_gender=?, user_phone=?, user_password=?, user_loggedinstate=?, user_verifiedstatus=?, user_consignerrating=?,user_carrierrating=? where user_id = ?`,
      [
        data.user_email,
        data.user_firstname,
        data.user_lastName,
        data.user_gender,
        data.user_phone,
        data.user_password,
        data.user_loggedinstate,
        data.user_verifiedstatus,
        data.user_consignerrating,
        data.user_carrierrating,
        data.user_id,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  deleteUser: (data, callBack) => {
    pool.query(
      `delete from ofc_users where user_id=?`,
      [data.user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
};
