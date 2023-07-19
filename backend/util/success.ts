export interface Success {
  message: SuccessDescription;
  code: SuccessCode;
}

// enum per il codice dei successi
export enum SuccessCode {
  created = 0,
  updated = 1,
  removed = 2,
  logged_in = 3,
  logged_out = 4,
  signed_up = 5,
  sent = 6,
}

// enum per le descrizioni dei successi
export enum SuccessDescription {
  created = "Successfully created",
  updated = "Updated successfully",
  removed = "Removed successfully",
  logged_in = "Logged in successfully",
  logged_out = "Logged out successfully",
  signed_up = "Signed up successfully",
  sent = "Email sent correctly",
}

export const created: Success = {
  message: SuccessDescription.created,
  code: SuccessCode.created,
};
export const updated: Success = {
  message: SuccessDescription.updated,
  code: SuccessCode.updated,
};
export const removed: Success = {
  message: SuccessDescription.removed,
  code: SuccessCode.removed,
};
export const logged_in: Success = {
  message: SuccessDescription.logged_in,
  code: SuccessCode.logged_in,
};
export const logged_out: Success = {
  message: SuccessDescription.logged_out,
  code: SuccessCode.logged_out,
};
export const signed_up: Success = {
  message: SuccessDescription.signed_up,
  code: SuccessCode.signed_up,
};

export const sent: Success = {
  message: SuccessDescription.sent,
  code: SuccessCode.sent,
};
