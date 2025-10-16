export interface FormData {
  departureDateFrom: string;
  departureDateTo: string;
  origin: string;
  destination: string;
}

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

export type Airport = {
  code: string;
  name: string;
  seoName: string;
  aliases: string[];
  base: boolean;
  city: {
    name: string;
    code: string;
  };
  region: {
    name: string;
    code: string;
  };
  country: {
    code: string;
    iso3code: string;
    name: string;
    currency: string;
    defaultAirportCode: string;
    schengen: true;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timeZone: string;
};
