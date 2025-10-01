import { fetchAirports } from "@/app/serverActions";
import App from "@/app/App";

export default async function FlightSearch() {
  const airports = await fetchAirports();

  return <App airports={airports} />;
}
