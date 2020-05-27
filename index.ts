import * as TelegramBot from "node-telegram-bot-api";

import { TG_TOKEN } from "./config";
import GithubService from "./ghService";

const SEPARATOR = "::";
const MASK = "twitter_author_id" + SEPARATOR + "first_post_id";
const DEFAULT_RESP = `/add ${MASK}`;
const INVALID_INPUT = `valid input: ${MASK}`;

const gh = new GithubService();
const bot = new TelegramBot(TG_TOKEN, { polling: true });

bot.onText(/\/cmd/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, DEFAULT_RESP);
});

bot.onText(/\/add (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (match === null || !Boolean(match[1].indexOf(SEPARATOR) + 1)) {
        bot.sendMessage(chatId, INVALID_INPUT);
        return;
    }

    const cmdValues = match[1].split(SEPARATOR);

    if (cmdValues.length !== 2) {
        bot.sendMessage(chatId, INVALID_INPUT);
        return;
    }

    const username = cmdValues[0];
    const first = cmdValues[1];

    const prLink = await gh.addAuthor(`new_author_${Math.floor(Math.random() * 100)}`, {
        username,
        first,
        post: false,
    });

    bot.sendMessage(chatId, `user: ${username} id: ${first}\ncheck PR: ${prLink}`);
});
