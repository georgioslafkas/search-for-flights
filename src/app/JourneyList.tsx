import { Currency, Journey } from "./types";
import { JourneyItem } from "./JourneyItem";

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
  return (
    <ul className="space-y-4 mt-6">
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
