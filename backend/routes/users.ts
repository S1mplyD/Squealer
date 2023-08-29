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
  getUserByUsername,
  unblockUser,
  addSMM,
  removeSMM,
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
router
  .route("/")
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const users: User[] | SquealerError = await getAllUsers();
        if (users instanceof SquealerError) res.status(404).send(non_existent);
        else res.status(200).send(users);
      } else res.status(401).send(unauthorized);
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
          const deleted: SquealerError | Success = await deleteAccount(
            req.body.mail,
            "",
            true,
          );
          if (deleted instanceof SquealerError) res.status(500).send(deleted);
          else res.status(200).send(cannot_delete);
        } else {
          if ((req.user as User)._id === req.query.id) {
            const deleted: SquealerError | Success = await deleteAccount(
              req.body.mail,
              req.body.password,
              false,
            );
            if (deleted instanceof SquealerError) res.status(500).send(deleted);
            else res.status(200).send(cannot_delete);
          } else res.status(401).send(unauthorized);
        }
      } else res.status(401).send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });

router
  .route("/:username")
  /**
   * GET
   * chiamata che ritorna un utente
   */
  .get(async (req, res) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const user: User | SquealerError = await getUserByUsername(
          req.params.username as string,
        );
        if (user instanceof SquealerError) res.status(404).send(user);
        else res.status(200).send(user);
      } else res.status(401).send(unauthorized);
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
          const update: SquealerError | User = await updateUser(
            req.params.username as string,
            req.body,
          );
          if (update instanceof SquealerError) res.status(500).send(update);
          else res.status(200).send(update);
        } else {
          if ((req.user as User)._id === req.query.id) {
            const update: SquealerError | User = await updateUser(
              req.query.username as string,
              req.body,
            );
            if (update instanceof SquealerError) res.status(500).send(update);
            else res.status(200).send(update);
          } else res.status(401).send(unauthorized);
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
          const update: SquealerError | Success = await updateProfilePicture(
            req.params.id,
            req.query.filename as string,
          );
          if (update instanceof SquealerError)
            res.status(500).send(cannot_update);
          else res.status(200).send(update);
        } else {
          if (req.params.id === (req.user as User)._id) {
            const update: SquealerError | Success = await updateProfilePicture(
              req.params.id,
              req.query.filename as string,
            );
            if (update instanceof SquealerError)
              res.status(500).send(cannot_update);
            else res.status(200).send(update);
          } else res.status(401).send(unauthorized);
        }
      } else res.status(401).send(unauthorized);
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
          const deleted: SquealerError | undefined = await deleteProfilePicture(
            req.params.id,
          );
          //fs.unlink ritorna "undefined" se ha successo
          if (deleted instanceof SquealerError) {
            if (deleted.code === 11) res.status(500).send(deleted);
            else res.status(404).send(deleted);
          } else res.status(200).send(removed);
        } else {
          if (((req.user as User)._id as unknown as string) === req.params.id) {
            const deleted = await deleteProfilePicture(req.params.id);
            if (deleted instanceof SquealerError) {
              if (deleted.code === 11) res.status(500).send(deleted);
              else res.status(404).send(deleted);
            } else res.status(200).send(removed);
          }
        }
      } else res.status(401).send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });

router
  .route("/:username/smm")

  .post(async (req, res) => {
    try {
      if (
        ((req.user as User).status !== "block" ||
          (req.user as User).status !== "ban") &&
        (req.user as User).plan === "professional"
      ) {
        const update: SquealerError | Success = await addSMM(
          req.params.username,
          (req.user as User)._id,
        );
        if (update instanceof SquealerError) {
          if (update === non_existent) res.status(404).send(update);
          else res.status(500).send(update);
        } else res.status(200).send(update);
      } else res.status(401).send(unauthorized);
    } catch (error) {
      catchError(error);
    }
  })

  .delete(async (req, res) => {
    try {
      if (
        ((req.user as User).status !== "block" ||
          (req.user as User).status !== "ban") &&
        (req.user as User).plan === "professional"
      ) {
        const update: SquealerError | Success = await removeSMM(
          (req.user as User)._id,
        );
        if (update instanceof SquealerError) {
          res.status(500).send(update);
        } else res.status(200).send(update);
      } else res.status(401).send(unauthorized);
    } catch (error) {
      catchError(error);
    }
  });

router
  .route("/revokePermissions")
  /**
   * POST
   * chiamata per revocare i permessi da admin ad un utente
   */
  .patch(async (req, res) => {
    try {
      if ((req.user as User).plan === "admin") {
        const update: SquealerError | Success = await revokePermissions(
          req.query.id as string,
        );
        if (update instanceof SquealerError) res.status(500).send(update);
        else res.status(200).send(update);
      } else res.status(401).send(unauthorized);
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
  .patch(async (req, res) => {
    try {
      if ((req.user as User).plan === "admin") {
        const update: SquealerError | Success = await grantPermissions(
          req.query.id as string,
        );
        if (update instanceof SquealerError) res.status(500).send(update);
        else res.status(200).send(update);
      } else res.status(401).send(unauthorized);
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
        const banned: SquealerError | Success = await ban(
          req.query.id as string,
        );
        if (banned instanceof SquealerError) res.status(500).send(banned);
        else res.status(200).send(banned);
      } else res.status(401).send(unauthorized);
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
          req.query.id as string,
        );
        if (unban instanceof SquealerError) res.status(500).send(unban);
        else res.status(200).send(unban);
      } else res.status(401).send(unauthorized);
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
          req.query.time as unknown as number,
        );
        if (update instanceof SquealerError) res.status(500).send(update);
        else res.status(200).send(updated);
      } else res.status(401).send(unauthorized);
    } catch (error: any) {
      catchError(error);
    }
  });

router.route("/unblock").post(async (req, res) => {
  try {
    if ((req.user as User).plan === "admin") {
      const update: SquealerError | Success = await unblockUser(
        req.query.username as string,
      );
      if (update instanceof SquealerError) res.status(500).send(update);
      else res.status(200).send(update);
    } else res.sendStatus(401);
  } catch (error) {
    catchError(error);
  }
});
