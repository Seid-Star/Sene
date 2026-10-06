
import { VoxideClient, VoxideWidget } from "@voxide/react";
import {
  getPriceSummary,
  createListing as createListingApi,
} from "./services/listingService";

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
        description: "The variety of the crop, if the farmer mentions it.",
      },

      description: {
        type: "string",
        required: false,
        description:
          "Additional information about the produce, if the farmer mentions it.",
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
});

function App() {
  return (
    <>
      <h1>Sene Voice Test</h1>
      <VoxideWidget client={ai} />
    </>
  );
}

export default App;