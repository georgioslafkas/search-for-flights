import { Dispatch, SetStateAction, useState } from "react";
import { findJourneys } from "./serverActions";
import { getJourneyId } from "./utils";
import { Airport, FormData, Journey } from "./types";
import { Spinner } from "./Spinner";

type Props = {
  setJourneys: Dispatch<SetStateAction<Journey[]>>;
  setJourneyPriceMap: Dispatch<SetStateAction<Map<string, number>>>;
  airports: Airport[];
  onJourneysFound: (journeys: Journey[]) => void;
};

export const FindJourneys = ({
  setJourneys,
  setJourneyPriceMap,
  airports,
  onJourneysFound,
}: Props) => {
  const [formData, setFormData] = useState<FormData>({
    departureDateFrom: "",
    departureDateTo: "",
    origin: "",
    destination: "",
  });
  const [searchingJourneys, setSearchingJourneys] = useState(false);

  const handleFindJourneySubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSearchingJourneys(true);
      const journeys = await findJourneys(formData);
      onJourneysFound(journeys);

      // reset price map
      const newMap = new Map();
      journeys.forEach((j) => newMap.set(getJourneyId(j), 0));
      setJourneyPriceMap(newMap);
    } catch (err) {
      console.error("Error fetching journeys:", err);
      setJourneys([]);
    } finally {
      setSearchingJourneys(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <form onSubmit={handleFindJourneySubmit} className="space-y-4">
        <div>
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

        <div>
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

        <div>
          <label
            htmlFor="origin"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Origin:
          </label>
          <select
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="" disabled>
              Select an origin
            </option>
            {(airports || []).map((airport) => (
              <option key={airport.code} value={airport.code}>
                {airport.name} ({airport.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Destination:
          </label>
          <select
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="" disabled>
              Select a destination
            </option>
            {(airports || [])
              .filter((airport) => airport.code !== formData.origin)
              .map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.name} ({airport.code})
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-500"
        >
          Find
        </button>
      </form>
      {searchingJourneys && <Spinner size={64} className="mx-auto mt-6" />}
    </>
  );
};
