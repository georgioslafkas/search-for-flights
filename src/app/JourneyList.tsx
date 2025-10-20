import { Currency, Journey } from "./types";
import { JourneyItem } from "./JourneyItem";
import Image from "next/image";

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
  if (journeys !== null && journeys.length === 0) {
    return (
      <>
        <div
          ref={resultRef as React.RefObject<HTMLDivElement>}
          className="flex justify-center items-center flex-col mt-4 mb-4"
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

  return (
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
        />
      ))}
    </ul>
  );
};
