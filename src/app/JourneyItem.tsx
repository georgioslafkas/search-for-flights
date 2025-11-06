import { Spinner } from "./Spinner";
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
  const hideButton = loadingPrices.get(id) || Boolean(journeyPriceMap.get(id)); // button will only be clicked once, after that the only change may come from currency update

  return (
    <li
      className="p-4 border border-sky-300 
    rounded-2xl bg-white 
    shadow-[0_10px_25px_rgba(15,23,42,0.45)] 
    hover:-translate-y-1 hover:scale-[1.01]
    transition-all duration-300"
    >
      <div className="mb-2 font-medium">
        <p>
          Flights: {journey.flights.length} | Total Duration: {journey.duration}
        </p>
        <p>Departure: {new Date(journey.departureDateTime).toLocaleString()}</p>
        <p>Arrival: {new Date(journey.arrivalDateTime).toLocaleString()}</p>
        <ul>
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
      <div className="flex flex-col items-end">
        {!hideButton && (
          <button
            className="bg-sky-800 hover:bg-sky-900 text-white px-3 py-1 rounded-lg size-fit"
            onClick={() => handleGetPrice(journey, selectedCurrency.label)}
          >
            Get Price
          </button>
        )}
        {showSpinner && <Spinner size={32} />}
        {showPrice && (
          <p className="text-gray-800 font-semibold min-h-6 size-fit text-2xl">
            {price}
          </p>
        )}
      </div>
    </li>
  );
};
