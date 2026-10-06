import React, { useState } from 'react';

const ListingForm = ({ onSubmit, isLoading, initialValues = {} }) => {
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    category: initialValues.category || 'Grains',
    price: initialValues.price || '',
    quantity: initialValues.quantity || '',
    unit: initialValues.unit || 'kg',
    description: initialValues.description || '',
    location: initialValues.location || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 max-w-xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Produce Listing</h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to list your produce on SENE marketplace.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Produce Title / Commodity <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          placeholder="e.g. Fresh Teff, Red Onions, Sidama Coffee"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white text-gray-800"
          >
            <option value="Grains">Grains</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Coffee">Coffee</option>
            <option value="Pulses">Pulses</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Location <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            required
            placeholder="e.g. Adama, Oromia"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Price (ETB) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            required
            min="0"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Quantity <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            required
            min="1"
            placeholder="100"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Unit</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white text-gray-800"
          >
            <option value="kg">kg</option>
            <option value="Quintal">Quintal</option>
            <option value="Liter">Liter</option>
            <option value="Crate">Crate</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          rows="3"
          placeholder="Include details about harvest date, quality specs, delivery options..."
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Publishing...
          </span>
        ) : (
          'Publish Listing'
        )}
      </button>
    </form>
  );
};

export default ListingForm;