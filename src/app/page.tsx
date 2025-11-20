import App from "./App";
import { Notification } from "./Notification";
import endpoints from "./endpoints";

async function fetchAirports() {
  const res = await fetch(endpoints.URL_AIRPORTS, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", // always fresh
  });

  if (!res.ok) {
    console.error("Failed to fetch airports:", res.statusText);
    return [];
  }

  return res.json();
}

export default async function Page() {
  const airports = await fetchAirports();

  return airports ? (
    <App airports={airports} />
  ) : (
    <Notification
      error="Something went wrong when looking for airports"
      className="bg-white"
    />
  );
}
