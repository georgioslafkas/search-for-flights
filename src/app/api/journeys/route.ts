import { NextResponse } from "next/server";
import { buildJourneyUrlPath } from "@/app/utils";
import endpoints from "@/app/endpoints";

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const path = buildJourneyUrlPath(formData);
    const requestURL = `${endpoints.URL_JOURNEYS}/${path}`;

    const res = await fetch(requestURL, { method: "GET" });
    if (!res.ok) {
      console.error("Failed to fetch journeys:", res.statusText);
      return NextResponse.json(
        { error: "Failed to fetch journeys" },
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch journeys" },
      { status: 500 },
    );
  }
}
