import * as TelegramBot from "node-telegram-bot-api";

import { TG_TOKEN, buttons, text, underhood, ghConfig } from "./config";
import GithubService, { IUnderhood } from "./ghService";

const bot = new TelegramBot(TG_TOKEN, { polling: true });

let activeUnderhood: IUnderhood | null = null;

bot.onText(/\/start/, (msg: any) => {
    bot.sendMessage(msg.chat.id, text.start, {
        reply_markup: { keyboard: buttons },
    });
});

bot.onText(/\/add (.+)/, async (msg: any, match: any) => {
    const chatId = msg.chat.id;

    if (activeUnderhood === null) {
        bot.sendMessage(chatId, text.notSelected);
        return;
    }

    if (match === null || !Boolean(match[1].indexOf(text.separator) + 1)) {
        bot.sendMessage(chatId, text.invalid);
        return;
    }

    const cmdValues = match[1].split(text.separator);

    if (cmdValues.length !== 2) {
        bot.sendMessage(chatId, text.invalid);
        return;
    }

    const username = cmdValues[0];
    const first = cmdValues[1];
    const gh = new GithubService(activeUnderhood);
    const branchName = `${ghConfig.branchFolder}/${ghConfig.branchName(username)}`;

    const prLink = await gh.addAuthor(branchName, {
        username,
        first
    });

    const resp =
        prLink === null
            ? text.ghError
            : `user: ${username} id: ${first}\ncheck PR: ${prLink}`;

    bot.sendMessage(chatId, resp);
});

bot.onText(/\/active/, (msg: any) => {
    const resp = activeUnderhood
        ? text.selected + JSON.stringify(activeUnderhood)
        : text.notSelected;
    bot.sendMessage(msg.chat.id, resp);
});

bot.on("message", (msg: any) => {
    buttons.forEach((btn) => {
        if (msg.text.toString().toLowerCase().indexOf(btn[0].toLocaleLowerCase()) === 0) {
            activeUnderhood = underhood[btn[0]];
            bot.sendMessage(msg.chat.id, text.selected + JSON.stringify(activeUnderhood));
        }
    });
});
