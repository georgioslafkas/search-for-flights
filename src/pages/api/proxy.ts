/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function handler(req: any, res: any) {
  const apiUrl = `https://www.ryanair.com/api/booking/v4/en-ie/availability`;
  const queryString = new URLSearchParams(req.query).toString();

  try {
    const response = await fetch(`${apiUrl}?${queryString}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log({ errorText });
      res.status(response.status).json({ error: errorText });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
