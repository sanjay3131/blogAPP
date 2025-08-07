// App.tsx
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AdminPage from "./Pages/adminPage/AdminPage";
import UserPage from "./Pages/UserProfilePage/UserPage";
import Home from "./Pages/Home";
import BlogPage from "./Pages/BlogPage/BlogPage";
import MainLayouts from "./Pages/layouts/MainLayouts";

import PrivateRoute from "./RouteProtection/PrivateRoute";
import AdminRoute from "./RouteProtection/AdminRoute";
import { Toaster } from "./components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AllBlogs from "./Pages/BlogPage/AllBlogs";
import CreateBlogPage from "./Pages/createBlogPage/CreateBlogPage";
import "react-quill/dist/quill.snow.css";
import ScrollToTop from "./components/ScrollToTop";
import OtherUserPage from "./Pages/UserProfilePage/OtherUserPage";
import EditUserProfile from "./components/EditUserProfile";
import UpdateBlog from "./components/UpdateBlog";
import ErrorPage from "./Pages/ErrorPage";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <ScrollToTop />

      <Routes location={location} key={location.pathname}>
        {/* Layout with Navbar (Main) */}
        <Route element={<MainLayouts />}>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<AllBlogs />} />
          <Route path="/blogs/:id" element={<BlogPage />} />
          <Route path="/createblog" element={<CreateBlogPage />} />

          <Route
            path="/userPage/:id"
            element={
              <PrivateRoute>
                <OtherUserPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/user"
            element={
              <PrivateRoute>
                <UserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/editUserProfile"
            element={
              <PrivateRoute>
                <EditUserProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="/updateBlog/:id"
            element={
              <PrivateRoute>
                <UpdateBlog />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Login / Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Page */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  console.log("Google Client ID:", clientId);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <AnimatedRoutes />
          <Toaster />
        </Suspense>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
