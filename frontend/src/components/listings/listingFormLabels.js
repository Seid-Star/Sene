// All text for ListingForm lives in this file, so languages can be added
// or corrected without touching the form logic.

export const DEFAULT_LANGUAGE = "am";

export const LISTING_FORM_LABELS = {
  am: {
    requiredNote: "* ምልክት ያላቸው መስኮች ያስፈልጋሉ።",
    optional: "(አማራጭ)",
    cropName: { label: "የሰብል ስም", placeholder: "ለምሳሌ፦ ጤፍ" },
    quantity: { label: "ብዛት", placeholder: "ለምሳሌ፦ 50" },
    unit: { label: "መለኪያ", placeholder: "መለኪያ ይምረጡ" },
    units: { kg: "ኪሎ (ኪ.ግ)", quintal: "ኩንታል", ton: "ቶን" },
    pricePerUnit: { label: "የአንድ መለኪያ ዋጋ (ብር)", placeholder: "ለምሳሌ፦ 2200" },
    location: { label: "አካባቢ", placeholder: "ለምሳሌ፦ አዳማ" },
    description: { label: "መግለጫ", placeholder: "ስለ ምርቱ ጥራት ወይም ሁኔታ ይጻፉ" },
    submitCreate: "ምርቱን ለሽያጭ አቅርብ",
    submitEdit: "ለውጦችን አስቀምጥ",
    saving: "በማስቀመጥ ላይ…",
    errors: {
      required: "ይህ መስክ ያስፈልጋል።",
      cropNameShort: "የሰብል ስም ቢያንስ {min} ፊደላት መሆን አለበት።",
      positiveNumber: "ከ0 የሚበልጥ ቁጥር ያስገቡ።",
      selectUnit: "መለኪያ ይምረጡ።",
      fixErrors: "እባክዎ ከታች ያሉትን ስህተቶች ያስተካክሉ።",
      generic: "ማስቀመጥ አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
    },
  },
  om: {
    requiredNote: "Kutaaleen * qaban ni barbaachisu.",
    optional: "(filannoo)",
    cropName: { label: "Maqaa oomishaa", placeholder: "Fkn: Xaafii" },
    quantity: { label: "Hanga", placeholder: "Fkn: 50" },
    unit: { label: "Safartuu", placeholder: "Safartuu filadhu" },
    units: { kg: "Kiiloo (kg)", quintal: "Kuntaala", ton: "Tonii" },
    pricePerUnit: {
      label: "Gatii safartuu tokkoo (Birrii)",
      placeholder: "Fkn: 2200",
    },
    location: { label: "Bakka", placeholder: "Fkn: Adaamaa" },
    description: {
      label: "Ibsa",
      placeholder: "Waa’ee qulqullina oomishaa barreessi",
    },
    submitCreate: "Oomisha gurguruuf dhiyeessi",
    submitEdit: "Jijjiirama olkaa’i",
    saving: "Olkaa’aa jira…",
    errors: {
      required: "Kutaan kun ni barbaachisa.",
      cropNameShort: "Maqaan oomishaa yoo xiqqaate qubee {min} qabaachuu qaba.",
      positiveNumber: "Lakkoofsa 0 caalu galchi.",
      selectUnit: "Safartuu filadhu.",
      fixErrors: "Mee dogoggora gadii sirreessi.",
      generic: "Olkaa’uun hin danda’amne. Mee irra deebi’ii yaali.",
    },
  },
  en: {
    requiredNote: "Fields marked * are required.",
    optional: "(optional)",
    cropName: { label: "Crop name", placeholder: "e.g. Teff" },
    quantity: { label: "Quantity", placeholder: "e.g. 50" },
    unit: { label: "Unit", placeholder: "Choose a unit" },
    units: { kg: "Kilogram (kg)", quintal: "Quintal", ton: "Ton" },
    pricePerUnit: { label: "Price per unit (ETB)", placeholder: "e.g. 2200" },
    location: { label: "Location", placeholder: "e.g. Adama" },
    description: {
      label: "Description",
      placeholder: "Describe the quality or condition",
    },
    submitCreate: "List for sale",
    submitEdit: "Save changes",
    saving: "Saving…",
    errors: {
      required: "This field is required.",
      cropNameShort: "Crop name must be at least {min} characters.",
      positiveNumber: "Enter a number greater than 0.",
      selectUnit: "Choose a unit.",
      fixErrors: "Please fix the errors below.",
      generic: "Could not save. Please try again.",
    },
  },
};

// Unknown language codes fall back to English instead of crashing.
export const getListingFormLabels = (lang) =>
  LISTING_FORM_LABELS[lang] ?? LISTING_FORM_LABELS.en;
