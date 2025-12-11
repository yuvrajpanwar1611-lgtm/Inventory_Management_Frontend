import React, { useState } from "react";

const ChatBotWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        aria-label="Chat with Assistant"
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#0d6efd",
          color: "white",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 9999,
          transition: "transform 0.2s ease",
        }}
      >
        {open ? "✖" : "💬"}
      </button>

      {/* Chat Window */}
      <div
        style={{
          position: "fixed",
          bottom: open ? "90px" : "-600px",
          right: "20px",
          width: "380px",
          height: "520px",
          background: "white",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
          transition: "bottom 0.35s ease-in-out",
          zIndex: 10000,
        }}
      >
        <div
          style={{
            background: "#0d6efd",
            padding: "10px",
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          AI Assistant
        </div>

        <iframe
          src="https://yuvrajpanwar60.app.n8n.cloud/webhook/a61a2a02-136b-4e7c-8606-51c0b5703ae4/chat"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="AI Chatbot"
        ></iframe>
      </div>
    </>
  );
};

export default ChatBotWidget;
