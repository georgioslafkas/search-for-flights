import useSWR, { SWRResponse } from "swr";
import { Currency, Journey, PriceData } from "./types";
import { FormData } from "./types";

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

export function useJourneys(formData: FormData | null): SWRResponse<Journey[]> {
  const key = formData ? ["journeys", JSON.stringify(formData)] : null;

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
