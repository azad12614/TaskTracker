import React, { useEffect } from "react";
import "./ConfirmModal.css";

const TrashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z" fill="currentColor" />
    <path d="M9 3h6l1 2H8l1-2z" fill="currentColor" />
    <path d="M4 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ConfirmModal = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel?.();
      if (e.key === "Enter") onConfirm?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onConfirm, onCancel]);

  return (
    <div className="cm-overlay" onClick={onCancel}>
      <div className="cm-box" onClick={(e) => e.stopPropagation()}>
        <div className={`cm-icon cm-icon--${variant}`}>
          {variant === "danger" ? <TrashIcon /> : <CheckIcon />}
        </div>
        {title && <h3 className="cm-title">{title}</h3>}
        {message && <p className="cm-message">{message}</p>}
        <div className="cm-actions">
          {onCancel && (
            <button className="cm-btn cm-btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button
            className={`cm-btn ${variant === "danger" ? "cm-btn-danger" : "cm-btn-ok"}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
