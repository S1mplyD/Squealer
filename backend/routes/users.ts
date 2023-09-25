import express from "express";
import { Success, User } from "../util/types";
import {
  ban,
  deleteAccount,
  deleteProfilePicture,
  getAllUsers,
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
  changeUserPlan,
} from "../database/querys/users";
import { SquealerError, non_existent } from "../util/errors";
import { updateSquealsUsername } from "../database/querys/squeals";

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
        if (users instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(users);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
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
          if (deleted instanceof SquealerError) res.sendStatus(500);
          else res.sendStatus(200);
        } else {
          if ((req.user as User)._id === req.query.id) {
            const deleted: SquealerError | Success = await deleteAccount(
              req.body.mail,
              req.body.password,
              false,
            );
            if (deleted instanceof SquealerError) res.sendStatus(500);
            else res.sendStatus(200);
          } else res.sendStatus(401);
        }
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
    }
  });

router
  .route("/user/:username")
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
        if (user instanceof SquealerError) res.sendStatus(404);
        else res.status(200).send(user);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
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
          if (req.body.username) {
            await updateSquealsUsername(
              req.params.username as string,
              req.body.username,
            );
          }
          if (update instanceof SquealerError) res.sendStatus(500);
          else res.status(200).send(update);
        } else {
          if ((req.user as User)._id === req.query.id) {
            const update: SquealerError | User = await updateUser(
              req.query.username as string,
              req.body,
            );
            if (req.body.username) {
              await updateSquealsUsername(
                req.params.username as string,
                req.body.username,
              );
            }
            if (update instanceof SquealerError) res.sendStatus(500);
            else res.status(200).send(update);
          } else res.sendStatus(401);
        }
      } else res;
    } catch (error: any) {
      console.log(error);
    }
  });

router
  .route("/user/:username/profilePicture")
  /**
   * chiamata per aggiornare il percorso della profile picture
   * DA USARE DOPO LA CHIAMATA POST /api/media
   */
  .patch(async (req, res) => {
    try {
      if ((req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          const update: SquealerError | Success = await updateProfilePicture(
            req.params.username,
            req.query.filename as string,
          );
          if (update instanceof SquealerError) res.sendStatus(500);
          else res.sendStatus(200);
        } else {
          if (req.params.username === (req.user as User).username) {
            const update: SquealerError | Success = await updateProfilePicture(
              req.params.username,
              req.query.filename as string,
            );
            if (update instanceof SquealerError) res.sendStatus(500);
            else res.sendStatus(200);
          } else res.sendStatus(401);
        }
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
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
            req.params.username,
          );
          //fs.unlink ritorna "undefined" se ha successo
          if (deleted instanceof SquealerError) {
            if (deleted.code === 11) res.sendStatus(500);
            else res.sendStatus(404);
          } else res.sendStatus(200);
        } else {
          if ((req.user as User).username === req.params.username) {
            const deleted = await deleteProfilePicture(req.params.username);
            if (deleted instanceof SquealerError) {
              if (deleted.code === 11) res.sendStatus(500);
              else res.sendStatus(404);
            } else res.sendStatus(200);
          }
        }
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
    }
  });

router.route("/user/:username/smm").post(async (req, res) => {
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
        if (update === non_existent) res.sendStatus(404);
        else res.sendStatus(500);
      } else res.sendStatus(200);
    } else res.sendStatus(401);
  } catch (error) {
    console.log(error);
  }
});

router.route("/user/:username/changeplan").post(async (req, res) => {
  try {
    if (
      req.user &&
      (req.user as User).status !== "ban" &&
      (req.user as User).status !== "block"
    ) {
      if ((req.user as User).plan === "admin") {
        console.log(req.params, req.body);
        const update: Success | SquealerError | undefined =
          await changeUserPlan(req.params.username as string, req.body.plan);
        if (!(update instanceof SquealerError)) res.sendStatus(200);
        else res.sendStatus(500);
      } else {
        const update: Success | SquealerError | undefined =
          await changeUserPlan((req.user as User).username, req.body.plan);
        if (!(update instanceof SquealerError)) res.sendStatus(200);
        else res.sendStatus(500);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.route("/smm").delete(async (req, res) => {
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
        res.sendStatus(500);
      } else res.sendStatus(200);
    } else res.sendStatus(401);
  } catch (error) {
    console.log(error);
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
        if (update instanceof SquealerError) res.sendStatus(500);
        else res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
    }
  });

router
  .route("/grantPermissions")
  /**
   * POST
   * chiamata per garantire i permessi da admin ad un utente
   */
  .patch(async (req, res) => {
    console.log(req.user);
    try {
      if ((req.user as User).plan === "admin") {
        const update: SquealerError | Success = await grantPermissions(
          req.query.id as string,
        );
        if (update instanceof SquealerError) res.sendStatus(500);
        else res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
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
        if (banned instanceof SquealerError) res.sendStatus(500);
        else res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
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
        if (unban instanceof SquealerError) res.sendStatus(500);
        else res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
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
        const update: SquealerError | Success = await blockUser(
          req.query.username as string,
          req.query.time as unknown as number,
        );
        if (update instanceof SquealerError) res.sendStatus(500);
        else res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error: any) {
      console.log(error);
    }
  });

router.route("/unblock").post(async (req, res) => {
  try {
    if ((req.user as User).plan === "admin") {
      const update: SquealerError | Success = await unblockUser(
        req.query.username as string,
      );
      if (update instanceof SquealerError) res.sendStatus(500);
      else res.sendStatus(200);
    } else res.sendStatus(401);
  } catch (error) {
    console.log(error);
  }
});

router.route("/notification").get(async (req, res) => {
  if (
    req.user &&
    ((req.user as User).status != "ban" || (req.user as User).status != "block")
  ) {
    res.send((req.user as User).notification);
  } else res.sendStatus(401);
});
