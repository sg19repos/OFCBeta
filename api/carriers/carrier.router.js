const express = require("body-parser");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.use(express.json());

const {
  createCarrier,
  getCarriers,
  updateCarrierProposal,
  // updateConsignment,
  // deleteConsignment,
} = require("./carrier.controller");

router.get("/:carrierId", checkToken, getCarriers);
router.post("/", checkToken, createCarrier);
router.get("/:id", checkToken, getCarriers);
router.get(
  "/",
  (req, res) => {
    getCarriers(req, res);
  },
  checkToken
);
router.patch("/", checkToken, (req, res) => {
  console.log("reqIs", req);
  if (req.body.carrier_proposer) {
    updateCarrierProposal(req, res);
  }
});
// router.patch("/", checkToken, updateConsignment);
// router.delete("/", checkToken, deleteConsignment);

module.exports = router;
