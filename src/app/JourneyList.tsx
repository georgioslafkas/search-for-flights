"use client";

import { Journey } from "@/app/types";
import { getJourneyId } from "@/app/utils";
import { getPrice } from "@/app/serverActions";
import { useState } from "react";

type Props = {
  journeys: Journey[];
  currency: string;
};

export const JourneyList = ({ journeys, currency }: Props) => {
  const [prices, setPrices] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState<string | null>(null);

  const handleGetPrice = async (journey: Journey) => {
    const journeyId = getJourneyId(journey);
    setLoading(journeyId);
    const price = await getPrice(journey, currency);
    setPrices((prev) => new Map(prev).set(journeyId, price));
    setLoading(null);
  };

  return (
    <ul className="space-y-4">
      {journeys.map((journey, index) => {
        const journeyId = getJourneyId(journey);
        const price = prices.get(journeyId);

        return (
          <li key={index} className="p-4 border rounded-lg shadow-sm">
            <div className="mb-2 font-medium">
              <p>
                Flights: {journey.flights.length} | Duration: {journey.duration}
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
              className="mt-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              onClick={() => handleGetPrice(journey)}
              disabled={loading === journeyId}
            >
              {loading === journeyId ? "Loading..." : "Get Price"}
            </button>
            {price !== undefined && (
              <p className="mt-2 font-semibold">
                {price.toFixed(2)} {currency}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
};
