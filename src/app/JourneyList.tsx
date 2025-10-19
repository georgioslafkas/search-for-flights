import { Currency, Journey } from "./types";
import { JourneyItem } from "./JourneyItem";
import { useEffect, useRef } from "react";

type Props = {
  journeyPriceMap: Map<string, number>;
  journeys: Journey[];
  selectedCurrency: Currency;
  loadingPrices: Map<string, boolean>;
  handleGetPrice: (
    journey: Journey,
    currency: Currency["label"]
  ) => Promise<void>;
};

export const JourneyList = ({
  journeyPriceMap,
  journeys,
  selectedCurrency,
  handleGetPrice,
  loadingPrices,
}: Props) => {
  const list = useRef<HTMLUListElement>(null);
  const journeysRef = useRef(journeys);

  useEffect(() => {
    if (JSON.stringify(journeys) !== JSON.stringify(journeysRef.current)) {
      list.current?.scrollIntoView({ behavior: "smooth" });
      journeysRef.current = journeys;
    }
  }, [journeys]);

  return (
    <ul ref={list} id="journey-list" className="space-y-4 mt-6">
      {journeys.map((journey, index) => (
        <JourneyItem
          journeyPriceMap={journeyPriceMap}
          selectedCurrency={selectedCurrency}
          journey={journey}
          key={index}
          handleGetPrice={handleGetPrice}
          loadingPrices={loadingPrices}
        />
      ))}
    </ul>
  );
};
