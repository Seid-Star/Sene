

import { VoxideClient, VoxideWidget } from "@voxide/react";

import {
  getPriceSummary,
  createListing as createListingApi,
  getMyListings,
  updateListing as updateListingApi,
  cancelListing as cancelListingApi,
} from "./services/listingService";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";

const ai = new VoxideClient({
  publicKey: "vox_pub_0a4e956f6f7a89c099bf6d0362283a6b4b86f5d30ee47f95",
});

ai.register({
  getPrice: {
    description:
      "Get the current market price of a crop. Use this when the user asks how much a crop costs or asks for its current price.",
    params: {
      crop: {
        type: "string",
        required: true,
        description: "The crop the user wants the current price for.",
        enum: [
          "teff",
          "onion",
          "tomato",
          "potato",
          "wheat",
          "maize",
          "barley",
          "sorghum",
          "coffee",
          "other",
        ],
      },
      region: {
        type: "string",
        required: false,
        description:
          "The Ethiopian region to check the price in, if specified.",
        enum: [
          "Addis Ababa",
          "Afar",
          "Amhara",
          "Benishangul-Gumuz",
          "Central Ethiopia",
          "Dire Dawa",
          "Gambela",
          "Harari",
          "Oromia",
          "Sidama",
          "Somali",
          "South Ethiopia",
          "South West Ethiopia",
          "Tigray",
        ],
      },
    },
    handler: async ({ crop, region }) => {
      try {
        const result = await getPriceSummary(crop, region);

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          message:
            error.response?.data?.message ||
            "I could not get the current price. Please try again.",
        };
      }
    },
  },

  createListing: {
    description:
      "Create a new produce listing for the farmer. Use this when the user wants to sell or list produce. The user must provide the crop, quantity, and either the total price or price per kilogram.",
    params: {
      crop: {
        type: "string",
        required: true,
        description: "The crop the farmer wants to sell.",
        enum: [
          "teff",
          "onion",
          "tomato",
          "potato",
          "wheat",
          "maize",
          "barley",
          "sorghum",
          "coffee",
          "other",
        ],
      },
      quantityKg: {
        type: "number",
        required: true,
        description:
          "The amount of produce the farmer wants to sell, in kilograms.",
      },
      totalPrice: {
        type: "number",
        required: false,
        description:
          "The total price for all of the produce in Ethiopian birr.",
      },
      pricePerKg: {
        type: "number",
        required: false,
        description:
          "The price for one kilogram in Ethiopian birr.",
      },
      quality: {
        type: "string",
        required: false,
        description: "The quality grade of the produce.",
        enum: ["ungraded", "grade1", "grade2", "grade3"],
      },
      variety: {
        type: "string",
        required: false,
        description: "The variety of the crop, if the user mentions it.",
      },
      description: {
        type: "string",
        required: false,
        description:
          "Additional information about the produce, if the user mentions it.",
      },
    },

    handler: async ({
      crop,
      quantityKg,
      totalPrice,
      pricePerKg,
      quality,
      variety,
      description,
    }) => {
      try {
        if (totalPrice === undefined && pricePerKg === undefined) {
          return {
            success: false,
            message:
              "Please provide either the total price or the price per kilogram.",
          };
        }

        if (totalPrice !== undefined && pricePerKg !== undefined) {
          return {
            success: false,
            message:
              "Please provide either the total price or the price per kilogram, not both.",
          };
        }

        const listingData = {
          crop,
          quantityKg,
          ...(totalPrice !== undefined && { totalPrice }),
          ...(pricePerKg !== undefined && { pricePerKg }),
          ...(quality && { quality }),
          ...(variety && { variety }),
          ...(description && { description }),
        };

        const result = await createListingApi(listingData);

        return {
          success: true,
          message: "Your produce listing was created successfully.",
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          message:
            error.response?.data?.message ||
            "I could not create your listing. Please try again.",
        };
      }
    },
  },

  getMyListings: {
    description:
      "Get the farmer's own produce listings. Use this when the user asks to see, check, or list their own produce listings.",
    params: {},

    handler: async () => {
      try {
        const result = await getMyListings();

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          message:
            error.response?.data?.message ||
            "I could not get your listings. Please try again.",
        };
      }
    },
  },

  updateListing: {
    description:
      "Update the farmer's existing produce listing. Use this when the farmer wants to change the quantity, price, quality, variety, description, region, town, or harvest date of an existing listing.",
    params: {
      id: {
        type: "string",
        required: true,
        description:
          "The ID of the listing the farmer wants to update.",
      },
      quantityKg: {
        type: "number",
        required: false,
        description:
          "The new quantity of the produce in kilograms.",
      },
      pricePerKg: {
        type: "number",
        required: false,
        description:
          "The new price per kilogram in Ethiopian birr.",
      },
      quality: {
        type: "string",
        required: false,
        description: "The new quality grade of the produce.",
        enum: ["ungraded", "grade1", "grade2", "grade3"],
      },
      variety: {
        type: "string",
        required: false,
        description: "The new variety of the crop.",
      },
      description: {
        type: "string",
        required: false,
        description: "The new description of the produce.",
      },
      region: {
        type: "string",
        required: false,
        description:
          "The new Ethiopian region of the listing.",
        enum: [
          "Addis Ababa",
          "Afar",
          "Amhara",
          "Benishangul-Gumuz",
          "Central Ethiopia",
          "Dire Dawa",
          "Gambela",
          "Harari",
          "Oromia",
          "Sidama",
          "Somali",
          "South Ethiopia",
          "South West Ethiopia",
          "Tigray",
        ],
      },
      town: {
        type: "string",
        required: false,
        description: "The new town of the listing.",
      },
      harvestDate: {
        type: "string",
        required: false,
        description: "The harvest date of the produce.",
      },
    },

    handler: async ({
      id,
      quantityKg,
      pricePerKg,
      quality,
      variety,
      description,
      region,
      town,
      harvestDate,
    }) => {
      try {
        const listingData = {
          ...(quantityKg !== undefined && { quantityKg }),
          ...(pricePerKg !== undefined && { pricePerKg }),
          ...(quality && { quality }),
          ...(variety && { variety }),
          ...(description && { description }),
          ...(region && { region }),
          ...(town && { town }),
          ...(harvestDate && { harvestDate }),
        };

        if (Object.keys(listingData).length === 0) {
          return {
            success: false,
            message: "Please provide at least one field to update.",
          };
        }

        const result = await updateListingApi(id, listingData);

        return {
          success: true,
          message: "Your listing was updated successfully.",
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          message:
            error.response?.data?.message ||
            "I could not update your listing. Please try again.",
        };
      }
    },
  },

  cancelListing: {
    description:
      "Cancel one of the farmer's active produce listings. Use this when the user wants to remove or cancel a listing.",
    params: {
      id: {
        type: "string",
        required: true,
        description:
          "The ID of the listing the farmer wants to update.",
      },
    },

    handler: async ({ id }) => {
      try {
        const result = await cancelListingApi(id);

        return {
          success: true,
          message: "Your listing was cancelled successfully.",
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          message:
            error.response?.data?.message ||
            "I could not cancel your listing. Please try again.",
        };
      }
    },
  },
});

function App() {
  return (
    <>
        <Navbar />
        <AppRoutes />
        <VoxideWidget client={ai} />
    </>
  );
}

export default App;