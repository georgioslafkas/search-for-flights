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
import { SelectCurrency } from "./SelectCurrency";
import { Notification } from "./Notification";
import ErrorBoundary from "./ErrorBoundary";

function App({ airports }: { airports: Airport[] }) {
  const [journeys, setJourneys] = useState<Journey[] | null>(null);
  const [_, setJourneyPriceMap] = useState<JourneyPriceMap>(new Map());
  const [currency, setSelectedCurrency] = useState<Currency>(currencies.EUR);
  const journeyResultRef = useRef<HTMLUListElement | HTMLDivElement>(null);

  const handleJourneysFound = (newJourneys: Journey[]) => {
    setJourneys(newJourneys);
    setTimeout(() => {
      journeyResultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 mb-10">
      <ErrorBoundary>
        <FindJourneys
          airports={airports}
          setJourneyPriceMap={setJourneyPriceMap}
          setJourneys={setJourneys}
          onJourneysFound={handleJourneysFound}
        />
        <JourneyList
          journeys={journeys}
          selectedCurrency={currency}
          resultRef={journeyResultRef}
        />
        <SelectCurrency setSelectedCurrency={setSelectedCurrency} />
        <Notification error={null} />
      </ErrorBoundary>
    </div>
  );
}

export default App;
