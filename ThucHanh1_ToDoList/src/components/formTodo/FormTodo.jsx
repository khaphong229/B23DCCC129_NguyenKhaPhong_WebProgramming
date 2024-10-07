import React, { useState } from "react";
import TodoList from "../todoList/TodoList";

function FormTodo() {
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    status: "",
  });
  const [listTodo, setListTodo] = useState([]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (formData.id) {
      const newData = listTodo.map(item => formData.id === item.id ? formData : item);
      setListTodo(newData);
    } else {
      setListTodo([
        ...listTodo,
        {
          ...formData,
          id: Date.now(),
        },
      ]);
    }

    setFormData({
      id: null,
      title: "",
      status: "",
    });
  };

  const onDelete = (id) => {
    const newData = listTodo.filter((i) => i.id !== id);
    setListTodo(newData);
  };

  const onEdit = (item) => {
    setFormData(item);
  };

  return (
    <div className="todo-container">
      <h1>My work</h1>
      <div className="box-input">
        <input
          type="text"
          name="title"
          placeholder="Thêm công việc"
          onChange={handleChange}
          value={formData.title}
        />
        <select name="status" onChange={handleChange} value={formData.status}>
          <option value="">Chọn trạng thái</option>
          <option value="todo">Todo</option>
          <option value="done">Done</option>
          <option value="doing">Doing</option>
          <option value="resolved">Resolved</option>
          <option value="reOpen">reOpen</option>
        </select>
      </div>
      <div className="box-radio">
        <span>Status: </span>
        <label>
          <input
            type="radio"
            value="todo"
            name="status"
            onChange={handleChange}
            checked={formData.status === "todo"}
          />
          Todo
        </label>
        <label>
          <input
            type="radio"
            value="done"
            name="status"
            onChange={handleChange}
            checked={formData.status === "done"}
          />
          Done
        </label>
        <label>
          <input
            type="radio"
            value="doing"
            name="status"
            onChange={handleChange}
            checked={formData.status === "doing"}
          />
          Doing
        </label>
        <label>
          <input
            type="radio"
            value="resolved"
            name="status"
            onChange={handleChange}
            checked={formData.status === "resolved"}
          />
          Resolved
        </label>
        <label>
          <input
            type="radio"
            value="reOpen"
            name="status"
            onChange={handleChange}
            checked={formData.status === "reOpen"}
          />
          reOpen
        </label>
      </div>
      <button className="add-task" onClick={handleSubmit}>
        {formData.id ? "Sửa" : "Thêm"}
      </button>
      <TodoList data={listTodo} onDelete={onDelete} onEdit={onEdit} />
    </div>
  );
}

export default FormTodo;

