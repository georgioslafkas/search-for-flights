"use client";

import React, { useState } from "react";
import { FormData, Journey, CURRENCIES, Airport } from "@/app/types";
import { findJourneys, getPrice } from "@/app/serverActions";
import { getJourneyId } from "@/app/utils";

function App({ airports }: { airports: Airport[] }) {
  const [formData, setFormData] = useState<FormData>({
    departureDateFrom: "",
    departureDateTo: "",
    origin: "",
    destination: "",
  });
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [journeyPriceMap, setJourneyPriceMap] = useState<Map<string, number>>(
    new Map()
  );
  const [loadingPrices, setLoadingPrices] = useState<Map<string, boolean>>(
    new Map()
  );

  const currency = CURRENCIES.SEK;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFindJourneySubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const journeys = await findJourneys(formData);
      setJourneys(journeys);

      // reset price map
      const newMap = new Map();
      journeys.forEach((j) => newMap.set(getJourneyId(j), 0));
      setJourneyPriceMap(newMap);
    } catch (err) {
      console.error("Error fetching journeys:", err);
      setJourneys([]);
    }
  };

  const handleGetPrice = async (journey: Journey) => {
    const id = getJourneyId(journey);

    // mark this journey as loading
    const newLoadingMap = new Map(loadingPrices);
    newLoadingMap.set(id, true);
    setLoadingPrices(newLoadingMap);

    try {
      const price = await getPrice(journey, currency);
      const newPriceMap = new Map(journeyPriceMap);
      newPriceMap.set(id, price);
      setJourneyPriceMap(newPriceMap);
    } catch (err) {
      console.error("Error fetching price:", err);
    } finally {
      const updatedLoadingMap = new Map(loadingPrices);
      updatedLoadingMap.set(id, false);
      setLoadingPrices(updatedLoadingMap);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Flights</h1>

      {/* Search Form */}
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
          className="w-full bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-500"
        >
          Find
        </button>
      </form>

      {/* Journey List */}
      <ul className="space-y-4 mt-6">
        {journeys.map((journey, index) => {
          const id = getJourneyId(journey);
          return (
            <li key={index} className="p-4 border rounded-lg shadow-sm">
              <div className="mb-2 font-medium">
                <p>
                  Flights: {journey.flights.length} | Total Duration:{" "}
                  {journey.duration}
                </p>
                <p>
                  Departure:{" "}
                  {new Date(journey.departureDateTime).toLocaleString()}
                </p>
                <p>
                  Arrival: {new Date(journey.arrivalDateTime).toLocaleString()}
                </p>
              </div>

              <button
                className="mt-2 bg-gray-700 text-white px-3 py-1 rounded-lg hover:bg-gray-800"
                onClick={() => handleGetPrice(journey)}
                disabled={loadingPrices.get(id)}
              >
                {loadingPrices.get(id) ? "Loading..." : "Get Price"}
              </button>

              <p className="mt-2 text-gray-800 font-semibold">
                {journeyPriceMap.get(id)
                  ? `${journeyPriceMap.get(id)?.toFixed(2)} ${currency}`
                  : ""}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
