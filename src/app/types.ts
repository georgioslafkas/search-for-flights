export interface FormData {
  departureDateFrom: string;
  departureDateTo: string;
  origin: string;
  destination: string;
}

export const AVAILABILITY_PARAMS = {
  ADT: 1,
  ToUs: "AGREED",
  FlexDaysBeforeIn: 2,
  FlexDaysBeforeOut: 2,
  FlexDaysIn: 2,
  FlexDaysOut: 2,
} as const;

export const CURRENCIES = {
  SEK: "SEK",
  EUR: "EUR",
} as const;

export type Journey = {
  arrivalDateTime: string;
  departureDateTime: string;
  duration: string;
  flights: Flight[];
};

export type Flight = {
  departureAirportCode: string;
  arrivalAirportCode: string;
  departureDateTime: string;
  arrivalDateTime: string;
};

export type FareWapper = {
  outbound: {
    fares: Fare[];
    maxFare: Fare;
    minFare: Fare;
  };
};

export type Fare = {
  arrivalDate: string;
  day: string;
  departureDate: string;
  price: {
    value: number;
    valueMainUnit: string;
    valueFractionalUnit: string;
    currencyCode: string;
    currencySymbol: string;
  };
  soldOut: boolean;
  unavailable: boolean;
};
