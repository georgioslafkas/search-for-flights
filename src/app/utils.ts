import { Flight, FormData, Journey, JourneyPriceMap } from "@/app/types";
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

export function getJourneysWithPrice(
  journeyPriceMap: JourneyPriceMap,
  journeys: Journey[]
) {
  const journeysWithPriceKeys = Array.from(journeyPriceMap.entries())
    .filter(([_, value]) => value > 0)
    .map(([key]) => key);

  const matches = journeys.filter((journey) => {
    const journeyId = getJourneyId(journey);
    return journeysWithPriceKeys.includes(journeyId);
  });
  return matches;
}

export function buildFareUrl(flight: Flight, currency: string) {
  const dateOut = new Date(flight.departureDateTime)
    .toISOString()
    .split("T")[0];

  return `${endpoints.FARE_API}/oneWayFares/${flight.departureAirportCode}/${flight.arrivalAirportCode}/cheapestPerDay?outboundMonthOfDate=${dateOut}&currency=${currency}`;
}

export function getBookingLink(flight: Flight) {
  const startDate = new Date(flight.departureDateTime).toLocaleDateString("sv");
  return `${endpoints.URL_BOOKING}?tpAdults=1&tpStartDate=${startDate}&tpOriginIata=${flight.departureAirportCode}&tpDestinationIata=${flight.arrivalAirportCode}`;
}
