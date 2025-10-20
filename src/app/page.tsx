import App from "./App";
import { fetchAirports } from "./serverActions";
import { Error } from "./Error";

export default async function Page() {
  const airports = await fetchAirports();

  return airports ? (
    <App airports={airports} />
  ) : (
    <Error
      error="Something went wrong when looking for airports"
      className="bg-white"
    />
  );
}
