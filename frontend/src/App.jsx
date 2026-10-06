import { VoxideClient, VoxideWidget } from "@voxide/react";
import "./App.css";
const ai = new VoxideClient({
  publicKey: "vox_pub_0a4e956f6f7a89c099bf6d0362283a6b4b86f5d30ee47f95",
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