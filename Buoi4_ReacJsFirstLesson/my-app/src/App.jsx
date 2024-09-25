import TodoItem from "./components/TodoItem";
// import "./styles.css";

const dataTodo = [
  {
    status: "process",
    title: "Học lập trình web với React",
    date: "Thứ 4",
  },
  {
    status: "open",
    title: "Toán rời rạc",
    date: "Thứ 6",
  },
  {
    status: "open",
    title: "Lập trình hướng đối tượng",
    date: "Thứ 6",
  },
  {
    status: "open",
    title: "Tiếng anh",
    date: "Thứ 7",
  },
];

export default function App() {
  return (
    <div className="App">
      <h1>My work 📌</h1>
      {dataTodo.map((todo, index) => (
        <TodoItem status={todo.status} title={todo.title} date={todo.date} />
      ))}
    </div>
  );
}
