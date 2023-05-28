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
  success = 0,
  cannot_create = 1,
  non_existent = 2,
  cannot_update = 3,
}

export enum ErrorDescriptions {
  success = "Success",
  cannot_create = "Cannot create!",
  non_existent = "Nothing found!",
  cannot_update = "Cannot update!",
}
