export const TG_TOKEN = process.env.TG_TOKEN;
export const GH_TOKEN = process.env.GH_TOKEN;
export const PWD = process.env.BOT_PWD;

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
    start: "Select underhood!",
    invalid: `Valid input: \`${mask}\``,
    invalidPwd: 'incorrect password',
    selected: "Active underhood repo: ",
    notSelected: "Select underhood pls",
    ghError: "GitHub error. Check logs",
};

export const ghConfig = {
    branchFolder: `anybot`,
    branchName: (author: string) => `${author}-${Math.floor(Math.random() * 1000000)}`,
    commitMessage: "Update authors.js",
    prMessage: "#update",
    prTitle: (author: string) => `Add Author. ${author}`,
    prCreationResponse: (username: string, first: string, prLink: string) => `user: ${username} id: ${first}\ncheck PR: ${prLink}`,
    committer: {
        name: "anybot",
        email: "anybot@anyunderhood",
    },
};
