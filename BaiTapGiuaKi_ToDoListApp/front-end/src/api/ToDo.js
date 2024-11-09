// services/todoService.js
import instance from "./callApi";

export const todoService = {
  getAllTodos: () => {
    return instance.get("/api/todos");
  },

  getTodoById: (id) => {
    return instance.get(`/api/todos/${id}`);
  },

  createTodo: (todo) => {
    return instance.post("/api/todos", todo);
  },

  updateTodo: (id, todo) => {
    return instance.put(`/api/todos/${id}`, todo);
  },

  deleteTodo: (id) => {
    return instance.delete(`/api/todos/${id}`);
  },

  searchTodos: (params) => {
    return instance.get("/api/todos/search", { params });
  },
};
