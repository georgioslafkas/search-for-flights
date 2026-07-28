import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Airport, FormData, Journey } from "./types";
import { Spinner } from "./Spinner";
import { Notification } from "./Notification";
import Image from "next/image";
import { useJourneys } from "./hooks";
import Select from "react-select";

type Props = {
  setJourneys: Dispatch<SetStateAction<Journey[] | null>>;
  airports: Airport[];
  onJourneysFound: (journeys: Journey[]) => void;
};

export const FindJourneys = ({
  setJourneys,
  airports,
  onJourneysFound,
}: Props) => {
  const [formData, setFormData] = useState<FormData>({
    departureDateFrom: "",
    departureDateTo: "",
    origin: "",
    destination: "",
  });

  const [submittedForm, setSubmittedForm] = useState<FormData | null>(null);

  const {
    data: journeys,
    error,
    isLoading: searchingJourneys,
  } = useJourneys(submittedForm);

  const handleFindJourneySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      submittedForm?.departureDateFrom === formData.departureDateFrom &&
      submittedForm?.departureDateTo === formData.departureDateTo &&
      submittedForm?.origin === formData.origin &&
      submittedForm?.destination === formData.destination
    ) {
      return;
    }

    setJourneys(null);
    setSubmittedForm(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitch = () => {
    if (!formData.origin || !formData.destination) {
      return;
    }

    const newDestination = formData.origin;
    const newOrigin = formData.destination;

    setFormData({
      ...formData,
      destination: newDestination,
      origin: newOrigin,
    });
  };

  useEffect(() => {
    if (journeys) {
      setJourneys(journeys);
      onJourneysFound(journeys);
    }
  }, [journeys, setJourneys, onJourneysFound]);

  return (
    <>
      <form
        onSubmit={handleFindJourneySubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-[0_10px_25px_rgba(15,23,42,0.45)]"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Flights</h1>
        <p>
          You can search for <strong>one-way</strong> flights to a destination
          within the dates you specify
        </p>
        <div className="w-[95%]">
          <label
            htmlFor="departureDateFrom"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Departure Date From:
          </label>
          <input
            type="date"
            id="departureDateFrom"
            name="departureDateFrom"
            value={formData.departureDateFrom}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="w-[95%]">
          <label
            htmlFor="departureDateTo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Departure Date To:
          </label>
          <input
            type="date"
            id="departureDateTo"
            name="departureDateTo"
            value={formData.departureDateTo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2 w-[95%]">
          <div>
            <label
              htmlFor="origin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Origin:
            </label>
            <Select
              instanceId="origin"
              inputId="origin"
              options={airports.map((airport) => ({
                value: airport.code,
                label: `${airport.name} (${airport.code})`,
              }))}
              value={
                formData.origin
                  ? {
                      value: formData.origin,
                      label: `${airports.find((a) => a.code === formData.origin)?.name} (${formData.origin})`,
                    }
                  : null
              }
              onChange={(option) => {
                if (option) {
                  setFormData((prev) => ({ ...prev, origin: option.value }));
                }
              }}
              placeholder="Search airport or city..."
              isClearable
              isSearchable
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#d1d5db",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    borderColor: "#d1d5db",
                  },
                  "&:focus-within": {
                    boxShadow: "0 0 0 2px rgba(107, 114, 128, 0.1)",
                  },
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : undefined
              }
            />
          </div>

          <button
            type="button"
            onClick={handleSwitch}
            className="h-[0px] translate-x-full"
          >
            <Image
              src="/vertical-switch.svg"
              width={24}
              height={24}
              alt="Switch origin and destination"
            />
          </button>

          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Destination:
            </label>
            <Select
              instanceId="destination"
              inputId="destination"
              options={airports
                .filter((airport) => airport.code !== formData.origin)
                .map((airport) => ({
                  value: airport.code,
                  label: `${airport.name} (${airport.code})`,
                }))}
              value={
                formData.destination
                  ? {
                      value: formData.destination,
                      label: `${airports.find((a) => a.code === formData.destination)?.name} (${formData.destination})`,
                    }
                  : null
              }
              onChange={(option) => {
                if (option) {
                  setFormData((prev) => ({
                    ...prev,
                    destination: option.value,
                  }));
                }
              }}
              placeholder="Search airport or city..."
              isClearable
              isSearchable
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#d1d5db",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    borderColor: "#d1d5db",
                  },
                  "&:focus-within": {
                    boxShadow: "0 0 0 2px rgba(107, 114, 128, 0.1)",
                  },
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : undefined
              }
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-500"
        >
          Find
        </button>
      </form>
      {searchingJourneys && (
        <Spinner size={64} color="#fff" className="mx-auto mt-6" />
      )}
      <Notification error={error} />
    </>
  );
};
