//   code: ErrorCodes;
// }
// export class MyError extends Error {
//   message: string;
//   code: number;
//   constructor(message: string, code: number) {
//     super(message);
//     this.code = code;
//   }
// }

export class SquealerError {
  message: ErrorDescriptions;
  code: ErrorCodes;
  constructor(message: ErrorDescriptions, code: ErrorCodes) {
    (this.message = message), (this.code = code);
  }
}
// enum per il codice degli errori
export enum ErrorCodes {
  cannot_create = 10,
  cannot_delete = 11,
  cannot_send = 12,
  cannot_update = 13,
  cannot_get_location = 14,
  cannot_login = 15,
  non_existent = 20,
  no_timers = 21,
  no_characters = 22,
  not_supported = 30,
  not_recived = 31,
  not_valid = 32,
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
  not_valid = "Not valid",
  unauthorized = "You don't have enough permissions to perform this action!",
  cannot_send = "Cannot send email!",
  no_characters = "Not enough characters",
  cannot_get_location = "Cannot get location",
  browser_not_supported = "Browser is not supportes",
  cannot_login = "Cannot login",
}

export const cannot_create = new SquealerError(
  ErrorDescriptions.cannot_create,
  ErrorCodes.cannot_create,
);

export const non_existent = new SquealerError(
  ErrorDescriptions.non_existent,
  ErrorCodes.non_existent,
);

/**
 * Not Valid
 */
export const not_valid = new SquealerError(
  ErrorDescriptions.not_valid,
  ErrorCodes.not_valid,
);

export const cannot_update = new SquealerError(
  ErrorDescriptions.cannot_update,
  ErrorCodes.cannot_update,
);

export const no_timers = new SquealerError(
  ErrorDescriptions.no_timers,
  ErrorCodes.no_timers,
);

export const cannot_delete = new SquealerError(
  ErrorDescriptions.cannot_delete,
  ErrorCodes.cannot_delete,
);

export const not_supported = new SquealerError(
  ErrorDescriptions.not_supported,
  ErrorCodes.not_supported,
);

export const not_recived = new SquealerError(
  ErrorDescriptions.not_recived,
  ErrorCodes.not_recived,
);

export const unauthorized = new SquealerError(
  ErrorDescriptions.unauthorized,
  ErrorCodes.unauthorized,
);

export const cannot_send = new SquealerError(
  ErrorDescriptions.cannot_send,
  ErrorCodes.cannot_send,
);

export const no_characters = new SquealerError(
  ErrorDescriptions.no_characters,
  ErrorCodes.no_characters,
);

export const cannot_get_location = new SquealerError(
  ErrorDescriptions.cannot_get_location,
  ErrorCodes.cannot_get_location,
);

export const browser_not_supported = new SquealerError(
  ErrorDescriptions.browser_not_supported,
  ErrorCodes.browser_not_supported,
);

export const cannot_login = new SquealerError(
  ErrorDescriptions.cannot_login,
  ErrorCodes.cannot_login,
);

export function catchError(error: any) {
  console.log({ errorName: error.name, errorDescription: error.message });
}
