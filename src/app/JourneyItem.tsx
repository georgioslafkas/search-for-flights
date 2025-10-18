// import { useState } from "react";
import { Currency, Flight, Journey } from "./types";
import { getJourneyId, getBookingLink } from "./utils";
import Image from "next/image";

type Props = {
  journeyPriceMap: Map<string, number>;
  selectedCurrency: Currency;
  journey: Journey;
  loadingPrices: Map<string, boolean>;
  handleGetPrice: (
    journey: Journey,
    currency: Currency["label"]
  ) => Promise<void>;
};

export const JourneyItem = ({
  journey,
  journeyPriceMap,
  selectedCurrency,
  handleGetPrice,
  loadingPrices,
}: Props) => {
  const id = getJourneyId(journey);
  return (
    <li className="p-4 border rounded-lg shadow-sm">
      <div className="mb-2 font-medium">
        <p>
          Flights: {journey.flights.length} | Total Duration: {journey.duration}
        </p>
        <p>Departure: {new Date(journey.departureDateTime).toLocaleString()}</p>
        <p>Arrival: {new Date(journey.arrivalDateTime).toLocaleString()}</p>
        <ul className="space-y-2">
          {journey.flights.map((leg: Flight, legIndex: number) => (
            <li key={legIndex} className="pl-2">
              <p>
                <strong>Flight {legIndex + 1}</strong>
                <a href={getBookingLink(leg)} target="_blank">
                  <Image
                    src="openTab.svg"
                    alt={`Open flight from ${leg.departureAirportCode} to ${leg.arrivalAirportCode} in new tab`}
                    width={24}
                    height={24}
                    className="inline"
                  />
                </a>
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
      </div>
      <button
        className="mt-2 bg-sky-800 hover:bg-sky-900 text-white px-3 py-1 rounded-lg"
        onClick={() => handleGetPrice(journey, selectedCurrency.label)}
        disabled={loadingPrices.get(id)}
      >
        {loadingPrices.get(id) ? "Loading..." : "Get Price"}
      </button>

      <p className="mt-2 text-gray-800 font-semibold">
        {journeyPriceMap.get(id)
          ? `${journeyPriceMap.get(id)?.toFixed(2)}${selectedCurrency.symbol}`
          : ""}
      </p>
    </li>
  );
};
