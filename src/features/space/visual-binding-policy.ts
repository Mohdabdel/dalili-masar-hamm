// سياسة ارتباط الصورة بالمشاركة.
// الصورة طبقة عرض قابلة للاستبدال، وليست جزءًا من صلاحية المشاركة الوظيفية نفسها.

export type ImageReviewStatus =
  | "IMAGE_ACCEPTED"
  | "IMAGE_REPLACE_LATER"
  | "IMAGE_MISSING"
  | "IMAGE_NOT_REQUIRED_FOR_CONTENT_APPROVAL"
  | "IMAGE_REJECTED";

export interface VisualBindingDecision {
  status: ImageReviewStatus;
  contentApprovalBlocked: boolean;
  replacementAllowed: boolean;
}

const DECISIONS: Record<ImageReviewStatus, VisualBindingDecision> = {
  IMAGE_ACCEPTED: {
    status: "IMAGE_ACCEPTED",
    contentApprovalBlocked: false,
    replacementAllowed: true,
  },
  IMAGE_REPLACE_LATER: {
    status: "IMAGE_REPLACE_LATER",
    contentApprovalBlocked: false,
    replacementAllowed: true,
  },
  IMAGE_MISSING: {
    status: "IMAGE_MISSING",
    contentApprovalBlocked: false,
    replacementAllowed: true,
  },
  IMAGE_NOT_REQUIRED_FOR_CONTENT_APPROVAL: {
    status: "IMAGE_NOT_REQUIRED_FOR_CONTENT_APPROVAL",
    contentApprovalBlocked: false,
    replacementAllowed: true,
  },
  IMAGE_REJECTED: {
    status: "IMAGE_REJECTED",
    contentApprovalBlocked: true,
    replacementAllowed: true,
  },
};

export function visualBindingDecision(
  status: ImageReviewStatus,
): VisualBindingDecision {
  return DECISIONS[status];
}

export function canApproveParticipationContentWithImageStatus(
  status: ImageReviewStatus,
): boolean {
  return !visualBindingDecision(status).contentApprovalBlocked;
}

export function canReplaceVisualBinding(status: ImageReviewStatus): boolean {
  return visualBindingDecision(status).replacementAllowed;
}
