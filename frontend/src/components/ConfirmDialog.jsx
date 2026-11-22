function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  if (!open) {
    return null;
  }

  return (
    <div className="popup-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="popup-card">
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="popup-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
