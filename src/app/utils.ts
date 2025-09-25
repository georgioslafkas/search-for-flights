import { Journey } from "./types";
import { FormData } from "./types";

export const getJourneyId = (journey: Journey) => {
  const flights = journey.flights;
  return `${flights[0].departureAirportCode}_${
    flights[flights.length - 1].arrivalAirportCode
  }_${flights[0].departureDateTime}_${
    flights[flights.length - 1].arrivalDateTime
  }`;
};

export const buildJourneyUrlPath = (params: FormData): string => {
  const filteredParams = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(params).filter(
      ([key, value]) => !["origin", "destination"].includes(key) && value !== ""
    )
  );

  const path = `${params.origin}/${params.destination}`;
  const queryParams = new URLSearchParams(
    filteredParams as Record<string, string>
  ).toString();

  return `${path}?${queryParams}`;
};
