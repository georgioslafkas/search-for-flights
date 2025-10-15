import { Dispatch, SetStateAction, useState } from "react";
import { CURRENCIES, Flight, Journey } from "./types";
import { CurrencyMap, getBookingLink, getJourneyId } from "./utils";
import { getPrice } from "./serverActions";
import Image from "next/image";

type Props = {
  journeyPriceMap: Map<string, number>;
  setJourneyPriceMap: Dispatch<SetStateAction<Map<string, number>>>;
  journeys: Journey[];
};

export const JourneyList = ({
  journeyPriceMap,
  setJourneyPriceMap,
  journeys,
}: Props) => {
  const [loadingPrices, setLoadingPrices] = useState<Map<string, boolean>>(
    new Map()
  );
  const currency = CURRENCIES.EUR;

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
              onClick={() => handleGetPrice(journey)}
              disabled={loadingPrices.get(id)}
            >
              {loadingPrices.get(id) ? "Loading..." : "Get Price"}
            </button>

            <p className="mt-2 text-gray-800 font-semibold">
              {journeyPriceMap.get(id)
                ? `${journeyPriceMap.get(id)?.toFixed(2)}${CurrencyMap.EUR}`
                : ""}
            </p>
          </li>
        );
      })}
    </ul>
  );
};
