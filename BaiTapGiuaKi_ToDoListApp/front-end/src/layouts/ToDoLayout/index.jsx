import React from "react";
import "./styles.scss";
import Header from "./components/Header";

function index({ children }) {
  return (
    <div className="boxWrap">
      <Header />
      <div style={{
        margin: '20px 0'
      }}>{children}</div>
    </div>
  );
}

export default index;
