import 'dotenv/config';
import { App } from 'octokit';

export const githubApp = new App({
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
    appId: process.env.GITHUB_APP_ID!,
});

export const getInstallationOctokit = async (installationId: number) => {
    return await githubApp.getInstallationOctokit(installationId);
};

export const getIssue = async ({
    installationId,
    repo,
    owner,
    issueNumber,
}: {
    installationId: number;
    repo: string;
    owner: string;
    issueNumber: number;
}) => {
    const octokit = await getInstallationOctokit(installationId);
    const issue = await octokit.rest.issues.get({
        owner,
        repo,
        issue_number: issueNumber,
    });

    return issue.data;
};

export const createIssueComment = async ({
    installationId,
    repo,
    owner,
    issueNumber,
    body,
}: {
    installationId: number;
    repo: string;
    owner: string;
    issueNumber: number;
    body: string;
}) => {
    const octokit = await getInstallationOctokit(installationId);

    const response = await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body,
    });

    return response.data;
};
