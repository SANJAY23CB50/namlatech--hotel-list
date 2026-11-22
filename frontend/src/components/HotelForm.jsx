import { useEffect, useState } from "react";
import { validateHotelForm } from "../utils/validation";

const emptyValues = {
  title: "",
  description: "",
  latitude: "",
  longitude: "",
  price: ""
};

function HotelForm({ initialHotel, serverErrors, saving, onSubmit, submitLabel }) {
  const [values, setValues] = useState(emptyValues);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(
    function () {
      if (initialHotel) {
        setValues({
          title: initialHotel.title || "",
          description: initialHotel.description || "",
          latitude: String(initialHotel.latitude ?? ""),
          longitude: String(initialHotel.longitude ?? ""),
          price: String(initialHotel.price ?? "")
        });
        setPreview(initialHotel.image_path || "");
      } else {
        setValues(emptyValues);
        setPreview("");
        setImageFile(null);
      }
    },
    [initialHotel]
  );

  useEffect(
    function () {
      setErrors(serverErrors || {});
    },
    [serverErrors]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setValues(function (curr) {
      return { ...curr, [name]: value };
    });
    // Clear error for that field if present
    if (errors[name]) {
      setErrors(function (curr) {
        const next = { ...curr };
        delete next[name];
        return next;
      });
    }
  }

  function handleImageChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    if (errors.image) {
      setErrors(function (curr) {
        const next = { ...curr };
        delete next.image;
        return next;
      });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateHotelForm(values, imageFile, Boolean(initialHotel));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title.trim());
    formData.append("description", values.description.trim());
    formData.append("latitude", values.latitude);
    formData.append("longitude", values.longitude);
    formData.append("price", values.price);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    onSubmit(formData);
  }

  return (
    <form className="hotel-form-card" onSubmit={handleSubmit} noValidate>
      {/* 1. Image Upload with Live Preview */}
      <div className="form-group image-upload-group">
        <label className="form-label" htmlFor="hotel-image-upload">
          Hotel Image <span className="req-star">*</span>
          <span className="field-hint"> (JPG, PNG or WEBP, max 5MB)</span>
        </label>
        <div className="upload-dropzone">
          <input
            id="hotel-image-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/jpg"
            onChange={handleImageChange}
            className="file-input"
          />
          {preview ? (
            <div className="preview-container">
              <img
                src={preview}
                alt={values.title ? `${values.title} preview` : "Selected hotel preview"}
                className="image-preview"
              />
              <span className="preview-badge">Preview</span>
            </div>
          ) : (
            <div className="upload-placeholder">
              <span className="upload-icon">📷</span>
              <p>Click here to choose a photo for the hotel</p>
            </div>
          )}
        </div>
        {errors.image ? <p className="field-error-text">{errors.image}</p> : null}
      </div>

      {/* 2. Hotel Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="hotel-title-input">
          Hotel Name / Title <span className="req-star">*</span>
        </label>
        <input
          id="hotel-title-input"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          placeholder="e.g. The Grand Palace Hotel"
          className={errors.title ? "form-input input-error" : "form-input"}
          maxLength="150"
        />
        {errors.title ? <p className="field-error-text">{errors.title}</p> : null}
      </div>

      {/* 3. Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="hotel-description-input">
          Description <span className="req-star">*</span>
        </label>
        <textarea
          id="hotel-description-input"
          name="description"
          rows="4"
          value={values.description}
          onChange={handleChange}
          placeholder="Describe the ambiance, rooms, key amenities, and nearby attractions..."
          className={errors.description ? "form-textarea input-error" : "form-textarea"}
          maxLength="2000"
        />
        <div className="char-counter">{values.description.length} / 2000 chars</div>
        {errors.description ? <p className="field-error-text">{errors.description}</p> : null}
      </div>

      {/* 4. Latitude and Longitude */}
      <div className="form-row-2col">
        <div className="form-group">
          <label className="form-label" htmlFor="hotel-lat-input">
            Latitude <span className="req-star">*</span>
            <span className="field-hint"> (-90 to 90)</span>
          </label>
          <input
            id="hotel-lat-input"
            name="latitude"
            type="number"
            step="any"
            value={values.latitude}
            onChange={handleChange}
            placeholder="e.g. 18.921984"
            className={errors.latitude ? "form-input input-error" : "form-input"}
          />
          {errors.latitude ? <p className="field-error-text">{errors.latitude}</p> : null}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="hotel-lng-input">
            Longitude <span className="req-star">*</span>
            <span className="field-hint"> (-180 to 180)</span>
          </label>
          <input
            id="hotel-lng-input"
            name="longitude"
            type="number"
            step="any"
            value={values.longitude}
            onChange={handleChange}
            placeholder="e.g. 72.833183"
            className={errors.longitude ? "form-input input-error" : "form-input"}
          />
          {errors.longitude ? <p className="field-error-text">{errors.longitude}</p> : null}
        </div>
      </div>

      {/* 5. Price */}
      <div className="form-group">
        <label className="form-label" htmlFor="hotel-price-input">
          Price per Night (₹) <span className="req-star">*</span>
        </label>
        <input
          id="hotel-price-input"
          name="price"
          type="number"
          min="1"
          step="0.01"
          value={values.price}
          onChange={handleChange}
          placeholder="e.g. 4500"
          className={errors.price ? "form-input input-error" : "form-input"}
        />
        {errors.price ? <p className="field-error-text">{errors.price}</p> : null}
      </div>

      {/* Submit Button */}
      <div className="form-actions-bar">
        <button type="submit" className="btn-submit-hotel" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default HotelForm;
