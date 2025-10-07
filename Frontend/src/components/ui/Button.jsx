import React from "react";

const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#3399cc",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      {children}
    </button>
  );
};

export default Button;
