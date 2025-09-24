import { Journey } from "./types";

export const getJourneyId = (journey: Journey) => {
  const flights = journey.flights;
  return `${flights[0].departureAirportCode}_${
    flights[flights.length - 1].arrivalAirportCode
  }_${flights[0].departureDateTime}_${
    flights[flights.length - 1].arrivalDateTime
  }`;
};
