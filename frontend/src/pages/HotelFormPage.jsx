import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
    <main className="page narrow">
      <Helmet>
        <title>{isEdit ? "Edit hotel" : "Add hotel"} | StayFind</title>
        <meta
          name="description"
          content={isEdit ? "Update hotel image, title, description, location and price." : "Add a new hotel with image, location and price."}
        />
      </Helmet>

      <p className="eyebrow">{isEdit ? "Edit" : "New listing"}</p>
      <h1>{isEdit ? "Edit hotel" : "Add a hotel"}</h1>
      <p className="lede">The same form is used for adding and editing. Image, title, description, coordinates and price are required when creating.</p>

      {isEdit && loading ? <p className="muted">Loading hotel...</p> : null}

      {(!isEdit || current) && (
        <HotelForm
          initialHotel={isEdit ? current : null}
          serverErrors={formErrors}
          saving={saving}
          submitLabel={isEdit ? "Save changes" : "Create hotel"}
          onSubmit={handleSubmit}
        />
      )}

      <SuccessPopup message={successMessage} onClose={handleSuccessClose} />
    </main>
  );
}

export default HotelFormPage;
