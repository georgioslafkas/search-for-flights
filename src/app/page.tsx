import App from "./App";
import { fetchAirports } from "./serverActions";
import { Notification } from "./Notification";

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
