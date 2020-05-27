export const TG_TOKEN = process.env.TG_TOKEN;
export const GH_TOKEN = process.env.GH_TOKEN;

export const buttons: string[][] = [["mobile"], ["product"], ["js"]];
export const underhood: { [key: string]: { repo: string; owner: string } } = {
    mobile: { owner: "anyunderhood", repo: "anyunderhood" },
    product: { owner: "anyunderhood", repo: "anyunderhood" },
    js: { owner: "anyunderhood", repo: "anyunderhood" },
};

const SEPARATOR = ";";
const MASK = "twitter_author_id" + SEPARATOR + "first_post_id";

export const text = {
    separator: SEPARATOR,
    mask: MASK,
    start: "underhood?",
    invalid: `valid input: \`${MASK}\``,
    selected: "active underhood repo: ",
    notSelected: "select underhood pls",
    ghError: "GitHub error. Check logs",
};
