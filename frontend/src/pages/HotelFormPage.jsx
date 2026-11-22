import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import HotelForm from "../components/HotelForm";
import SuccessPopup from "../components/SuccessPopup";
import { clearFormErrors, clearSuccess, loadHotel, resetCurrent, saveHotel } from "../store/hotelsSlice";

function HotelFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, saving, formErrors, successMessage, loading } = useSelector(function (state) {
    return state.hotels;
  });

  useEffect(
    function () {
      dispatch(clearFormErrors());
      if (isEdit) {
        dispatch(loadHotel(id));
      } else {
        dispatch(resetCurrent());
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch, id, isEdit]
  );

  function handleSubmit(formData) {
    dispatch(saveHotel({ id: id, formData: formData }));
  }

  function handleSuccessClose() {
    dispatch(clearSuccess());
    navigate("/");
  }

  return (
    <main className="page form-page">
      <Helmet>
        <title>{isEdit ? "Edit Hotel | StayFind - NamlaTech" : "Add New Hotel | StayFind - NamlaTech"}</title>
        <meta
          name="description"
          content={
            isEdit
              ? "Update hotel photography, title, description, coordinates and nightly rate."
              : "Add a new hotel listing with image upload, location coordinates and pricing."
          }
        />
      </Helmet>

      <div className="container form-page-container">
        <div className="detail-nav-bar">
          <Link to="/" className="btn-back-link">
            ← Back to Hotel Listings
          </Link>
        </div>

        <div className="form-card-wrapper">
          <div className="form-header-banner">
            <span className="form-eyebrow">{isEdit ? "MODIFY LISTING" : "NEW LISTING"}</span>
            <h1 className="form-page-title">{isEdit ? "Edit Hotel Details" : "Add a New Hotel"}</h1>
            <p className="form-page-subtitle">
              Fill in the hotel information below. All fields with asterisk (<span className="req-star">*</span>) are mandatory.
            </p>
          </div>

          {isEdit && loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading hotel information...</p>
            </div>
          ) : null}

          {(!isEdit || current) && (
            <HotelForm
              initialHotel={isEdit ? current : null}
              serverErrors={formErrors}
              saving={saving}
              submitLabel={isEdit ? "Save Changes" : "Create Hotel Listing"}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>

      <SuccessPopup
        message={successMessage}
        onClose={handleSuccessClose}
      />
    </main>
  );
}

export default HotelFormPage;
