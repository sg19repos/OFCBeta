require("dotenv").config();
const express = require("express");

const app = express();
const cors = require("cors");
const userRouter = require("./api/users/user.router");
const consignmentRouter = require("./api/consignments/consigner.router");
const carrierRouter = require("./api/carriers/carrier.router");

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/consignments", consignmentRouter);
app.use("/api/carriers", carrierRouter);
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});
