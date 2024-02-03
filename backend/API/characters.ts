import userModel from "../database/models/users.model";
import { getAllUsers, getUser } from "../database/queries/users";
import {
    defaultCharactersBase,
    defaultCharactersJournalist,
    defaultCharactersProfessional,
} from "../util/constants";
import { SquealerError, cannot_update, non_existent } from "../util/errors";
import { updated } from "../util/success";
import { Success, User } from "../util/types";
import schedule from "node-schedule";

/**
 * funzione che ritorna i caratteri di un utente
 * @param id id utente
 * @returns characters
 */
export async function getUserCharacter(id: string) {
    const user: User = await getUser(id);
    const characters: [number, number, number] = [
        (user as User).dailyCharacters,
        (user as User).weeklyCharacters,
        (user as User).monthlyCharacters,
    ];
    return characters;
}

/**
 * funzione che aggiorna i caratteri giornalieri
 * @param id id utente
 * @param usedCharacters caratteri utilizzati in uno squeal
 * @returns SquealerError | Success
 */
export async function updateDailyCharacters(
    id: string,
    usedCharacters: number,
) {
    const update = await userModel.updateOne(
        { _id: id },
        {
            $inc: {
                dailyCharacters: -usedCharacters,
            },
        },
    );
    if (update.modifiedCount < 1) return cannot_update;
    else return updated;
}

export async function resetCharactersScheduler() {
    try {
        const users: User[] = await getAllUsers();
        // Reset giornaliero ogni giorno alle 00:00
        schedule.scheduleJob("0 0 * * *", async () => {
            console.log("aggiornamento giornaliero " + new Date());
            for (let i of users) {
                const daily: SquealerError | Success | undefined =
                    await resetCharactersDaily(i._id);
                if (daily instanceof SquealerError) console.log(daily);
            }
        });
        //Reset settimanale ogni lunedì alle 00.00
        schedule.scheduleJob("0 0 * * 1", async () => {
            console.log("aggiornamento settimanale " + new Date());
            for (let i of users) {
                const daily: SquealerError | Success | undefined =
                    await resetCharactersWeekly(i._id);
                if (daily instanceof SquealerError) console.log(daily);
            }
        });
        //Reset mensile ogni primo giorno del mese alle 00.00
        schedule.scheduleJob("0 0 1 * *", async () => {
            console.log("aggiornamento mensile " + new Date());
            for (let i of users) {
                const daily: SquealerError | Success | undefined =
                    await resetCharactersMonthly(i._id);
                if (daily instanceof SquealerError) console.log(daily);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

/**
 * funzione che resetta i caratteri giornalieri
 * @param id id utente
 * @returns Success | SquealerError
 */
export async function resetCharactersDaily(id: string) {
    const user: User | SquealerError = await getUser(id);
    const defaultCharacters: number[] | undefined = await getDefaultCharacters(
        (user as User).plan,
    );
    if (defaultCharacters) {
        let du = defaultCharacters[0] - user.dailyCharacters;
        if (du <= user.weeklyCharacters) {
            const update = await userModel.updateOne(
                { _id: id },
                {
                    dailyCharacters: user.dailyCharacters + du,
                    weeklyCharacters: user.weeklyCharacters - du,
                },
            );
            if (update.modifiedCount < 1) return cannot_update;
            else return updated;
        } else {
            const update = await userModel.updateOne(
                { _id: id },
                {
                    dailyCharacters: user.weeklyCharacters + user.dailyCharacters,
                    weeklyCharacters: 0,
                },
            );
            if (update.modifiedCount < 1) return cannot_update;
            else return updated;
        }
    }
}

/**
 * funzione che aggiorna i caratteri settimanali di un utente
 * @param id id utente
 * @returns SquealerError | Success
 */
export async function resetCharactersWeekly(id: string) {
    const user: User | SquealerError = await getUser(id);
    const defaultCharacters: number[] | undefined = await getDefaultCharacters(
        (user as User).plan,
    );
    if (defaultCharacters) {
        let wu = defaultCharacters[1] - user.weeklyCharacters;
        if (wu <= user.monthlyCharacters) {
            const update = await userModel.updateOne(
                { _id: id },
                {
                    weeklyCharacters: user.weeklyCharacters + wu,
                    monthlyCharacters: user.monthlyCharacters - wu,
                },
            );
            if (update.modifiedCount < 1) return cannot_update;
            else return updated;
        } else {
            const update = await userModel.updateOne(
                { _id: id },
                {
                    weeklyCharacters: user.monthlyCharacters + user.weeklyCharacters,
                    monthlyCharacters: 0,
                },
            );
            if (update.modifiedCount < 1) return cannot_update;
            else return updated;
        }
    }
}

/**
 * funzione che aggiora i caratteri mensili di un utente
 * @param id id utente
 * @returns SquealerError | Success
 */
export async function resetCharactersMonthly(id: string) {
    const user: User | SquealerError = await getUser(id);
    const defaultCharacters: number[] | undefined = await getDefaultCharacters(
        (user as User).plan,
    );
    if (defaultCharacters !== undefined) {
        const update = await userModel.updateOne(
            { _id: id },
            {
                dailyCharacters: defaultCharacters[0],
                weeklyCharacters: defaultCharacters[1],
                monthlyCharacters: defaultCharacters[2],
            },
        );
        if (update.modifiedCount < 1) return cannot_update;
        else return updated;
    }
}

export async function getDefaultCharacters(plan: string) {
    switch (plan) {
        case "base":
            return defaultCharactersBase;
        case "professional":
            return defaultCharactersProfessional;
        case "journalist":
            return defaultCharactersJournalist;
        default:
            break;
    }
}
