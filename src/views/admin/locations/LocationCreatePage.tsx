// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "context/ToastContext";
import InputField from "components/form/InputField";
import ToggleInput from "components/form/toggle/ToggleInput";
import Button from "components/ui/buttons/Button";
import useCreateLocation from "hooks/locations/useCreateLocation";

const LocationCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createLocation, loading, error, fieldErrors } = useCreateLocation();

  const [form, setForm] = useState({
    name:          "",
    city:          "",
    country:       "",
    address:       "",
    venue_details: "",
    latitude:      "",
    longitude:     "",
    is_active:     true,
    contact_phone:   "",
    whatsapp_number: "",
  });

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const isFormValid =
    form.name.trim() !== "" &&
    form.city.trim() !== "" &&
    form.country.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await createLocation(form);
    if (created) {
      addToast("Location created successfully", "success");
      navigate("/admin/locations");
    }
  };

  return (
    <div className="">
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-navy-700">
          <h1 className="text-base font-bold text-navy-800 dark:text-white">Create Location</h1>
          <p className="text-xs text-gray-400 mt-0.5">Fill in the details to add a new location</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Location Name"
              field="name"
              placeholder="Main Campus"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="City"
              field="city"
              placeholder="Dubai"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="Country"
              field="country"
              placeholder="UAE"
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="Address"
              field="address"
              placeholder="123 Main St"
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="Latitude"
              field="latitude"
              placeholder="25.2048"
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="Longitude"
              field="longitude"
              placeholder="55.2708"
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="Contact Phone"
              field="contact_phone"
              placeholder="+971 50 000 0000"
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
            <InputField
              label="WhatsApp Number"
              field="whatsapp_number"
              placeholder="+971 50 000 0000"
              required={false}
              formData={form}
              errors={fieldErrors}
              updateFormData={updateFormData}
            />
          </div>

          <InputField
            label="Venue Details"
            field="venue_details"
            placeholder="Floor 3, Building A..."
            required={false}
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <ToggleInput
            label="Active"
            field="is_active"
            formData={form}
            errors={fieldErrors}
            updateFormData={updateFormData}
          />

          <div className="flex gap-2 border-t border-gray-100 pt-5">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/admin/locations")}
              className="flex-1 rounded-xl py-2.5"
              bgColor="bg-white"
              textColor="text-gray-600"
              borderColor="border-gray-200"
              hoverBgColor="hover:bg-gray-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <Button
              type="submit"
              variant="primary"
              text={loading ? "Creating..." : "Create Location"}
              disabled={loading || !isFormValid}
              className="flex-1 rounded-xl py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationCreatePage;
