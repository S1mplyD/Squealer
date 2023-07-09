// classe per gli errori
export class Error {
  message: ErrorDescriptions;
  code: ErrorCodes;
  constructor(message: ErrorDescriptions, code: ErrorCodes) {
    this.message = message;
    this.code = code;
  }
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
}

export enum ErrorDescriptions {
  cannot_create = "Cannot create!",
  non_existent = "Nothing found!",
  cannot_update = "Cannot update!",
  no_timers = "No timer found!",
  cannot_delete = "Cannot delete!",
  not_supported = "File format not supported!",
  not_recived = "Nothing has been recived, check post request!",
}
