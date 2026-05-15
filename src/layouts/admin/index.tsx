// @ts-nocheck
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes";
import UserCreatePage from "views/admin/users/UserCreatePage";
import TrainersPage from "views/admin/trainers";
import TrainerCreatePage from "views/admin/trainers/TrainerCreatePage";
import TrainerEditPage from "views/admin/trainers/TrainerEditPage";
import TrainerProfilePage from "views/admin/trainers/TrainerProfilePage";
import UserEditPage from "views/admin/users/UserEditPage";
import UserProfilePage from "views/admin/users/UserProfilePage";
import LocationCreatePage from "views/admin/locations/LocationCreatePage";
import LocationDetailPage from "views/admin/locations/LocationDetailPage";
import LocationEditPage from "views/admin/locations/LocationEditPage";
import CategoryCreatePage from "views/admin/categories/CategoryCreatePage";
import CategoryDetailPage from "views/admin/categories/CategoryDetailPage";
import CategoryEditPage from "views/admin/categories/CategoryEditPage";
import ProgramsPage from "views/admin/programs";
import ProgramCreatePage from "views/admin/programs/ProgramCreatePage";
import ProgramEditPage from "views/admin/programs/ProgramEditPage";
import ProgramDetailPage from "views/admin/programs/ProgramDetailPage";
import FieldCreatePage from "views/admin/fields/FieldCreatePage";
import FieldEditPage from "views/admin/fields/FieldEditPage";
import FieldDetailPage from "views/admin/fields/FieldDetailPage";
import RegistrationsPage from "views/admin/registrations";
import RegistrationDetailPage from "views/admin/registrations/RegistrationDetailPage";
import RegistrationEditPage from "views/admin/registrations/RegistrationEditPage";
import PaymentsPage from "views/admin/payments";
import PaymentCreatePage from "views/admin/payments/PaymentCreatePage";
import PaymentDetailPage from "views/admin/payments/PaymentDetailPage";
import PaymentEditPage from "views/admin/payments/PaymentEditPage";
import ContactsPage from "views/admin/contact";
import ContactDetailPage from "views/admin/contact/ContactDetailPage";
import ContactEditPage from "views/admin/contact/ContactEditPage";
import ServicesPage from "views/admin/services";
import ServiceCreatePage from "views/admin/services/ServiceCreatePage";
import ServiceDetailPage from "views/admin/services/ServiceDetailPage";
import ServiceEditPage from "views/admin/services/ServiceEditPage";
import PartnershipsPage from "views/admin/partnerships";
import PartnershipCreatePage from "views/admin/partnerships/PartnershipCreatePage";
import PartnershipDetailPage from "views/admin/partnerships/PartnershipDetailPage";
import PartnershipEditPage from "views/admin/partnerships/PartnershipEditPage";
import CertificatesPage from "views/admin/certificates";
import CertificateCreatePage from "views/admin/certificates/CertificateCreatePage";
import CertificateDetailPage from "views/admin/certificates/CertificateDetailPage";
import CertificateEditPage from "views/admin/certificates/CertificateEditPage";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary ">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[276px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-6 mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{    opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
              <Routes>
                {getRoutes(routes)}
                <Route path="/users/create"          element={<UserCreatePage />} />
                <Route path="/users/:uid/edit"        element={<UserEditPage />} />
                <Route path="/users/:uid"             element={<UserProfilePage />} />
                <Route path="/trainers"              element={<TrainersPage />} />
                <Route path="/trainers/create"       element={<TrainerCreatePage />} />
                <Route path="/trainers/:uid/edit"    element={<TrainerEditPage />} />
                <Route path="/trainers/:uid"         element={<TrainerProfilePage />} />
                <Route path="/locations/create"      element={<LocationCreatePage />} />
                <Route path="/locations/:uid"        element={<LocationDetailPage />} />
                <Route path="/locations/:uid/edit"   element={<LocationEditPage />} />
                <Route path="/categories/create"    element={<CategoryCreatePage />} />
                <Route path="/categories/:uid"      element={<CategoryDetailPage />} />
                <Route path="/categories/:uid/edit" element={<CategoryEditPage />} />
                <Route path="/programs"             element={<ProgramsPage />} />
                <Route path="/programs/:uid"        element={<ProgramDetailPage />} />
                <Route path="/programs/create"      element={<ProgramCreatePage />} />
                <Route path="/programs/:uid/edit"   element={<ProgramEditPage />} />
                <Route path="/fields/create"        element={<FieldCreatePage />} />
                <Route path="/fields/:uid"          element={<FieldDetailPage />} />
                <Route path="/fields/:uid/edit"       element={<FieldEditPage />} />
                <Route path="/registrations"              element={<RegistrationsPage />} />
                <Route path="/registrations/:uid"          element={<RegistrationDetailPage />} />
                <Route path="/registrations/:id/edit"     element={<RegistrationEditPage />} />
                <Route path="/payments"                   element={<PaymentsPage />} />
                <Route path="/payments/create"              element={<PaymentCreatePage />} />
                <Route path="/payments/:uid"             element={<PaymentDetailPage />} />
                <Route path="/payments/:uid/edit"        element={<PaymentEditPage />} />
                <Route path="/contact"                    element={<ContactsPage />} />
                <Route path="/contact/:uid"               element={<ContactDetailPage />} />
                <Route path="/contact/:uid/edit"          element={<ContactEditPage />} />
                <Route path="/services"                   element={<ServicesPage />} />
                <Route path="/services/create"            element={<ServiceCreatePage />} />
                <Route path="/services/:uid"              element={<ServiceDetailPage />} />
                <Route path="/services/:uid/edit"         element={<ServiceEditPage />} />
                <Route path="/partnerships"               element={<PartnershipsPage />} />
                <Route path="/partnerships/create"        element={<PartnershipCreatePage />} />
                <Route path="/partnerships/:uid"          element={<PartnershipDetailPage />} />
                <Route path="/partnerships/:uid/edit"     element={<PartnershipEditPage />} />
                <Route path="/certificates"               element={<CertificatesPage />} />
                <Route path="/certificates/create"        element={<CertificateCreatePage />} />
                <Route path="/certificates/:uid"          element={<CertificateDetailPage />} />
                <Route path="/certificates/:uid/edit"     element={<CertificateEditPage />} />

                <Route
                  path="/"
                  element={<Navigate to="/admin/default" replace />}
                />
              </Routes>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
