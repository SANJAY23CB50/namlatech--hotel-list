function SuccessPopup({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="popup-backdrop" role="dialog" aria-modal="true" aria-labelledby="success-title">
      <div className="popup-card">
        <p className="popup-icon" aria-hidden="true">
          ✓
        </p>
        <h2 id="success-title">Success</h2>
        <p>{message}</p>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default SuccessPopup;
