import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile"; // 👈 tu vista de perfil
import DashboardLayout from "./pages/Dashboard"; // 👈 tu layout/dashboard base
import Register from "./pages/Register";
import CoursesList from "./pages/CoursesList";
import UsersList from "./pages/UserList";
import MyCourses from "./pages/MyCourses";
import CreateGroup from "./pages/CreateGroup";
import PublicGroups from "./pages/PublicGroups";
import MyGroups from "./pages/MyGroups";
import GroupDetails from "./pages/GroupDetails";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de Login (fuera del layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardLayout />} />

        


        {/* Rutas dentro del Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/users-list" element={<UsersList />} />
          <Route path="/course-list" element={<CoursesList />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/create-groups" element={<CreateGroup />} />
          <Route path="/list-groups" element={<PublicGroups />} />
          <Route path="/my-groups" element={<MyGroups />} />
          <Route path="/groups/:id" element={<GroupDetails />} />

          
          {/* 👆 aquí podés ir agregando otras vistas: /menu, /reports, etc. */}
        </Route>
        

        {/* Ruta por defecto */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
