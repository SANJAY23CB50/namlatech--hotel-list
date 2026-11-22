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
    const name = event.target.name;
    const value = event.target.value;
    setValues(function (current) {
      return { ...current, [name]: value };
    });
  }

  function handleImage(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
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
    <form className="hotel-form" onSubmit={handleSubmit} noValidate>
      <label className="image-field">
        <span>Hotel image</span>
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} />
        {preview ? (
          <img src={preview} alt={values.title ? values.title + " preview" : "Hotel image preview"} />
        ) : (
          <div className="image-placeholder">Choose a photo to preview it here</div>
        )}
        {errors.image ? <small className="field-error">{errors.image}</small> : null}
      </label>

      <label>
        <span>Hotel title</span>
        <input name="title" value={values.title} onChange={handleChange} placeholder="Oceanview Inn" />
        {errors.title ? <small className="field-error">{errors.title}</small> : null}
      </label>

      <label>
        <span>Description</span>
        <textarea
          name="description"
          rows="5"
          value={values.description}
          onChange={handleChange}
          placeholder="Describe the stay, rooms, and nearby attractions."
        />
        {errors.description ? <small className="field-error">{errors.description}</small> : null}
      </label>

      <div className="form-row">
        <label>
          <span>Latitude</span>
          <input name="latitude" value={values.latitude} onChange={handleChange} placeholder="12.9716" />
          {errors.latitude ? <small className="field-error">{errors.latitude}</small> : null}
        </label>
        <label>
          <span>Longitude</span>
          <input name="longitude" value={values.longitude} onChange={handleChange} placeholder="77.5946" />
          {errors.longitude ? <small className="field-error">{errors.longitude}</small> : null}
        </label>
      </div>

      <label>
        <span>Price per night</span>
        <input name="price" type="number" min="1" step="0.01" value={values.price} onChange={handleChange} placeholder="3500" />
        {errors.price ? <small className="field-error">{errors.price}</small> : null}
      </label>

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default HotelForm;
