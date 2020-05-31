export const TG_TOKEN = process.env.TG_TOKEN;
export const GH_TOKEN = process.env.GH_TOKEN;

export const buttons: string[][] = [["mobile"], ["product"], ["test"]];
export const underhood: { [key: string]: { repo: string; owner: string } } = {
    mobile: { owner: "mobileunderhood", repo: "mobileunderhood" },
    product: { owner: "produnderhood", repo: "produnderhood" },
    test: { owner: "anyunderhood", repo: "anyunderhood" },
};

const separator = ";";
const mask = "twitter_author_id" + separator + "first_post_id";

export const text = {
    separator,
    mask,
    start: "underhood?",
    invalid: `valid input: \`${mask}\``,
    selected: "active underhood repo: ",
    notSelected: "select underhood pls",
    ghError: "GitHub error. Check logs",
};

export const ghConfig = {
    branchFolder: `update-bot`,
    branchName: (author: string, first: string) => `${author}-${first.substring(0,6)}`,
    prMessage: "#update",
    prTitle: (author: string) => `Add Author. ${author}`,
    committer: {
        name: "AgapovOne",
        email: "agapov.one@gmail.com",
    },
};
