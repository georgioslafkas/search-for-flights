import useSWRMutation from "swr/mutation";
import { fetcher } from "./lib/fetcher";
import { PricePayload } from "./types";

export function usePriceFetcher() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/price",
    (url, { arg }: { arg: PricePayload }) => fetcher(url, arg)
  );

  return { trigger, data, error, isMutating };
}
