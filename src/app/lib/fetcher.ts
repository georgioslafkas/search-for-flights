import { PricePayload } from "../types";

export const fetcher = async (
  url: string,
  body?: PricePayload
): Promise<{ price: number }> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Network error");
  return res.json();
};
