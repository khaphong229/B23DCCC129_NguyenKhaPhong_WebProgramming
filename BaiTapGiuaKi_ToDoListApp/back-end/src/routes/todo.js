const express = require("express");
const router = express.Router();
const TodoController = require("../app/controllers/TodoController");

router.get("/", TodoController.getAll);
router.get("/search", TodoController.search);
router.get("/:id", TodoController.getById);
router.post("/", TodoController.create);
router.put("/:id", TodoController.update);
router.delete("/:id", TodoController.delete);

module.exports = router;
