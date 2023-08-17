export interface Error {
  message: ErrorDescriptions;
  code: ErrorCodes;
}

// enum per il codice degli errori
export enum ErrorCodes {
  cannot_create = 10,
  cannot_delete = 11,
  cannot_send = 12,
  cannot_update = 13,
  cannot_get_location = 14,
  non_existent = 20,
  no_timers = 21,
  no_characters = 22,
  not_supported = 30,
  not_recived = 31,
  browser_not_supported = 32,
  unauthorized = 40,
}

export enum ErrorDescriptions {
  cannot_create = "Cannot create!",
  non_existent = "Nothing found!",
  cannot_update = "Cannot update!",
  no_timers = "No timer found!",
  cannot_delete = "Cannot delete!",
  not_supported = "File format not supported!",
  not_recived = "Nothing has been recived, check post request!",
  unauthorized = "You don't have enough permissions to perform this action!",
  cannot_send = "Cannot send email!",
  no_characters = "Not enough characters",
  cannot_get_location = "Cannot get location",
  browser_not_supported = "Browser is not supportes",
}

export const cannot_create: Error = {
  message: ErrorDescriptions.cannot_create,
  code: ErrorCodes.cannot_create,
};

export const non_existent: Error = {
  message: ErrorDescriptions.non_existent,
  code: ErrorCodes.non_existent,
};

export const cannot_update: Error = {
  message: ErrorDescriptions.cannot_update,
  code: ErrorCodes.cannot_update,
};

export const no_timers: Error = {
  message: ErrorDescriptions.no_timers,
  code: ErrorCodes.no_timers,
};

export const cannot_delete: Error = {
  message: ErrorDescriptions.cannot_delete,
  code: ErrorCodes.cannot_delete,
};

export const not_supported: Error = {
  message: ErrorDescriptions.not_supported,
  code: ErrorCodes.not_supported,
};

export const not_recived: Error = {
  message: ErrorDescriptions.not_recived,
  code: ErrorCodes.not_recived,
};

export const unauthorized: Error = {
  message: ErrorDescriptions.unauthorized,
  code: ErrorCodes.unauthorized,
};

export const cannot_send: Error = {
  message: ErrorDescriptions.cannot_send,
  code: ErrorCodes.cannot_send,
};

export const no_characters: Error = {
  message: ErrorDescriptions.no_characters,
  code: ErrorCodes.no_characters,
};

export const cannot_get_location: Error = {
  message: ErrorDescriptions.cannot_get_location,
  code: ErrorCodes.cannot_get_location,
};

export const browser_not_supported: Error = {
  message: ErrorDescriptions.browser_not_supported,
  code: ErrorCodes.browser_not_supported,
};
