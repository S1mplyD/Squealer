import express from "express";
import { Success, User } from "../util/types";
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
  SquealerError,
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
    if (!req.user || (req.user as User).status !== "ban") {
      const users: User[] | SquealerError | undefined = await getAllUsers();
      if (users === undefined) res.send(non_existent);
      else res.send(users);
    } else res.send(unauthorized);
  } catch (error: any) {
    catchError(error);
  }
});

router
  .route("/:id")
  /**
   * GET
   * chiamata che ritorna un utente
   */
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const user: User | SquealerError = await getUser(
          req.params.id as string
        );
        res.send(user);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  })
  /**
   * PATCH
   * chiamata per modificare le informazioni di un utente
   */
  .patch(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          const update: SquealerError | Success = await updateUser(
            req.params.id as string,
            req.body
          );
          res.send(update);
        } else {
          if ((req.user as User)._id === req.query.id) {
            const update: SquealerError | Success = await updateUser(
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

  /**
   * DELETE
   * chiamata per eliminare permanentemente un account
   * (NO GOING BACK)
   */
  .delete(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          const deleted: SquealerError | Success | undefined =
            await deleteAccount(req.body.mail, "", true);
          if (deleted !== undefined) res.send(deleted);
          else res.send(cannot_delete);
        } else {
          if ((req.user as User)._id === req.query.id) {
            const deleted: SquealerError | Success | undefined =
              await deleteAccount(req.body.mail, req.body.password, false);
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
          const update: SquealerError | Success | undefined =
            await updateProfilePicture(
              req.params.id,
              req.query.filename as string
            );
          if (!update) res.send(cannot_update);
          else res.send(update);
        } else {
          if (req.params.id === ((req.user as User)._id as unknown as string)) {
            const update: SquealerError | Success | undefined =
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
  /**
   * DELETE
   * chiamata per eliminare la foto profilo e reimpostare quella di default
   */
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

router
  .route("/revokePermissions")
  /**
   * POST
   * chiamata per revocare i permessi da admin ad un utente
   */
  .post(async (req, res) => {
    try {
      if ((req.user as User).plan === "admin") {
        const update: SquealerError | Success = await revokePermissions(
          req.query.id as string
        );
        res.send(update);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });

router
  .route("/grantPermissions")
  /**
   * POST
   * chiamata per garantire i permessi da admin ad un utente
   */
  .post(async (req, res) => {
    try {
      if ((req.user as User).plan === "admin") {
        const update: SquealerError | Success = await grantPermissions(
          req.query.id as string
        );
        res.send(update);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });

router
  .route("/ban")
  /**
   * POST
   * chiamata per bannare un utente
   */
  .post(async (req, res) => {
    try {
      if ((req.user as User).plan === "admin") {
        const banned = await ban(req.query.id as string);
        res.send(banned);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });

router
  .route("/unban")
  /**
   * POST
   * chiamata per sbannare un utente
   */
  .post(async (req, res) => {
    try {
      if ((req.user as User).plan === "admin") {
        const unban: SquealerError | Success = await unbanUser(
          req.query.id as string
        );
        res.send(unban);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });

router
  .route("/block")
  /**
   * POST
   * chiamata per bloccare l'utente per un determinato periodo di tempo
   */
  .post(async (req, res) => {
    try {
      if ((req.user as User).plan === "admin") {
        const update: SquealerError | undefined = await blockUser(
          req.query.id as string,
          req.query.time as unknown as number
        );
        if (update instanceof SquealerError) res.send(update);
        else res.send(updated);
      } else res.send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });