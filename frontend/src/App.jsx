
import { VoxideClient, VoxideWidget } from "@voxide/react";
import { getPriceSummary } from "./services/listingService";

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
        description:
          "The crop the user wants the current price for. Must be one of: teff, onion, tomato, potato, wheat, maize, barley, sorghum, coffee, other.",
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
        description: "The Ethiopian region to check the price in, if specified.",
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