// @ts-nocheck
import React from "react";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Admin Imports
import MainDashboard    from "views/admin/default";
import Profile          from "views/admin/profile";
import UsersPage        from "views/admin/users";
import TrainersPage     from "views/admin/trainers";
import LocationsPage    from "views/admin/locations";
import CategoriesPage   from "views/admin/categories";
import ProgramsPage     from "views/admin/programs";
import FieldsPage       from "views/admin/fields";
import RegistrationsPage from "views/admin/registrations";
import PaymentsPage     from "views/admin/payments";
import ContactsPage          from "views/admin/contact";
import ServicesPage from "views/admin/services";
import PartnershipsPage       from "views/admin/partnerships";
import CertificatesPage from "views/admin/certificates";
import FeedbacksPage    from "views/admin/feedbacks";
import EmailsPage       from "views/admin/emails";

// Account Manager Imports
import ManagerDashboard      from "views/account-manager/default";
import ManagerProfile        from "views/account-manager/profile";
import ManagerProgramsPage   from "views/account-manager/programs";
import ManagerRegistrationsPage from "views/account-manager/registrations";
import ManagerPaymentsPage   from "views/account-manager/payments";
import ManagerTrainersPage   from "views/account-manager/trainers";
import ManagerCategoriesPage from "views/account-manager/categories";
import ManagerFieldsPage     from "views/account-manager/fields";
import ManagerLocationsPage  from "views/account-manager/locations";
import ManagerServicesPage        from "views/account-manager/services";
import ManagerContactsPage        from "views/account-manager/contact";
import ManagerPartnershipsPage    from "views/account-manager/partnerships";
import ManagerCertificatesPage   from "views/account-manager/certificates";
import ManagerFeedbacksPage      from "views/account-manager/feedbacks";
import ManagerEmailsPage         from "views/account-manager/emails";

// Icon Imports
import {
  MdHome,
  MdPerson,
  MdDashboard,
  MdAdminPanelSettings,
  MdLocationOn,
  MdCategory,
  MdSchool,
  MdWorkspacePremium,
  MdLayers,
  MdAssignment,
  MdPayment,
  MdContactMail,
  MdHandshake,
  MdMiscellaneousServices,
  MdVerified,
  MdRateReview,
  MdEmail,
} from "react-icons/md";

const routes = [
  // Auth routes
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    component: <SignIn />,
  },

  // ── Admin routes ──────────────────────────────────────────────────────────
  {
    name: "Dashboard",
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
    hide: true,
  },

  // Manage
  {
    name: "Programs",
    layout: "/admin",
    path: "programs",
    icon: <MdWorkspacePremium className="h-6 w-6" />,
    component: <ProgramsPage />,
    group: "Manage",
  },
  {
    name: "Registrations",
    layout: "/admin",
    path: "registrations",
    icon: <MdAssignment className="h-6 w-6" />,
    component: <RegistrationsPage />,
    group: "Manage",
  },
  {
    name: "Payments",
    layout: "/admin",
    path: "payments",
    icon: <MdPayment className="h-6 w-6" />,
    component: <PaymentsPage />,
    group: "Manage",
  },
  {
    name: "Trainers",
    layout: "/admin",
    path: "trainers",
    icon: <MdSchool className="h-6 w-6" />,
    component: <TrainersPage />,
    group: "Manage",
  },

  // Configure
  {
    name: "Categories",
    layout: "/admin",
    path: "categories",
    icon: <MdCategory className="h-6 w-6" />,
    component: <CategoriesPage />,
    group: "Configure",
  },
  {
    name: "Fields",
    layout: "/admin",
    path: "fields",
    icon: <MdLayers className="h-6 w-6" />,
    component: <FieldsPage />,
    group: "Configure",
  },
  {
    name: "Locations",
    layout: "/admin",
    path: "locations",
    icon: <MdLocationOn className="h-6 w-6" />,
    component: <LocationsPage />,
    group: "Configure",
  },

  {
    name: "Services",
    layout: "/admin",
    path: "services",
    icon: <MdMiscellaneousServices className="h-6 w-6" />,
    component: <ServicesPage />,
    group: "Manage",
  },
  {
    name: "Certificates",
    layout: "/admin",
    path: "certificates",
    icon: <MdVerified className="h-6 w-6" />,
    component: <CertificatesPage />,
    group: "Manage",
  },
  {
    name: "Feedbacks",
    layout: "/admin",
    path: "feedbacks",
    icon: <MdRateReview className="h-6 w-6" />,
    component: <FeedbacksPage />,
    group: "Manage",
  },
  {
    name: "Contact",
    layout: "/admin",
    path: "contact",
    icon: <MdContactMail className="h-6 w-6" />,
    component: <ContactsPage />,
    group: "Admin",
  },
  {
    name: "Partnerships",
    layout: "/admin",
    path: "partnerships",
    icon: <MdHandshake className="h-6 w-6" />,
    component: <PartnershipsPage />,
    group: "Admin",
  },

  // Admin
  {
    name: "Mailing List",
    layout: "/admin",
    path: "emails",
    icon: <MdEmail className="h-6 w-6" />,
    component: <EmailsPage />,
    group: "Admin",
  },
  {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <MdAdminPanelSettings className="h-6 w-6" />,
    component: <UsersPage />,
    group: "Admin",
  },

  // ── Account Manager routes ────────────────────────────────────────────────
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
    hide: true,
  },

  // Manage
  {
    name: "Programs",
    layout: "/account-manager",
    path: "programs",
    icon: <MdWorkspacePremium className="h-6 w-6" />,
    component: <ManagerProgramsPage />,
    group: "Manage",
  },
  {
    name: "Registrations",
    layout: "/account-manager",
    path: "registrations",
    icon: <MdAssignment className="h-6 w-6" />,
    component: <ManagerRegistrationsPage />,
    group: "Manage",
  },
  {
    name: "Payments",
    layout: "/account-manager",
    path: "payments",
    icon: <MdPayment className="h-6 w-6" />,
    component: <ManagerPaymentsPage />,
    group: "Manage",
  },
  {
    name: "Trainers",
    layout: "/account-manager",
    path: "trainers",
    icon: <MdSchool className="h-6 w-6" />,
    component: <ManagerTrainersPage />,
    group: "Manage",
  },
  {
    name: "Services",
    layout: "/account-manager",
    path: "services",
    icon: <MdMiscellaneousServices className="h-6 w-6" />,
    component: <ManagerServicesPage />,
    group: "Manage",
  },

  // Configure
  {
    name: "Categories",
    layout: "/account-manager",
    path: "categories",
    icon: <MdCategory className="h-6 w-6" />,
    component: <ManagerCategoriesPage />,
    group: "Configure",
  },
  {
    name: "Fields",
    layout: "/account-manager",
    path: "fields",
    icon: <MdLayers className="h-6 w-6" />,
    component: <ManagerFieldsPage />,
    group: "Configure",
  },
  {
    name: "Locations",
    layout: "/account-manager",
    path: "locations",
    icon: <MdLocationOn className="h-6 w-6" />,
    component: <ManagerLocationsPage />,
    group: "Configure",
  },
  {
    name: "Feedbacks",
    layout: "/account-manager",
    path: "feedbacks",
    icon: <MdRateReview className="h-6 w-6" />,
    component: <ManagerFeedbacksPage />,
    group: "Manage",
  },
  {
    name: "Contact",
    layout: "/account-manager",
    path: "contact",
    icon: <MdContactMail className="h-6 w-6" />,
    component: <ManagerContactsPage />,
    group: "Admin",
  },
  {
    name: "Partnerships",
    layout: "/account-manager",
    path: "partnerships",
    icon: <MdHandshake className="h-6 w-6" />,
    component: <ManagerPartnershipsPage />,
    group: "Admin",
  },
  {
    name: "Certificates",
    layout: "/account-manager",
    path: "certificates",
    icon: <MdVerified className="h-6 w-6" />,
    component: <ManagerCertificatesPage />,
    group: "Manage",
  },
  {
    name: "Mailing List",
    layout: "/account-manager",
    path: "emails",
    icon: <MdEmail className="h-6 w-6" />,
    component: <ManagerEmailsPage />,
    group: "Admin",
  },

];

export default routes;
