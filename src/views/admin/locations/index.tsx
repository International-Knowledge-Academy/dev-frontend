// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAddLocation, MdRefresh, MdPlace, MdLocationCity, MdPublic, MdToggleOn, MdSettings, MdVisibility, MdSchool, MdEdit, MdDelete, MdWarning } from "react-icons/md";
import useLocations from "hooks/locations/useLocations";
import useDeleteLocation from "hooks/locations/useDeleteLocation";
import { useToast } from "context/ToastContext";
import Loading from "components/loading/Loading";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import Divider from "components/ui/Divider";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import SearchInput from "components/form/SearchInput";
import FilterSelectField from "components/form/filter/FilterSelectField";
import ConfirmModal from "components/ui/modals/ConfirmModal";
import type { Location } from "types/location";

const LocationsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { locations, count, loading, error, params, setParams, refetch } = useLocations();
  const { deleteLocation, loading: deleting } = useDeleteLocation();

  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteLocation(deleteTarget.uid);
    if (ok) {
      addToast("Location deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    }
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <>
    <div className="bg-white rounded-2xl border border-slate-100">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-5 px-6">

        <div className="flex items-center gap-3">
          <SearchInput
            value={params.search ?? ""}
            onChange={(val) => setParams({ search: val })}
            placeholder="Search locations..."
          />
          <FilterSelectField
            value={params.is_active === undefined ? "all" : String(params.is_active)}
            onChange={(val) =>
              setParams({ is_active: val === "all" ? undefined : val === "true" })
            }
            icon={MdToggleOn}
            defaultOption="All"
            options={[
              { value: "true",  label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
          />
          <IconButton
            onClick={refetch}
            icon={<MdRefresh size={18} />}
            bgColor="bg-white"
            textColor="text-gray-500"
            borderColor="border-slate-200"
            hoverTextColor="hover:text-gray-700"
            hoverBorderColor="hover:border-slate-300"
            className="rounded-xl p-2.5"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="dark-navy"
            text="Add Location"
            icon={<MdAddLocation />}
            onClick={() => navigate("/admin/locations/create")}
          />

          <div>
            <p className="text-sm text-gray-400 mt-0.5">{count} locations</p>
          </div>
        </div>

      </div>

      <Divider />

      {/* Table */}
      <div className="pb-5 px-6">

        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden dark:bg-navy-800 dark:border-navy-700">
          {loading ? (
            <Loading text="Fetching locations data..." />
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-sm text-red-500">{error}</div>
          ) : locations.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">No locations found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-navy-700">
                    {[
                      { label: "Name",         icon: <MdPlace        size={14} /> },
                      { label: "City",         icon: <MdLocationCity size={14} /> },
                      { label: "Country",      icon: <MdPublic       size={14} /> },
                      { label: "Status",       icon: <MdToggleOn     size={14} /> },
                      { label: "Programs",     icon: <MdSchool       size={14} /> },
                      { label: "Actions",      icon: <MdSettings     size={14} /> },
                    ].map(({ label, icon }) => (
                      <th key={label} className="px-5 py-3.5 text-left text-xs font-bold tracking-widest uppercase text-gray-400">
                        <span className="flex items-center gap-1.5">{icon}{label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-navy-700">
                  {locations.map((location) => (
                    <tr key={location.uid} className="hover:bg-gray-50 dark:hover:bg-navy-700 transition">
                      {/* Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-navy-500 border border-navy-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {location.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <span className="font-medium text-navy-800 dark:text-white">{location.name}</span>
                        </div>
                      </td>
                      {/* City */}
                      <td className="px-5 py-3.5 text-gray-500 dark:text-navy-300">{location.city}</td>
                      {/* Country */}
                      <td className="px-5 py-3.5 text-gray-500 dark:text-navy-300">{location.country}</td>
                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          location.is_active
                            ? "bg-green-50 text-green-600 border-green-600"
                            : "bg-red-50 text-red-500 border-red-600"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${location.is_active ? "bg-green-500" : "bg-red-400"}`} />
                          {location.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {/* Course Count */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-50 text-navy-700 dark:bg-navy-700 dark:text-white">
                          {location.course_count}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/admin/locations/${location.uid}`)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-navy-700 transition"
                            title="View Location"
                          >
                            <MdVisibility size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/locations/${location.uid}/edit`)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-navy-700 transition"
                            title="Edit Location"
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(location)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                            title="Delete Location"
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-5 border-t border-slate-100">
              <p className="text-xs text-gray-400">
                Page {params.page ?? 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <PrevButton
                  text="Previous"
                  disabled={!params.page || params.page <= 1}
                  onClick={() => setParams({ page: (params.page ?? 1) - 1 })}
                  className="rounded-xl"
                />
                <NextButton
                  text="Next"
                  disabled={(params.page ?? 1) >= totalPages}
                  onClick={() => setParams({ page: (params.page ?? 1) + 1 })}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

        </div>
      </div>

    </div>

    <ConfirmModal
      open={!!deleteTarget}
      title="Delete Location"
      message={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-navy-800 dark:text-white">{deleteTarget?.name}</span>?
          {" "}This action cannot be undone.
        </>
      }
      confirmText="Delete"
      cancelText="Cancel"
      loading={deleting}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={() => setDeleteTarget(null)}
      onConfirm={handleDelete}
    />
    </>
  );
};

export default LocationsPage;
