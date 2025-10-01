import App from "./App";
import { fetchAirports } from "./serverActions";

export default async function Page() {
  const airports = await fetchAirports();

  return <App airports={airports} />;
}
