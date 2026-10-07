import ListingCard from "../listings/ListingCard";

function ProduceList({ listings = [] }) {
  if (!listings.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl">
          🌾
        </div>

        <h3 className="mt-5 text-lg font-semibold text-gray-900">
          No produce found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Try another search term or change the category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing._id || listing.id}
          listing={listing}
        />
      ))}
    </div>
  );
}

export default ProduceList;