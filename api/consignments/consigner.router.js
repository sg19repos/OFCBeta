const express = require("body-parser");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.use(express.json());

const {
  createConsignment,
  getConsignments,
  updateConsignment,
  deleteConsignment,
  updateConsignmentProposal,
} = require("./consigner.controller");

router.get("/:consignerId", checkToken, getConsignments);
router.post("/", checkToken, createConsignment);
router.get("/:id", checkToken, getConsignments);
// router.patch("/", checkToken, updateConsignment);
router.delete("/", checkToken, deleteConsignment);
router.patch("/", checkToken, (req, res) => {
  if (req.body.consignment_proposer) {
    updateConsignmentProposal(req, res);
  } else {
    updateConsignment(req, res);
  }
});
router.get(
  "/",
  checkToken,
  (req, res) => {
    getConsignments(req, res);
  },
  checkToken
);

module.exports = router;
