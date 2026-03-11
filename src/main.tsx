import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import Dashboard from "@/pages/admin/Dashboard.jsx";
import Reservations from "@/pages/admin/Reservations.jsx";
import GuestManagement from "@/pages/admin/GuestManagement.jsx";
import EmployeeManagement from "@/pages/admin/EmployeeManagement.jsx";
import RoomTypes from "@/pages/admin/RoomTypes.jsx";
import RoomManagement from "@/pages/admin/RoomManagement.jsx"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/guests" element={<GuestManagement />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/roomtypes" element={<RoomTypes />} />
        <Route path="/rooms" element={<RoomManagement />} />
        {/* later */}
        {/* <Route path="/rooms" element={<Rooms />} /> */}
      </Route>
    </Routes>
  </BrowserRouter>
)