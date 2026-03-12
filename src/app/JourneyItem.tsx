import { useState } from "react";
import { usePrice } from "./hooks";
import { Spinner } from "./Spinner";
import { Currency, Flight, Journey } from "./types";
import { getJourneyId, getBookingLink } from "./utils";
import Image from "next/image";

type Props = {
  selectedCurrency: Currency;
  journey: Journey;
  className?: string;
};

export const JourneyItem = ({
  journey,
  selectedCurrency,
  className,
}: Props) => {
  const id = getJourneyId(journey);

  const [enabled, setEnabled] = useState(false);

  const { data: priceData, isLoading: fetchingPrice } = usePrice(
    journey,
    id,
    selectedCurrency,
    enabled,
  );
  const hideButton = fetchingPrice || priceData?.price; // button will only be clicked once, after that the only change may come from currency update

  const handleGetPrice = () => setEnabled(true);

  return (
    <li
      className={`p-4 border border-sky-300 
    rounded-2xl bg-white 
    shadow-[0_10px_25px_rgba(15,23,42,0.45)] 
    hover:-translate-y-1 hover:scale-[1.01]
    transition-all duration-300 ${className}`}
    >
      <div className="mb-2 font-medium">
        <p>
          Flights: {journey.flights.length} | Total Duration: {journey.duration}{" "}
          hrs
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
            onClick={handleGetPrice}
          >
            Get Price
          </button>
        )}
        {fetchingPrice && <Spinner size={32} />}
        {priceData && (
          <p className="text-gray-800 font-semibold min-h-6 size-fit text-2xl">
            {priceData.price.toFixed(2)} {selectedCurrency.symbol}
          </p>
        )}
      </div>
    </li>
  );
};
