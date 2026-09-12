import { describe, expect, it } from "vitest";
import {
  canApproveParticipationContentWithImageStatus,
  canReplaceVisualBinding,
  visualBindingDecision,
  type ImageReviewStatus,
} from "../visual-binding-policy";

const nonBlocking: ImageReviewStatus[] = [
  "IMAGE_ACCEPTED",
  "IMAGE_REPLACE_LATER",
  "IMAGE_MISSING",
  "IMAGE_NOT_REQUIRED_FOR_CONTENT_APPROVAL",
];

describe("visual binding policy", () => {
  it("keeps visual review separate from content approval for replaceable images", () => {
    for (const status of nonBlocking) {
      expect(canApproveParticipationContentWithImageStatus(status), status).toBe(true);
      expect(canReplaceVisualBinding(status), status).toBe(true);
    }
  });

  it("blocks content approval only when the selected image itself is rejected", () => {
    expect(canApproveParticipationContentWithImageStatus("IMAGE_REJECTED")).toBe(false);
    expect(canReplaceVisualBinding("IMAGE_REJECTED")).toBe(true);
    expect(visualBindingDecision("IMAGE_REJECTED")).toEqual({
      status: "IMAGE_REJECTED",
      contentApprovalBlocked: true,
      replacementAllowed: true,
    });
  });
});
