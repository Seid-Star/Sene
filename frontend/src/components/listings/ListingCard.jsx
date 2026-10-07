
import { formatCurrency } from "../../utils/formatters";

const ListingCard = ({ listing, onViewDetails }) => {
  const {
    _id,
    crop,
    pricePerKg,
    quantityKg,
    region,
    town,
    seller,
  } = listing;

  const location = [town, region].filter(Boolean).join(", ");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1595665593673-bf1ad72905c0?auto=format&fit=crop&q=80&w=400"
          alt={crop}
          className="w-full h-full object-cover"
        />

        {location && (
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
            📍 {location}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 capitalize truncate">
            {crop}
          </h3>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600">
              {formatCurrency(pricePerKg)}
            </span>

            <span className="text-sm text-gray-500 font-medium">
              per kg
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Available:{" "}
            <span className="font-semibold text-gray-800">
              {quantityKg} kg
            </span>
          </p>

          {seller?.fullName && (
            <p className="mt-2 text-sm text-gray-500">
              Seller:{" "}
              <span className="font-medium text-gray-700">
                {seller.fullName}
              </span>
            </p>
          )}
        </div>

        <button
          onClick={() => onViewDetails && onViewDetails(_id)}
          className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ListingCard;
