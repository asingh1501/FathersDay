import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Lightbox } from "@/components/Lightbox";

const photos = ["one", "two"].map((id) => ({ id, albumId: "family", albumName: "Family", originalFilename: `${id}.jpg`, generatedFilename: `${id}.webp`, src: "/test.webp", width: 100, height: 100, aspectRatio: 1, caption: id }));

describe("Lightbox", () => {
  it("supports keyboard navigation and escape dismissal", () => { const onIndex = vi.fn(); const onClose = vi.fn(); render(<Lightbox photos={photos} index={0} onIndex={onIndex} onClose={onClose} />); fireEvent.keyDown(window, { key: "ArrowRight" }); expect(onIndex).toHaveBeenCalledWith(1); fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" }); expect(onClose).toHaveBeenCalled(); });
});
