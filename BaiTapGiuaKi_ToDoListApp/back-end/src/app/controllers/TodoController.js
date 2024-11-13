const Todo = require("../models/Todo");

class TodoController {
  _normalizeStatus = (status) => {
    if (!status) return status;

    const statusLower = status.toLowerCase();

    if (statusLower === "in progress" || statusLower === "inprogress") {
      return "in-progress";
    }

    return statusLower;
  };

  getAll = async (req, res, next) => {
    try {
      const todos = await Todo.find({});
      res.json({
        success: true,
        data: todos,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy todo",
        });
      }
      res.json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const todoData = { ...req.body };

      if (todoData.status) {
        todoData.status = this._normalizeStatus(todoData.status);
      }

      const todo = new Todo(todoData);
      await todo.save();

      res.status(201).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: error.message,
          errors: error.errors || { [error.path]: error },
        });
      }
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const updateData = { ...req.body };

      if (updateData.status) {
        updateData.status = this._normalizeStatus(updateData.status);
      }

      const todo = await Todo.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy todo",
        });
      }

      res.json({
        success: true,
        data: todo,
      });
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: error.message,
          errors: error.errors || { [error.path]: error },
        });
      }
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy todo",
        });
      }
      res.json({
        success: true,
        message: "Xóa todo thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  search = async (req, res, next) => {
    try {
      const { name, category, status, date } = req.query;
      const query = {};

      if (name) query.name = { $regex: name, $options: "i" };
      if (category) query.category = category;
      if (status) query.status = this._normalizeStatus(status);
      if (date) query.date = date;

      const todos = await Todo.find(query);
      res.json({
        success: true,
        data: todos,
      });
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: error.message,
          errors: error.errors || { [error.path]: error },
        });
      }
      next(error);
    }
  };
}

module.exports = new TodoController();
