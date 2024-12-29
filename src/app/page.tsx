"use client";

import React, { useEffect, useState } from "react";

const URL_AIRPORTS =
  "https://services-api.ryanair.com/views/locate/5/airports/en/active";
const BASE_URL_JOURNEYS = "https://services-api.ryanair.com/timtbl/v3/journeys";

interface FormData {
  departureDateFrom: string;
  departureDateTo: string;
  origin: string;
  destination: string;
}

function App() {
  const [airports, setAirports] = useState();
  const [formData, setFormData] = useState<FormData>({
    departureDateFrom: "",
    departureDateTo: "",
    origin: "",
    destination: "",
  });
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    async function fetchAirports() {
      const res = await fetch(URL_AIRPORTS, { method: "GET" });
      const airports = await res.json();
      setAirports(airports);
    }
    fetchAirports();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPath = (params: FormData): string => {
    const filteredParams = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(params).filter(
        ([key, value]) =>
          !["origin", "destination"].includes(key) && value !== ""
      )
    );

    const path = `${params.origin}/${params.destination}`;
    const queryParams = new URLSearchParams(
      filteredParams as Record<string, string>
    ).toString();

    return `${path}?${queryParams}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const path = buildPath(formData);
    const requestURL = `${BASE_URL_JOURNEYS}/${path}`;

    try {
      const response = await fetch(requestURL, { method: "GET" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setJourneys(await response.json());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Flights</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <button
            type="submit"
            className="w-full bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-500"
          >
            Find
          </button>
        </div>
      </form>
      <ul className="space-y-4">
        {journeys.map((journey, index) => (
          <li key={index} className="p-4 border rounded-lg shadow-sm">
            <div className="mb-2 font-medium">
              <p>
                Flights: {journey.flights.length} Total Duration:{" "}
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
            <ul className="space-y-2">
              {journey.flights.map((leg, legIndex) => (
                <li key={legIndex} className="pl-4">
                  <p>
                    <strong>Flight {legIndex + 1}:</strong>
                  </p>
                  <p>
                    Origin: {leg.departureAirportCode},{" "}
                    {new Date(leg.departureDateTime).toLocaleString()}
                  </p>
                  <p>
                    Destination: {leg.arrivalAirportCode},{" "}
                    {new Date(leg.arrivalDateTime).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
            <button className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
              Get Prices
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
