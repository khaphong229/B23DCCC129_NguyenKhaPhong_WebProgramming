const express = require("express");
const router = express.Router();
const TodoController = require("../app/controllers/TodoController");

// CRUD routes
router.get("/", TodoController.index);
router.get("/search", TodoController.search);
router.get("/:id", TodoController.show);
router.post("/", TodoController.create);
router.put("/:id", TodoController.update);
router.delete("/:id", TodoController.delete);

module.exports = router;
