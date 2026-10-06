import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ListingDetails = ({ listing, onBuyNow, isOwner }) => {
  if (!listing) return null;

  const { title, category, price, quantity, unit, location, description, createdAt, seller } = listing;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-64 md:h-full bg-gray-100 relative min-h-[300px]">
          <img
            src={listing.imageUrl || 'https://images.unsplash.com/photo-1595665593673-bf1ad72905c0?auto=format&fit=crop&q=80&w=800'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <span className="text-xs text-gray-400">{formatDate(createdAt)}</span>
            </div>

            <p className="text-sm text-gray-500 mt-1">📍 {location || 'Location unspecified'}</p>

            <div className="mt-6 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">Unit Price</p>
              <p className="text-3xl font-black text-emerald-700 mt-1">
                {formatCurrency(price)} <span className="text-sm font-normal text-gray-500">/ {unit || 'kg'}</span>
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-700 border-b border-gray-100 pb-4">
              <span>Available Quantity:</span>
              <span className="font-bold text-gray-900">{quantity} {unit || 'kg'}</span>
            </div>

            {description && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            )}

            {seller && (
              <div className="mt-4 text-xs text-gray-500">
                Listed by: <span className="font-medium text-gray-800">{seller.name || 'Seller'}</span>
              </div>
            )}
          </div>

          {!isOwner ? (
            <button
              onClick={onBuyNow}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
            >
              Initiate Purchase
            </button>
          ) : (
            <div className="bg-amber-50 text-amber-800 text-center py-2.5 px-4 rounded-lg text-sm font-medium">
              This is your listing
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;