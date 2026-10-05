import { useRef, useState } from "react";
import { DEFAULT_LANGUAGE, getListingFormLabels } from "./listingFormLabels";
import "./ListingForm.css";

// The values sent to the backend. Translated names are only for display.
// ASSUMPTION: confirm the allowed units with Seid's Listing model.
const UNIT_VALUES = ["kg", "quintal", "ton"];
const LIMITS = { cropNameMin: 2, cropNameMax: 60, descriptionMax: 500 };
const REQUIRED_FIELDS = [
  "cropName",
  "quantity",
  "unit",
  "pricePerUnit",
  "location",
];

// Props:
//   onSubmit      - async (values) => void. The parent saves the data.
//                   If it throws, the form shows the error message.
//   initialValues - optional listing object, used in edit mode
//   submitLabel   - optional button text (overrides the default)
//   lang          - 'am' | 'om' | 'en' (default 'am')
function ListingForm({
  onSubmit,
  initialValues,
  submitLabel,
  lang = DEFAULT_LANGUAGE,
}) {
  // t holds all the text for the chosen language.
  const t = getListingFormLabels(lang);
  const isEdit = Boolean(initialValues);

  // One state object holds every input. Inputs always hold text,
  // so numbers are converted to strings.
  const [values, setValues] = useState(() => ({
    cropName: initialValues?.cropName ?? "",
    quantity:
      initialValues?.quantity != null ? String(initialValues.quantity) : "",
    unit: initialValues?.unit ?? "",
    pricePerUnit:
      initialValues?.pricePerUnit != null
        ? String(initialValues.pricePerUnit)
        : "",
    location: initialValues?.location ?? "",
    description: initialValues?.description ?? "",
  }));

  // Remembers which fields the user has already visited.
  const [touched, setTouched] = useState({});
  // True after the user presses the submit button at least once.
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // A ref changes instantly, while state updates on the next render.
  // It blocks a second tap that arrives before the button is disabled.
  const submittingRef = useRef(false);

  // In edit mode, keep a unit from the backend even if it is not in our list.
  const unitOptions =
    values.unit && !UNIT_VALUES.includes(values.unit)
      ? [...UNIT_VALUES, values.unit]
      : UNIT_VALUES;

  // Runs on every keystroke. The input's name tells us which value to update.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  // Runs when the user leaves a field.
  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((previous) => ({ ...previous, [name]: true }));
  };

  // Errors are worked out on every render from the current values.
  // They are not stored in state, so they can never be out of date.
  const errors = {};

  const cropName = values.cropName.trim();
  if (!cropName) {
    errors.cropName = t.errors.required;
  } else if (cropName.length < LIMITS.cropNameMin) {
    errors.cropName = t.errors.cropNameShort.replace(
      "{min}",
      LIMITS.cropNameMin,
    );
  }

  ["quantity", "pricePerUnit"].forEach((field) => {
    const text = values[field].trim();
    if (!text) {
      errors[field] = t.errors.required;
    } else if (!/^\d+(\.\d+)?$/.test(text) || Number(text) <= 0) {
      errors[field] = t.errors.positiveNumber;
    }
  });

  if (!values.unit) errors.unit = t.errors.selectUnit;
  if (!values.location.trim()) errors.location = t.errors.required;

  const hasErrors = Object.keys(errors).length > 0;

  // Only show an error for fields the user has visited.
  const visibleError = (field) => (touched[field] ? errors[field] : undefined);

  const handleSubmit = async (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    if (submittingRef.current) return;

    // Show every error, even for fields the user never visited.
    setAttempted(true);
    setTouched(
      Object.fromEntries(REQUIRED_FIELDS.map((field) => [field, true])),
    );
    if (hasErrors) return;

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError("");

    try {
      // We do NOT calculate a total price. The backend decides that.
      await onSubmit({
        cropName: values.cropName.trim(),
        quantity: Number(values.quantity),
        unit: values.unit,
        pricePerUnit: Number(values.pricePerUnit),
        location: values.location.trim(),
        description: values.description.trim(),
      });
    } catch (error) {
      setSubmitError(error?.message || t.errors.generic);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const buttonText = submitting
    ? t.saving
    : submitLabel || (isEdit ? t.submitEdit : t.submitCreate);

  return (
    <form
      className="listing-form"
      lang={lang}
      onSubmit={handleSubmit}
      noValidate
    >
      <p className="listing-form__note">{t.requiredNote}</p>

      {attempted && hasErrors && (
        <p className="listing-form__alert" role="alert">
          {t.errors.fixErrors}
        </p>
      )}
      {submitError && (
        <p className="listing-form__alert" role="alert">
          {submitError}
        </p>
      )}

      <div className="listing-form__field">
        <label htmlFor="listing-form-cropName">
          {t.cropName.label} <span aria-hidden="true">*</span>
        </label>
        <input
          id="listing-form-cropName"
          name="cropName"
          type="text"
          autoComplete="off"
          maxLength={LIMITS.cropNameMax}
          placeholder={t.cropName.placeholder}
          value={values.cropName}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          aria-required="true"
          aria-invalid={visibleError("cropName") ? "true" : undefined}
          aria-describedby={
            visibleError("cropName") ? "listing-form-cropName-error" : undefined
          }
        />
        <FieldError
          id="listing-form-cropName-error"
          message={visibleError("cropName")}
        />
      </div>

      <div className="listing-form__row">
        <div className="listing-form__field">
          <label htmlFor="listing-form-quantity">
            {t.quantity.label} <span aria-hidden="true">*</span>
          </label>
          <input
            id="listing-form-quantity"
            name="quantity"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder={t.quantity.placeholder}
            value={values.quantity}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={submitting}
            aria-required="true"
            aria-invalid={visibleError("quantity") ? "true" : undefined}
            aria-describedby={
              visibleError("quantity")
                ? "listing-form-quantity-error"
                : undefined
            }
          />
          <FieldError
            id="listing-form-quantity-error"
            message={visibleError("quantity")}
          />
        </div>

        <div className="listing-form__field">
          <label htmlFor="listing-form-unit">
            {t.unit.label} <span aria-hidden="true">*</span>
          </label>
          <select
            id="listing-form-unit"
            name="unit"
            value={values.unit}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={submitting}
            aria-required="true"
            aria-invalid={visibleError("unit") ? "true" : undefined}
            aria-describedby={
              visibleError("unit") ? "listing-form-unit-error" : undefined
            }
          >
            <option value="">{t.unit.placeholder}</option>
            {unitOptions.map((unit) => (
              <option key={unit} value={unit}>
                {t.units[unit] ?? unit}
              </option>
            ))}
          </select>
          <FieldError
            id="listing-form-unit-error"
            message={visibleError("unit")}
          />
        </div>
      </div>

      <div className="listing-form__field">
        <label htmlFor="listing-form-pricePerUnit">
          {t.pricePerUnit.label} <span aria-hidden="true">*</span>
        </label>
        <input
          id="listing-form-pricePerUnit"
          name="pricePerUnit"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={t.pricePerUnit.placeholder}
          value={values.pricePerUnit}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          aria-required="true"
          aria-invalid={visibleError("pricePerUnit") ? "true" : undefined}
          aria-describedby={
            visibleError("pricePerUnit")
              ? "listing-form-pricePerUnit-error"
              : undefined
          }
        />
        <FieldError
          id="listing-form-pricePerUnit-error"
          message={visibleError("pricePerUnit")}
        />
      </div>

      <div className="listing-form__field">
        <label htmlFor="listing-form-location">
          {t.location.label} <span aria-hidden="true">*</span>
        </label>
        <input
          id="listing-form-location"
          name="location"
          type="text"
          autoComplete="off"
          placeholder={t.location.placeholder}
          value={values.location}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          aria-required="true"
          aria-invalid={visibleError("location") ? "true" : undefined}
          aria-describedby={
            visibleError("location") ? "listing-form-location-error" : undefined
          }
        />
        <FieldError
          id="listing-form-location-error"
          message={visibleError("location")}
        />
      </div>

      <div className="listing-form__field">
        <label htmlFor="listing-form-description">
          {t.description.label} {t.optional}
        </label>
        <textarea
          id="listing-form-description"
          name="description"
          rows={4}
          maxLength={LIMITS.descriptionMax}
          placeholder={t.description.placeholder}
          value={values.description}
          onChange={handleChange}
          disabled={submitting}
        />
        <p className="listing-form__counter">
          {values.description.length}/{LIMITS.descriptionMax}
        </p>
      </div>

      <button
        type="submit"
        className="listing-form__submit"
        disabled={submitting}
        aria-busy={submitting}
      >
        {buttonText}
      </button>
    </form>
  );
}

// Small helper component: shows one error message under a field.
// If there is no message, it shows nothing.
function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="listing-form__error">
      {message}
    </p>
  );
}

export default ListingForm;
