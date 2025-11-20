"use server";

import endpoints from "@/app/endpoints";
import { Currency, Fare, FareWapper, FormData, Journey } from "@/app/types";
import { buildFareUrl, buildJourneyUrlPath } from "@/app/utils";

export async function findJourneys(formData: FormData): Promise<Journey[]> {
  const path = buildJourneyUrlPath(formData);
  const requestURL = `${endpoints.URL_JOURNEYS}/${path}`;

  const res = await fetch(requestURL, { method: "GET" });
  if (!res.ok) {
    console.error("Failed to fetch journeys:", res.statusText);
    return [];
  }

  return res.json();
}

export async function getPrice(journey: Journey, currency: Currency["label"]) {
  const requestURLs = journey.flights.map((flight) =>
    buildFareUrl(flight, currency)
  );

  const responses = await Promise.all(
    requestURLs.map((url) => fetch(url, { method: "GET", cache: "no-store" }))
  );

  const fares: FareWapper[] = await Promise.all(
    responses.map((res) => res.json())
  );

  const price = journey.flights.reduce((finalPrice, _, flightIndex) => {
    const faresForFlight = fares?.[flightIndex]?.outbound?.fares;
    const date = journey.flights[flightIndex].departureDateTime.split("T")[0];
    return (
      finalPrice +
      (faresForFlight?.find((fare: Fare) => fare.day === date)?.price?.value ||
        0)
    );
  }, 0);

  return price;
}
