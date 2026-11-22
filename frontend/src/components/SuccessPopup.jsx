function SuccessPopup({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="popup-backdrop" role="dialog" aria-modal="true" aria-labelledby="success-title">
      <div className="popup-card success-popup-card">
        <div className="popup-success-icon" aria-hidden="true">
          ✓
        </div>
        <h2 id="success-title" className="popup-title">Action Successful</h2>
        <p className="popup-message">{message}</p>
        <div className="popup-actions center-actions">
          <button type="button" className="btn btn-primary btn-popup-continue" onClick={onClose} autoFocus>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPopup;
