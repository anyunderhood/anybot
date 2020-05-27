import { Octokit } from "@octokit/rest";

import { TG_TOKEN, GH_TOKEN } from "./config";

const repo = "anyunderhood";
const owner = "anyunderhood";

interface IAuthor {
    username: string;
    first: string;
    post: boolean;
}

export default class GithubService {
    constructor() {}

    public async addAuthor(branchName: string, author: IAuthor): Promise<string> {
        try {
            const masterBranch = await this.client.repos.getBranch({
                owner,
                repo,
                branch: "master",
            });

            await this.createBranch(branchName, masterBranch.data.commit.sha);
            await this.updateFile(branchName, author);
            const prResponse = await this.createPr(branchName);

            return prResponse.data.html_url;
        } catch (error) {
            console.log(error);
            return "-";
        }
    }

    private async createBranch(branchName: string, sha: string) {
        const ref = `refs/heads/${branchName}`;
        return await this.client.git.createRef({ owner, repo, ref, sha });
    }

    private async updateFile(branchName: string, author: IAuthor) {
        const path = "authors.js";
        const message = "new author";
        let content = `
import authorId from './helpers/author-id';
export default authorId([
{
    username: '${author.username}',
    first: '${author.first}',
    post: ${author.post}
},
]);
        `;

        content = Buffer.from(content).toString("base64");

        const fileSha = await this.client.repos.getContents({
            owner,
            repo,
            path,
            ref: branchName,
        });

        return await this.client.repos.createOrUpdateFile({
            owner,
            repo,
            path,
            message,
            content,
            branch: branchName,
            sha: fileSha.data.sha,
            committer: {
                name: "tgkd",
                email: "pavtrof342@gmail.com",
            },
        });
    }

    private async createPr(head: string, title = "new author", base = "master") {
        return await this.client.pulls.create({
            owner,
            repo,
            title,
            head,
            base,
        });
    }

    private readonly client = new Octokit({ auth: GH_TOKEN });
}
