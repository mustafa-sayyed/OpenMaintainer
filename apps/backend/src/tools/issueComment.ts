import { tool } from 'ai';
import { z } from 'zod';
import { getInstallationOctokit } from '../github/client.js';

export const issueCommentTool = tool({
    description: 'Comment on the issue',
    inputSchema: z.object({
        comment: z.string().describe('The comment you want to post on issue.'),
        installationId: z.number(),
        repo: z.string().describe('The repo in which issue exist.'),
        owner: z.string().describe('The owner of the repo'),
        issueNumber: z.number().describe('Issue number'),
    }),
    execute: async (issue) => {
        try {
            const github = await getInstallationOctokit(issue.installationId);
            const result = await github.rest.issues.createComment({
                repo: issue.repo,
                owner: issue.owner,
                issue_number: issue.issueNumber,
                body: issue.comment,
            });

            return result.data;
        } catch (error) {
            console.log('Error while executing issueCommentTool', error);
            return {
                error: 'Error while executing issueCommentTool',
                details: error,
            };
        }
    },
});
