import React from "react";
import Typography from "@mui/material/Typography";

function index() {
  return (
    <div style={{
        borderBottom: '1px solid #ccc'
    }}>
      <Typography variant="h3" gutterBottom style={{
        textAlign: 'center',
        margin: '10px 0',
        fontWeight: 'bold'
      }}>
        My ToDoList 📋
      </Typography>
    </div>
  );
}

export default index;
