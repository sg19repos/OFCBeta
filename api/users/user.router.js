const express = require("body-parser");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
router.use(express.json());

const {
  createUser,
  login,
  getUserByUserId,
  getUsers,
  updateUsers,
  deleteUser,
} = require("./user.controller");
// router.get("/", checkToken, getUsers);
// router.post("/", checkToken, createUser);
router.post("/", createUser);
// router.get("/:id", checkToken, getUserByUserId);
router.get("/", checkToken, (req, res) => {
  getUserByUserId(req, res);
});
router.post("/login", login);
router.post("/logout", login);
router.patch("/", checkToken, updateUsers);
router.delete("/", checkToken, deleteUser);
router.get("/checkToken", checkToken);

module.exports = router;
//TODO pair up with delivery agents agency
