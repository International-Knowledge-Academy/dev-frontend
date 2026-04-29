// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "context/ToastContext";
import useGetLocation from "hooks/locations/useGetLocation";
import useUpdateLocation from "hooks/locations/useUpdateLocation";
import InputField from "components/form/InputField";
import ToggleInput from "components/form/toggle/ToggleInput";
import Button from "components/ui/buttons/Button";

const LocationEditPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { location, loading: loadingLocation, error: loadError } = useGetLocation(uid);
  const { updateLocation, loading: updating, error, fieldErrors } = useUpdateLocation();

  const [form, setForm] = useState({
    name:          "",
    city:          "",
    country:       "",
    address:       "",
    venue_details: "",
    latitude:        "",
    longitude:       "",
    is_active:       true,
    contact_phone:   "",
    whatsapp_number: "",
  });

  useEffect(() => {
    if (location) {
      setForm({
        name:            location.name,
        city:            location.city,
        country:         location.country,
        address:         location.address,
        venue_details:   location.venue_details,
        latitude:        location.latitude,
        longitude:       location.longitude,
        is_active:       location.is_active,
        contact_phone:   location.contact_phone,
        whatsapp_number: location.whatsapp_number,
      });
    }
  }, [location]);

  const updateFormData = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updateLocation(uid, form);
    if (updated) {
      addToast("Location updated successfully", "success");
      navigate(`/admin/locations/${uid}`);
    }
  };

  if (loadingLocation) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading location...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {loadError}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-base font-bold text-navy-800">Edit Location</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Update the details for <span className="font-semibold text-navy-700">{location?.name}</span>
          </p>
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

          <div className="flex gap-2 border-t border-gray-100 pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate(`/admin/locations/${uid}`)}
              className="flex-1 rounded-xl py-2.5"
              bgColor="bg-white"
              textColor="text-slate-600"
              borderColor="border-gray-200"
              hoverBgColor="hover:bg-gray-50"
              hoverTextColor=""
              hoverBorderColor=""
            />
            <Button
              type="submit"
              variant="primary"
              text={updating ? "Saving..." : "Save Changes"}
              disabled={updating}
              className="flex-1 rounded-xl py-2.5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationEditPage;
