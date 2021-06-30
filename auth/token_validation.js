const jwt = require("jsonwebtoken");
module.exports = {
  // eslint-disable-next-line consistent-return
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    // console.log("token 1212", token);
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        // console.log("decoded is at", decoded, "req is at", req);

        if (err) {
          // console.log("err is", err);
          return res.json({
            success: 0,
            token: "EXPIRED",
            data: {},
            message: "Invalid Token...",
            status: "SUCCESS",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User",
      });
    }
  },
};
// TODO check the above commented part
