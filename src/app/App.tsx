"use client";

import React, { useState } from "react";
import { Journey, Airport, currencies, Currency } from "@/app/types";
import { FindJourneys } from "./FindJourneys";
import { JourneyList } from "./JourneyList";
import { getPrice } from "./serverActions";
import { getJourneyId, getJourneysWithPrice } from "./utils";

function App({ airports }: { airports: Airport[] }) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [journeyPriceMap, setJourneyPriceMap] = useState<Map<string, number>>(
    new Map()
  );
  const [currency, setSelectedCurrency] = useState(currencies.EUR);
  const [loadingPrices, setLoadingPrices] = useState<Map<string, boolean>>(
    new Map()
  );

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
      const price = await getPrice(journey, currency);
      const newPriceMap = new Map(journeyPriceMap);
      newPriceMap.set(id, price);
      setJourneyPriceMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(id, price);
        return newMap;
      });
    } catch (err) {
      console.error("Error fetching price:", err);
    } finally {
      const updatedLoadingMap = new Map(loadingPrices);
      updatedLoadingMap.set(id, false);
      setLoadingPrices(updatedLoadingMap);
    }
  };

  const handleChangeCurrency = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const currency = JSON.parse(e.target.value);
    setSelectedCurrency(currency);
    const journeysToUpdate = getJourneysWithPrice(journeyPriceMap, journeys);
    for (const journey of journeysToUpdate) {
      await handleGetPrice(journey, currency.label);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Flights</h1>
      <FindJourneys
        airports={airports}
        setJourneyPriceMap={setJourneyPriceMap}
        setJourneys={setJourneys}
      />
      <JourneyList
        journeyPriceMap={journeyPriceMap}
        journeys={journeys}
        selectedCurrency={currency}
        handleGetPrice={handleGetPrice}
        loadingPrices={loadingPrices}
      />
      <div className="">
        Show prices in:{" "}
        <select onChange={handleChangeCurrency}>
          {Object.values(currencies).map((currency) => (
            <option key={currency.label} value={JSON.stringify(currency)}>
              {currency.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default App;
