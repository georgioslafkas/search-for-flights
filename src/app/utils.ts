import { Flight, FormData, Journey } from "@/app/types";
import endpoints from "./endpoints";

export function buildJourneyUrlPath(params: FormData): string {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([key, value]) => !["origin", "destination"].includes(key) && value !== ""
    )
  );

  const path = `${params.origin}/${params.destination}`;
  const queryParams = new URLSearchParams(
    filteredParams as Record<string, string>
  ).toString();

  return `${path}?${queryParams}`;
}

export function getJourneyId(journey: Journey): string {
  return `${journey.flights[0].departureAirportCode}_${
    journey.flights[journey.flights.length - 1].arrivalAirportCode
  }_${journey.departureDateTime}_${journey.arrivalDateTime}`;
}

export function buildFareUrl(flight: Flight, currency: string) {
  const dateOut = new Date(flight.departureDateTime)
    .toISOString()
    .split("T")[0];

  return `${endpoints.FARE_API}/oneWayFares/${flight.departureAirportCode}/${flight.arrivalAirportCode}/cheapestPerDay?outboundMonthOfDate=${dateOut}&currency=${currency}`;
}
