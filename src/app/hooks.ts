import useSWR, { SWRResponse } from "swr";
import { Currency, Journey, PriceData } from "./types";
import endpoints from "./endpoints";
import { buildJourneyUrlPath } from "./utils";

export function usePrice(
  journey: Journey,
  id: string,
  currency: Currency,
  enabled: boolean,
): SWRResponse<PriceData> {
  const key = enabled ? ["price", id, currency.label] : null;

  return useSWR(
    key,
    async ([_, id, currency]) => {
      const res = await fetch("/api/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          currency,
          journey,
        }),
      });

      return res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  );
}

export function useJourneys(
  formData: {
    departureDateFrom: string;
    departureDateTo: string;
    origin: string;
    destination: string;
  },
  enabled: boolean,
): SWRResponse<Journey[]> {
  const formDataString = JSON.stringify(formData);
  const key = enabled ? ["journeys", formDataString] : null;

  return useSWR(
    key,
    async ([_, formDataString]) => {
      const res = await fetch("/api/journeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formDataString,
      });

      return res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  );
}
