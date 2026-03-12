"use server";

import endpoints from "@/app/endpoints";
import { FormData, Journey } from "@/app/types";
import { buildJourneyUrlPath } from "@/app/utils";

export async function findJourneys(formData: FormData): Promise<Journey[]> {
  const path = buildJourneyUrlPath(formData);
  const requestURL = `${endpoints.URL_JOURNEYS}/${path}`;

  const res = await fetch(requestURL, { method: "GET" });
  if (!res.ok) {
    console.error("Failed to fetch journeys:", res.statusText);
    return [];
  }

  return res.json();
}
