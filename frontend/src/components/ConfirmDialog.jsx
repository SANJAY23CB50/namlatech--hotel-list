function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  if (!open) {
    return null;
  }

  return (
    <div className="popup-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="popup-card confirm-popup-card">
        <div className="popup-warning-icon">⚠️</div>
        <h2 id="confirm-title" className="popup-title">{title}</h2>
        <p className="popup-message">{message}</p>
        <div className="popup-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
