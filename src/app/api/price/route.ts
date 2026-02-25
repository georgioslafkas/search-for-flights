import { NextResponse } from "next/server";
import { Fare, Flight } from "@/app/types";
import { buildFareUrl } from "@/app/utils";

export async function POST(req: Request) {
  try {
    const { id, currency, journey } = await req.json();

    const requestURLs = journey.flights.map((flight: Flight) =>
      buildFareUrl(flight, currency),
    );

    const responses = await Promise.all(requestURLs.map(fetch));
    const fares = await Promise.all(responses.map((res) => res.json()));

    const totalPrice = journey.flights.reduce(
      (sum: number, _: Flight, index: number) => {
        const faresForFlight = fares[index].outbound?.fares ?? [];
        const date = journey.flights[index].departureDateTime.split("T")[0];
        const fare = faresForFlight.find((f: Fare) => f.day === date);
        return sum + (fare?.price?.value || 0);
      },
      0,
    );

    return NextResponse.json({ id, price: totalPrice });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 },
    );
  }
}
