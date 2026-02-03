import useSWRMutation from "swr/mutation";
import { fetcher } from "./lib/fetcher";
import { Currency, Journey, PricePayload } from "./types";

// export function usePriceFetcher() {
//   const { trigger, data, error, isMutating } = useSWRMutation(
//     "/api/price",
//     (url, { arg }: { arg: PricePayload }) => fetcher(url, arg)
//   );

//   return { trigger, data, error, isMutating };
// }
import useSWR from "swr";

export function usePrice(
  journey: Journey,
  id: string,
  currency: Currency,
  enabled: boolean,
) {
  const journeyString = JSON.stringify(journey);

  const query = enabled
    ? `/api/price?id=${id}&currency=${currency.label}&journey=${encodeURIComponent(
        journeyString,
      )}`
    : null;

  return useSWR(query, fetcher);
}
