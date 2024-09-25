function TodoItem(props) {
  const { status, title, date } = props;
  let colorStatus = "";
  if (status === "open") {
    colorStatus = "gray";
  } else if (status === "process") {
    colorStatus = "blue";
  } else {
    colorStatus = "green";
  }
  return (
    <>
      <div
        className="TodoWrapper"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <div
          className="circleStatus"
          style={{
            width: "30px",
            height: "30px",
            backgroundColor: "white",
            border: `5px solid ${colorStatus}`,
            borderRadius: "50%",
          }}
        ></div>
        <div className="contentWrapper">
          <h3 className="title">{title}</h3>
          <p className="date">{date}</p>
        </div>
      </div>
    </>
  );
}

export default TodoItem;
