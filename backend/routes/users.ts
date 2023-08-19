import express from "express";
import { Error, Success, User } from "../util/types";
import {
  ban,
  deleteAccount,
  deleteProfilePicture,
  getAllUsers,
  getUser,
  grantPermissions,
  revokePermissions,
  unbanUser,
  updateProfilePicture,
  updateUser,
  blockUser,
} from "../database/querys/users";
import {
  cannot_delete,
  cannot_update,
  catchError,
  non_existent,
  unauthorized,
} from "../util/errors";
import { removed, updated } from "../util/success";

export const router = express.Router();
/**
 * GET
 * funzione che ritorna tutti gli utenti
 */
router.route("/").get(async (req, res) => {
  try {
    if ((req.user as User).status !== "ban") {
      const users: User[] | Error | undefined = await getAllUsers();
      if (users === undefined) res.send(non_existent);
      else res.send(users);
    } else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        const user: User | Error = await getUser(req.params.id);
        res.send(user);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  })
  .patch(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          const update: Error | Success = await updateUser(
            req.query.id as string,
            req.body
          );
          res.send(update);
        } else {
          if ((req.user as User)._id === req.query.id) {
            const update: Error | Success = await updateUser(
              req.query.id as string,
              req.body
            );
            res.send(update);
          } else res.send(unauthorized);
        }
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  })
  .delete(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          const deleted: Error | Success | undefined = await deleteAccount(
            req.body.mail,
            "",
            true
          );
          if (deleted !== undefined) res.send(deleted);
          else res.send(cannot_delete);
        } else {
          if ((req.user as User)._id === req.query.id) {
            const deleted: Error | Success | undefined = await deleteAccount(
              req.body.mail,
              req.body.password,
              false
            );
            if (deleted !== undefined) res.send(deleted);
            else res.send(cannot_delete);
          } else res.send(unauthorized);
        }
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });

router
  .route("/:id/profilePicture")
  /**
   * chiamata per aggiornare il percorso della profile picture
   * DA USARE DOPO LA CHIAMATA POST /api/media
   */
  .patch(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          const update: Error | Success | undefined =
            await updateProfilePicture(
              req.params.id,
              req.query.filename as string
            );
          if (!update) res.send(cannot_update);
          else res.send(update);
        } else {
          if (req.params.id === ((req.user as User)._id as unknown as string)) {
            const update: Error | Success | undefined =
              await updateProfilePicture(
                req.params.id,
                req.query.filename as string
              );
            if (!update) res.send(cannot_update);
            else res.send(update);
          } else res.send(unauthorized);
        }
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  })
  .delete(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          const deleted = await deleteProfilePicture(req.params.id);
          //fs.unlink ritorna "undefined" se ha successo
          if (deleted === undefined) res.send(removed);
          else res.send(deleted);
        } else {
          if (((req.user as User)._id as unknown as string) === req.params.id) {
            const deleted = await deleteProfilePicture(req.params.id);
            if (deleted === undefined) res.send(removed);
            else res.send(deleted);
          }
        }
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });

router.route("/revokePermissions").post(async (req, res) => {
  try {
    if ((req.user as User).plan === "admin") {
      const update: Error | Success = await revokePermissions(
        req.query.id as string
      );
      res.send(update);
    } else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});

router.route("/grantPermissions").post(async (req, res) => {
  try {
    if ((req.user as User).plan === "admin") {
      const update: Error | Success = await grantPermissions(
        req.query.id as string
      );
      res.send(update);
    } else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});

router.route("/ban").post(async (req, res) => {
  try {
    if ((req.user as User).plan === "admin") {
      const banned = await ban(req.query.id as string);
      res.send(banned);
    } else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});

router.route("/unban").post(async (req, res) => {
  try {
    if ((req.user as User).plan === "admin") {
      const unban: Error | Success = await unbanUser(req.query.id as string);
      res.send(unban);
    } else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});

router.route("/block").post(async (req, res) => {
  try {
    if ((req.user as User).plan === "admin") {
      const update: Error | undefined = await blockUser(
        req.query.id as string,
        req.query.time as unknown as number
      );
      if (update instanceof Error) res.send(update);
      else res.send(updated);
    } else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});
