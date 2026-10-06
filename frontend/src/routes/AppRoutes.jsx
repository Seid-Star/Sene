import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Marketplace from "../pages/Marketplace";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default AppRoutes;