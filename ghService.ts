import { Octokit } from "@octokit/rest";

import { GH_TOKEN, ghConfig } from "./config";

interface IAuthor {
    username: string;
    first: string;
}

export interface IUnderhood {
    repo: string;
    owner: string;
}

export default class GithubService {
    constructor(underhood: null | IUnderhood) {
        if (underhood === null) {
            throw new Error("underhood not defined");
        } else {
            this.owner = underhood.owner;
            this.repo = underhood.repo;
        }
    }

    public async addAuthor(branchName: string, author: IAuthor): Promise<string | null> {
        try {
            const masterBranch = await this.client.repos.getBranch({
                owner: this.owner,
                repo: this.repo,
                branch: "master",
            });

            await this.createBranch(branchName, masterBranch.data.commit.sha);
            await this.updateFile(branchName, author);
            const prResponse = await this.createPr(branchName, ghConfig.prTitle(author.username));

            return prResponse.data.html_url;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    private async createBranch(branchName: string, sha: string) {
        const ref = `refs/heads/${branchName}`;
        return await this.client.git.createRef({
            owner: this.owner,
            repo: this.repo,
            ref,
            sha,
        });
    }

    private async updateFile(branchName: string, author: IAuthor) {
        const path = "authors.js";
        const newAuthor = `  { username: '${author.username}', first: '${author.first}' },`;

        const initFile = await this.client.repos.getContents({
            owner: this.owner,
            repo: this.repo,
            path,
            ref: branchName,
        });

        const newRowIndex = 8; // always works?
        const rows = Buffer.from(initFile.data.content, "base64")
            .toString("ascii")
            .split("\n");
        const updRows = [
            ...rows.slice(0, newRowIndex),
            newAuthor,
            ...rows.slice(newRowIndex),
        ].join("\n");

        return await this.client.repos.createOrUpdateFile({
            owner: this.owner,
            repo: this.repo,
            path,
            message: ghConfig.commitMessage,
            content: Buffer.from(updRows).toString("base64"),
            branch: branchName,
            sha: initFile.data.sha,
            committer: ghConfig.committer,
        });
    }

    private async createPr(head: string, title: string, base = "master") {
        return await this.client.pulls.create({
            owner: this.owner,
            repo: this.repo,
            title,
            body: ghConfig.prMessage,
            head,
            base,
        });
    }

    private readonly client = new Octokit({ auth: GH_TOKEN });
    private readonly owner: string = "";
    private readonly repo: string = "";
}
