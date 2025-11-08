import { Currency, Journey } from "./types";
import { JourneyItem } from "./JourneyItem";
import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = {
  journeyPriceMap: Map<string, number>;
  journeys: Journey[] | null;
  selectedCurrency: Currency;
  loadingPrices: Map<string, boolean>;
  handleGetPrice: (
    journey: Journey,
    currency: Currency["label"]
  ) => Promise<void>;
  resultRef: React.RefObject<HTMLUListElement | HTMLDivElement>;
};

export const JourneyList = ({
  journeyPriceMap,
  journeys,
  selectedCurrency,
  handleGetPrice,
  loadingPrices,
  resultRef,
}: Props) => {
  const previousJourneysRef = useRef<Journey[]>([]);

  useEffect(() => {
    // Trigger animation when new results appear
    if (journeys?.length && journeys !== previousJourneysRef.current) {
      const items = document.querySelectorAll(".journey-item");
      items.forEach((el, i) => {
        (el as HTMLElement).style.animationDelay = `${i * 100}ms`;
        el.classList.add("animate-fade-in-up");
      });
      previousJourneysRef.current = journeys;
    }
  }, [journeys]);

  if (journeys !== null && journeys.length === 0) {
    return (
      <>
        <div
          ref={resultRef as React.RefObject<HTMLDivElement>}
          className="flex justify-center items-center flex-col mt-4 mb-4 border-2 border-dashed text-white"
        >
          No journeys found
          <Image
            src="/no-flight-64.png"
            alt="No flights found icon"
            width={64}
            height={64}
          />
        </div>
      </>
    );
  }

  return journeys?.length ? (
    <ul
      ref={resultRef as React.RefObject<HTMLUListElement>}
      id="journey-list"
      className="space-y-4 mt-6"
    >
      {(journeys || []).map((journey, index) => (
        <JourneyItem
          journeyPriceMap={journeyPriceMap}
          selectedCurrency={selectedCurrency}
          journey={journey}
          key={index}
          handleGetPrice={handleGetPrice}
          loadingPrices={loadingPrices}
          className="journey-item opacity-0 p-4 border rounded-xl bg-white shadow-md"
        />
      ))}
    </ul>
  ) : null;
};
