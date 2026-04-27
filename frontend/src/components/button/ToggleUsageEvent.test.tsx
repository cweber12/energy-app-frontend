// frontend/src/components/button/ToggleUsageEvent.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ToggleUsageEvent from "./ToggleUsageEvent";
import { startEvent, endEvent } from "../../supabase_services/eventsService";
import { useLastEvent } from "../../hooks/useEvent";

jest.mock("../../context/ThemeContext", () => ({
  useTheme: () => ({
    colors: {
      buttonStart: "#22c55e",
      buttonStop: "#ef4444",
    },
  }),
}));

jest.mock("../../hooks/useEvent");
jest.mock("../../supabase_services/eventsService");

const mockUseLastEvent = useLastEvent as jest.MockedFunction<typeof useLastEvent>;
const mockStartEvent = startEvent as jest.MockedFunction<typeof startEvent>;
const mockEndEvent = endEvent as jest.MockedFunction<typeof endEvent>;

const ISO_TS = "2026-04-27T12:00:00.000Z";

beforeEach(() => {
  jest.clearAllMocks();
  mockUseLastEvent.mockReturnValue({ startTs: null, endTs: null, eventId: null });
  mockStartEvent.mockResolvedValue({ event_id: 42, start_ts: ISO_TS });
  mockEndEvent.mockResolvedValue({ event_id: 42, end_ts: ISO_TS });
});

describe("ToggleUsageEvent", () => {
  it("shows Start button when there is no running event", () => {
    render(<ToggleUsageEvent itemId={1} />);
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.queryByText("Stop")).not.toBeInTheDocument();
  });

  it("calls startEvent with the item ID and an ISO timestamp when Start is clicked", async () => {
    render(<ToggleUsageEvent itemId={1} />);
    fireEvent.click(screen.getByText("Start"));
    await waitFor(() =>
      expect(mockStartEvent).toHaveBeenCalledWith(1, expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)),
    );
  });

  it("switches to Stop button after starting an event", async () => {
    render(<ToggleUsageEvent itemId={1} />);
    fireEvent.click(screen.getByText("Start"));
    await waitFor(() => expect(screen.getByText("Stop")).toBeInTheDocument());
    expect(screen.queryByText("Start")).not.toBeInTheDocument();
  });

  it("shows Stop button when useLastEvent reports a running event", async () => {
    mockUseLastEvent.mockReturnValue({ startTs: new Date(), endTs: null, eventId: 99 });
    render(<ToggleUsageEvent itemId={2} />);
    await waitFor(() => expect(screen.getByText("Stop")).toBeInTheDocument());
    expect(screen.queryByText("Start")).not.toBeInTheDocument();
  });

  it("calls endEvent with the current event ID when Stop is clicked", async () => {
    mockUseLastEvent.mockReturnValue({ startTs: new Date(), endTs: null, eventId: 99 });
    render(<ToggleUsageEvent itemId={2} />);
    await waitFor(() => expect(screen.getByText("Stop")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Stop"));
    await waitFor(() =>
      expect(mockEndEvent).toHaveBeenCalledWith(99, expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)),
    );
  });

  it("switches back to Start button after stopping an event", async () => {
    mockUseLastEvent.mockReturnValue({ startTs: new Date(), endTs: null, eventId: 99 });
    render(<ToggleUsageEvent itemId={2} />);
    await waitFor(() => expect(screen.getByText("Stop")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Stop"));
    await waitFor(() => expect(screen.getByText("Start")).toBeInTheDocument());
    expect(screen.queryByText("Stop")).not.toBeInTheDocument();
  });
});
