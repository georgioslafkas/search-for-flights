import { currencies, Currency, Journey, JourneyPriceMap } from "./types";
import { getJourneysWithPrice } from "./utils";

type Props = {
  setSelectedCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  journeyPriceMap: JourneyPriceMap;
  journeys: Journey[];
  handleGetPrice: (
    journey: Journey,
    currency: Currency["label"]
  ) => Promise<void>;
};

export const SelectCurrency = ({
  setSelectedCurrency,
  journeyPriceMap,
  journeys,
  handleGetPrice,
}: Props) => {
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
  );
};
