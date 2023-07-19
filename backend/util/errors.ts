export interface Error {
  message: ErrorDescriptions;
  code: ErrorCodes;
}

// enum per il codice degli errori
export enum ErrorCodes {
  cannot_create = 10,
  non_existent = 20,
  cannot_update = 30,
  no_timers = 40,
  cannot_delete = 50,
  not_supported = 60,
  not_recived = 70,
  unauthorized = 80,
  cannot_send = 90,
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
