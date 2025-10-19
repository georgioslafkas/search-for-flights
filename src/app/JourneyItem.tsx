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
  const price = `${journeyPriceMap.get(id)?.toFixed(2)}${
    selectedCurrency.symbol
  }`;
  const showPrice = Boolean(journeyPriceMap.get(id)) && !loadingPrices.get(id);
  const showSpinner =
    (journeyPriceMap.get(id) || loadingPrices.get(id)) && !showPrice;

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
        Get Price
      </button>

      <p className="mt-2 text-gray-800 font-semibold min-h-6">
        {showPrice && price}
        {showSpinner && (
          <svg viewBox="0 0 50 50" width="24" height="24">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#075985"
              strokeWidth="4"
              strokeLinecap="round"
              className="spinner-ring"
            />
          </svg>
        )}
      </p>
    </li>
  );
};
