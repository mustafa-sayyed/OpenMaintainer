import 'dotenv/config';
import { App } from 'octokit';
import { POLICY_FILE_PATH } from '../utils/constant.js';
import type { Policy, PolicyPayload } from '../types/policy.js';
import { parsePolicy } from '../policy/parsePolicy.js';

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

export const getRepoPolicy = async ({
    repo,
    owner,
    installationId,
}: PolicyPayload): Promise<Policy> => {
    const octokit = await getInstallationOctokit(installationId);

    try {
        const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: POLICY_FILE_PATH,
        });

        if (
            !data ||
            !('content' in data) ||
            typeof data.content !== 'string'
        ) {
            throw new Error(
                `Policy path is not a file: ${owner}/${repo}/${POLICY_FILE_PATH}`
            );
        }

        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return parsePolicy(content);
    } catch (error) {
        if (
            error &&
            typeof error === 'object' &&
            'status' in error &&
            error.status === 404
        ) {
            throw new Error(
                `Policy file not found in the repository: ${owner}/${repo}`,
                { cause: error }
            );
        }

        throw error;
    }
};
