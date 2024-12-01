"use client";

import React, { useState } from "react";

const BASE_URL = "https://services-api.ryanair.com/timtbl/v3/journeys";

interface FormData {
  departureDateFrom: string;
  departureDateTo: string;
  origin: string;
  destination: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    departureDateFrom: "",
    departureDateTo: "",
    origin: "",
    destination: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPath = (params: FormData): string => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== "")
    );

    const path = `${params.origin}/${params.destination}`;
    const queryParams = new URLSearchParams(
      filteredParams as Record<string, string>
    ).toString();

    return `${path}?${queryParams}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const path = buildPath(formData);
    const requestURL = `${BASE_URL}/${path}`;

    try {
      const response = await fetch(requestURL, { method: "GET" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response Data:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Search flights</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="departureDateFrom">Departure Date From:</label>
        <br />
        <input
          type="date"
          id="departureDateFrom"
          name="departureDateFrom"
          value={formData.departureDateFrom}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="departureDateTo">Departure Date To:</label>
        <br />
        <input
          type="date"
          id="departureDateTo"
          name="departureDateTo"
          value={formData.departureDateTo}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="origin">Origin:</label>
        <br />
        <input
          type="text"
          id="origin"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="destination">Destination:</label>
        <br />
        <input
          type="text"
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
