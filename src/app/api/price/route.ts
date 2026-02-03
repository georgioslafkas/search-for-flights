import { NextResponse } from "next/server";
import { Fare, FareWapper, Flight, Journey } from "@/app/types";
import { buildFareUrl } from "@/app/utils";

// export async function POST(req: Request) {
//   try {
//     const { journey, currency }: { journey: Journey; currency: string } =
//       await req.json();

//     const requestURLs = journey.flights.map((flight) =>
//       buildFareUrl(flight, currency)
//     );

//     const responses = await Promise.all(requestURLs.map((url) => fetch(url)));
//     const fares: FareWapper[] = await Promise.all(
//       responses.map((res) => res.json())
//     );

//     const totalPrice = journey.flights.reduce((sum, _, index) => {
//       const faresForFlight = fares[index].outbound?.fares ?? [];
//       const date = journey.flights[index].departureDateTime.split("T")[0];
//       const fare = faresForFlight.find((f: Fare) => f.day === date);
//       return sum + (fare?.price?.value || 0);
//     }, 0);

//     return NextResponse.json({ price: totalPrice });
//   } catch (err) {
//     console.error("Error fetching price:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch price" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id")!;
    const currency = searchParams.get("currency")!;
    const journeyString = searchParams.get("journey")!;

    const journey = JSON.parse(journeyString);

    const requestURLs: string[] = journey.flights.map((flight: Flight) =>
      buildFareUrl(flight, currency),
    );

    const responses = await Promise.all(requestURLs.map((url) => fetch(url)));
    const fares: FareWapper[] = await Promise.all(
      responses.map((res) => res.json()),
    );

    const totalPrice = journey.flights.reduce(
      (sum: number, _: Flight, index: number) => {
        const faresForFlight = fares[index].outbound?.fares ?? [];
        const date = journey.flights[index].departureDateTime.split("T")[0];
        const fare = faresForFlight.find((f) => f.day === date);
        return sum + (fare?.price?.value || 0);
      },
      0,
    );

    return NextResponse.json({ id, price: totalPrice });
  } catch (err) {
    console.error("Error fetching price:", err);
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 },
    );
  }
}
