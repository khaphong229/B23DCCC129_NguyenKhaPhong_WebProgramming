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

  _formatDate = (dateString) => {
    if (!dateString) return dateString;

    // Check if date is already a Date object
    if (dateString instanceof Date) return dateString;

    // Parse DD/MM/YYYY format
    const [day, month, year] = dateString.split("/");
    if (day && month && year) {
      // Create date in YYYY-MM-DD format
      const formattedDate = new Date(`${year}-${month}-${day}`);
      // Check if date is valid
      if (!isNaN(formattedDate.getTime())) {
        return formattedDate;
      }
    }

    // If parsing fails, return original date string to let Mongoose handle validation
    return dateString;
  };

  index = async (req, res, next) => {
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

  show = async (req, res, next) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
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

      // Format status if present
      if (todoData.status) {
        todoData.status = this._normalizeStatus(todoData.status);
      }

      // Format date if present
      if (todoData.date) {
        todoData.date = this._formatDate(todoData.date);
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

      // Format status if present
      if (updateData.status) {
        updateData.status = this._normalizeStatus(updateData.status);
      }

      // Format date if present
      if (updateData.date) {
        updateData.date = this._formatDate(updateData.date);
      }

      const todo = await Todo.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
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
          message: "Todo not found",
        });
      }
      res.json({
        success: true,
        message: "Todo deleted successfully",
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
      if (date) query.date = this._formatDate(date);

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
