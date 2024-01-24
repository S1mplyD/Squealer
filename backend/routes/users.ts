import express, {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { User } from "../util/types";
import {
  addCharactersToUser,
  addSMM,
  ban,
  blockUser,
  changeUserPlan,
  deleteAccount,
  deleteProfilePicture,
  getAllUsers,
  getManagedUsers,
  getProfessionalUsers,
  getUserByUsername,
  getUserProfilePictureByUsername,
  getUsersByNameAsc,
  getUsersByNameDesc,
  getUsersByPopularityAsc,
  getUsersByPopularityDesc,
  getUsersByTypeAsc,
  getUsersByTypeDesc,
  grantPermissions,
  removeSMM,
  revokePermissions,
  unbanUser,
  unblockUser,
  updateProfilePicture,
  updateUser,
} from "../database/queries/users";
import { non_existent, SquealerError } from "../util/errors";
import { updateSquealsUsername } from "../database/queries/squeals";

export const router = express.Router();
/**
 * GET
 * funzione che ritorna tutti gli utenti
 */
router
  .route("/")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const users: User[] = await getAllUsers();
        res.status(200).send(users);
      } else res.sendStatus(401);
    } catch (error: any) {
      res.status(500).send(error);
    }
  })
  /**
   * DELETE
   * chiamata per eliminare permanentemente un account
   * (NO GOING BACK)
   */
  .delete(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if ((req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          await deleteAccount(req.body.mail, "", true);
          res.sendStatus(200);
        } else {
          if ((req.user as User)._id === req.query.id) {
            await deleteAccount(req.body.mail, req.body.password, false);
            res.sendStatus(200);
          } else res.sendStatus(401);
        }
      } else res.sendStatus(401);
    } catch (error: any) {
      res.status(500).send(error);
    }
  });

router
  .route("/user/:username")
  /**
   * GET
   * chiamata che ritorna un utente
   */
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (!req.user || (req.user as User).status !== "ban") {
        const user: User = await getUserByUsername(
          req.params.username as string,
        );
        res.status(200).send(user);
      } else res.sendStatus(401);
    } catch (error: any) {
      res.status(500).send(error);
    }
  })
  /**
   * PATCH
   * chiamata per modificare le informazioni di un utente
   */
  .patch(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if ((req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          const update: User = await updateUser(
            req.params.username as string,
            req.body,
          );
          if (req.body.username) {
            await updateSquealsUsername(
              req.params.username as string,
              req.body.username,
            );
          }
          res.status(200).send(update);
        } else {
          if ((req.user as User)._id === req.query.id) {
            const update: User = await updateUser(
              req.query.username as string,
              req.body,
            );
            if (req.body.username) {
              await updateSquealsUsername(
                req.params.username as string,
                req.body.username,
              );
            }
            res.status(200).send(update);
          } else res.sendStatus(401);
        }
      } else res.sendStatus(401);
    } catch (error: any) {
      res.status(500).send(error);
    }
  });

router
  .route("/user/:username/profilePicture")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const profilePicture = await getUserProfilePictureByUsername(
        req.params.username,
      );
      res.send(profilePicture);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  /**
   * chiamata per aggiornare il percorso della profile picture
   * DA USARE DOPO LA CHIAMATA POST /api/media
   */
  .patch(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if ((req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          await updateProfilePicture(
            req.params.username,
            req.body.filename as string,
          );
          res.sendStatus(200);
        } else {
          if (req.params.username === (req.user as User).username) {
            await updateProfilePicture(
              req.params.username,
              req.body.filename as string,
            );
            res.sendStatus(200);
          } else res.sendStatus(401);
        }
      } else res.sendStatus(401);
    } catch (error: any) {
      res.status(500).send(error);
    }
  })
  /**
   * DELETE
   * chiamata per eliminare la foto profilo e reimpostare quella di default
   */
  .delete(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if ((req.user as User).status !== "ban") {
        if ((req.user as User).plan === "admin") {
          await deleteProfilePicture(req.params.username);
          //fs.unlink ritorna "undefined" se ha successo
          res.sendStatus(200);
        } else {
          if ((req.user as User).username === req.params.username) {
            await deleteProfilePicture(req.params.username);
            res.sendStatus(200);
          }
        }
      } else res.sendStatus(401);
    } catch (error: any) {
      if (error instanceof SquealerError) {
        if (error.code === 11) res.status(500).send(error);
        else res.status(404).send(error);
      }
    }
  });

router
  .route("/user/:username/smm")
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        (((req.user as User).status !== "block" ||
          (req.user as User).status !== "ban") &&
          (req.user as User).plan === "professional") ||
        (req.user as User).plan === "admin"
      ) {
        await addSMM(req.params.username, (req.user as User)._id);
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error) {
      if (error instanceof SquealerError) {
        if (error === non_existent) res.sendStatus(404);
      } else res.status(500).send(error);
    }
  })
  .delete(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        (((req.user as User).status !== "block" ||
          (req.user as User).status !== "ban") &&
          (req.user as User).plan === "professional") ||
        (req.user as User).plan === "admin"
      ) {
        await removeSMM((req.user as User)._id, req.params.username);
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error) {
      res.status(500).send(error);
    }
  });

router
  .route("/user/:username/changeplan")
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        req.user &&
        (req.user as User).status !== "ban" &&
        (req.user as User).status !== "block"
      ) {
        if ((req.user as User).plan === "admin") {
          await changeUserPlan(req.params.username as string, req.body.plan);
          res.sendStatus(200);
        } else {
          await changeUserPlan((req.user as User).username, req.body.plan);
          res.sendStatus(200);
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

router
  .route("/user/:username/addcharacters")
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        await addCharactersToUser(
          req.params.username,
          req.body.dailyCharacters,
          req.body.weeklyCharacters,
          req.body.monthlyCharacters,
        );
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });

router
  .route("/revokePermissions")
  /**
   * POST
   * chiamata per revocare i permessi da admin ad un utente
   */
  .patch(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if ((req.user as User).plan === "admin") {
        await revokePermissions(req.query.username as string);
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error: any) {
      res.status(500).send(error);
    }
  });

router
  .route("/grantPermissions")
  /**
   * POST
   * chiamata per garantire i permessi da admin ad un utente
   */
  .patch(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if ((req.user as User).plan === "admin") {
        await grantPermissions(req.query.username as string);
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error: any) {
      res.status(500).send(error);
    }
  });

router
  .route("/ban")
  /**
   * POST
   * chiamata per bannare un utente
   */
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if ((req.user as User).plan === "admin") {
        await ban(req.query.username as string);
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error: any) {
      res.status(500).send(error);
    }
  });

router
  .route("/unban")
  /**
   * POST
   * chiamata per sbannare un utente
   */
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if ((req.user as User).plan === "admin") {
        await unbanUser(req.query.username as string);
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error: any) {
      res.status(500).send(error);
    }
  });

router
  .route("/block")
  /**
   * POST
   * chiamata per bloccare l'utente per un determinato periodo di tempo
   */
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if ((req.user as User).plan === "admin") {
        await blockUser(
          req.query.username as string,
          req.query.time as unknown as number,
        );
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error: any) {
      res.status(500).send(error);
    }
  });

router
  .route("/unblock")
  .post(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if ((req.user as User).plan === "admin") {
        await unblockUser(req.query.username as string);
        res.sendStatus(200);
      } else res.sendStatus(401);
    } catch (error) {
      res.status(500).send(error);
    }
  });

router
  .route("/notification")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        req.user &&
        ((req.user as User).status != "ban" ||
          (req.user as User).status != "block")
      ) {
        res.send((req.user as User).notification);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });

router.route("/me").get(async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    if (req.user) res.send(req.user);
    else res.sendStatus(404);
  } catch (e) {
    res.status(500).send(e);
  }
});

router
  .route("/managedUsers/:username")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        (req.user as User).status !== "ban" &&
        (req.user as User).status !== "block"
      ) {
        const managedUsers: User[] = await getManagedUsers(req.params.username);
        res.status(200).send(managedUsers);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });

router
  .route("/professionals")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (
        (req.user as User).status !== "ban" &&
        (req.user as User).status !== "block"
      ) {
        const proUsers: User[] = await getProfessionalUsers();
        res.status(200).send(proUsers);
      } else res.sendStatus(401);
    } catch (e) {
      if (e instanceof SquealerError) res.sendStatus(404);
      else res.status(500).send(e);
    }
  });

router
  .route("/name/asc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const users: User[] = await getUsersByNameAsc();
        res.status(200).send(users);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
router
  .route("/name/desc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const users: User[] = await getUsersByNameDesc();
        res.status(200).send(users);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
router
  .route("/type/asc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const users: User[] = await getUsersByTypeAsc();
        res.status(200).send(users);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
router
  .route("/type/desc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const users: User[] = await getUsersByTypeDesc();
        res.status(200).send(users);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
router
  .route("/popularity/asc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const users: User[] = await getUsersByPopularityAsc();
        res.status(200).send(users);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
router
  .route("/popularity/desc")
  .get(async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (req.user && (req.user as User).plan === "admin") {
        const users: User[] = await getUsersByPopularityDesc();
        res.status(200).send(users);
      } else res.sendStatus(401);
    } catch (e) {
      res.status(500).send(e);
    }
  });
