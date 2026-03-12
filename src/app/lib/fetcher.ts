export const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error after logging it
    });
