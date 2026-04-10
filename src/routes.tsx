// @ts-nocheck
import React from "react";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import UsersPage from "views/admin/users";
import LocationsPage from "views/admin/locations";
import CategoriesPage from "views/admin/categories";
import CoursesPage from "views/admin/courses";
import ProgramsPage from "views/admin/programs";

// Account Manager Imports
import ManagerDashboard from "views/manager/dashboard";
import ManagerProfile from "views/manager/profile";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdDashboard,
  MdPeople,
  MdLocationOn,
  MdCategory,
  MdSchool,
  MdWorkspacePremium,
} from "react-icons/md";

const routes = [
  // Auth routes
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    component: <SignIn />,
  },

  // Admin routes
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <MdPeople className="h-6 w-6" />,
    component: <UsersPage />,
  },
  {
    name: "Locations",
    layout: "/admin",
    path: "locations",
    icon: <MdLocationOn className="h-6 w-6" />,
    component: <LocationsPage />,
  },
  {
    name: "Categories",
    layout: "/admin",
    path: "categories",
    icon: <MdCategory className="h-6 w-6" />,
    component: <CategoriesPage />,
  },
  {
    name: "Courses",
    layout: "/admin",
    path: "courses",
    icon: <MdSchool className="h-6 w-6" />,
    component: <CoursesPage />,
  },
  {
    name: "Programs",
    layout: "/admin",
    path: "programs",
    icon: <MdWorkspacePremium className="h-6 w-6" />,
    component: <ProgramsPage />,
  },

  // Account Manager routes
  {
    name: "Dashboard",
    layout: "/account-manager",
    path: "dashboard",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <ManagerDashboard />,
  },
  {
    name: "Profile",
    layout: "/account-manager",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ManagerProfile />,
  },
];

export default routes;
