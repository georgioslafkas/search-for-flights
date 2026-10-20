import { Currency, Journey } from "./types";
import { JourneyItem } from "./JourneyItem";
import { getJourneyId } from "./utils";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type SortOption = "departure" | "duration";

const getDurationInMinutes = (duration: string): number => {
  const clockDuration = duration.match(/^(\d+):(\d{1,2})$/);
  if (clockDuration) {
    return Number(clockDuration[1]) * 60 + Number(clockDuration[2]);
  }

  const unitDuration = duration.match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/i);
  if (unitDuration && (unitDuration[1] || unitDuration[2])) {
    return Number(unitDuration[1] || 0) * 60 + Number(unitDuration[2] || 0);
  }

  return Number.POSITIVE_INFINITY;
};

type Props = {
  journeys: Journey[] | null;
  selectedCurrency: Currency;
  resultRef: React.RefObject<HTMLUListElement | HTMLDivElement>;
};

export const JourneyList = ({
  journeys,
  selectedCurrency,
  resultRef,
}: Props) => {
  const previousJourneysRef = useRef<Journey[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("departure");

  const sortedJourneys = useMemo(() => {
    if (!journeys) return [];

    return [...journeys].sort((first, second) =>
      sortOption === "duration"
        ? getDurationInMinutes(first.duration) -
          getDurationInMinutes(second.duration)
        : new Date(first.departureDateTime).getTime() -
          new Date(second.departureDateTime).getTime(),
    );
  }, [journeys, sortOption]);

  useEffect(() => {
    // Trigger animation when new results appear
    if (journeys?.length) {
      const items = document.querySelectorAll(".journey-item");
      items.forEach((el, i) => {
        (el as HTMLElement).style.animationDelay = `${i * 100}ms`;
        el.classList.add("animate-fade-in-up");
      });
      previousJourneysRef.current = journeys;
    }
  }, [journeys]);

  if (journeys !== null && journeys.length === 0) {
    return (
      <>
        <div
          ref={resultRef as React.RefObject<HTMLDivElement>}
          className="flex justify-center items-center flex-col mt-4 mb-4 border-2 border-dashed text-white"
        >
          No journeys found
          <Image
            src="/no-flight-64.png"
            alt="No flights found icon"
            width={64}
            height={64}
          />
        </div>
      </>
    );
  }

  return journeys?.length ? (
    <>
      <div className="mt-6 flex items-center justify-between gap-3">
        <label htmlFor="journey-sort" className="font-medium text-white">
          Sort by
        </label>
        <select
          id="journey-sort"
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value as SortOption)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
        >
          <option value="departure">Earliest departure</option>
          <option value="duration">Shortest total duration</option>
        </select>
      </div>
      <ul
        ref={resultRef as React.RefObject<HTMLUListElement>}
        id="journey-list"
        className="space-y-4 mt-4"
      >
        {sortedJourneys.map((journey, index) => (
          <JourneyItem
            selectedCurrency={selectedCurrency}
            journey={journey}
            key={getJourneyId(journey)}
            className="journey-item opacity-0 p-4 border rounded-xl bg-white shadow-md"
          />
        ))}
      </ul>
    </>
  ) : null;
};
