import { currencies, Currency } from "./types";

type Props = {
  setSelectedCurrency: React.Dispatch<React.SetStateAction<Currency>>;
};

export const SelectCurrency = ({ setSelectedCurrency }: Props) => {
  const handleChangeCurrency = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const currency = JSON.parse(e.target.value);
    setSelectedCurrency(currency);
  };

  return (
    <div className="flex justify-center mt-4">
      <label htmlFor="select-currency" className="text-white mr-2">
        Show prices in:{" "}
      </label>
      <select
        id="select-currency"
        className="rounded-md"
        onChange={handleChangeCurrency}
      >
        {Object.values(currencies).map((currency) => (
          <option key={currency.label} value={JSON.stringify(currency)}>
            {currency.label}
          </option>
        ))}
      </select>
    </div>
  );
};
