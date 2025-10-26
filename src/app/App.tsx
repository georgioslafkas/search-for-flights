"use client";

import React, { useRef, useState } from "react";
import {
  Journey,
  Airport,
  currencies,
  Currency,
  JourneyPriceMap,
} from "@/app/types";
import { FindJourneys } from "./FindJourneys";
import { JourneyList } from "./JourneyList";
import { getPrice } from "./serverActions";
import { getJourneyId } from "./utils";
import { SelectCurrency } from "./SelectCurrency";
import { Notification } from "./Notification";
import ErrorBoundary from "./ErrorBoundary";

function App({ airports }: { airports: Airport[] }) {
  const [journeys, setJourneys] = useState<Journey[] | null>(null);
  const [journeyPriceMap, setJourneyPriceMap] = useState<JourneyPriceMap>(
    new Map()
  );
  const [currency, setSelectedCurrency] = useState<Currency>(currencies.EUR);
  const [loadingPrices, setLoadingPrices] = useState<Map<string, boolean>>(
    new Map()
  );
  const journeyResultRef = useRef<HTMLUListElement | HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetPrice = async (
    journey: Journey,
    currency: Currency["label"]
  ) => {
    const id = getJourneyId(journey);

    // mark this journey as loading
    const newLoadingMap = new Map(loadingPrices);
    newLoadingMap.set(id, true);
    setLoadingPrices(newLoadingMap);

    try {
      setError(null);
      const price = await getPrice(journey, currency);
      const newPriceMap = new Map(journeyPriceMap);
      newPriceMap.set(id, price);
      setJourneyPriceMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(id, price);
        return newMap;
      });
    } catch (err) {
      setError(`Something went wrong when getting the price of the trip`);
      console.error("Error fetching price:", err);
    } finally {
      const updatedLoadingMap = new Map(loadingPrices);
      updatedLoadingMap.set(id, false);
      setLoadingPrices((prev) => {
        const newMap = new Map(prev);
        newMap.set(id, false);
        return newMap;
      });
    }
  };

  const handleJourneysFound = (newJourneys: Journey[]) => {
    setJourneys(newJourneys);
    setTimeout(() => {
      journeyResultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Flights</h1>
      <ErrorBoundary>
        <FindJourneys
          airports={airports}
          setJourneyPriceMap={setJourneyPriceMap}
          setJourneys={setJourneys}
          onJourneysFound={handleJourneysFound}
        />
        <JourneyList
          journeyPriceMap={journeyPriceMap}
          journeys={journeys}
          selectedCurrency={currency}
          handleGetPrice={handleGetPrice}
          loadingPrices={loadingPrices}
          resultRef={journeyResultRef}
        />
        <SelectCurrency
          setSelectedCurrency={setSelectedCurrency}
          journeyPriceMap={journeyPriceMap}
          journeys={journeys}
          handleGetPrice={handleGetPrice}
        />
        <Notification error={error} />
      </ErrorBoundary>
    </div>
  );
}

export default App;
