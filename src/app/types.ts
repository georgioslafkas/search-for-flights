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
