"use client";

import React, { useState } from "react";
import { Journey, Airport } from "@/app/types";
import { FindJourneys } from "./FindJourneys";
import { JourneyList } from "./JourneyList";

function App({ airports }: { airports: Airport[] }) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [journeyPriceMap, setJourneyPriceMap] = useState<Map<string, number>>(
    new Map()
  );

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
        setJourneyPriceMap={setJourneyPriceMap}
        journeys={journeys}
      />
    </div>
  );
}

export default App;
