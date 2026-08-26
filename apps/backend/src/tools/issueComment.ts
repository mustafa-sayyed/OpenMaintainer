import { tool } from 'ai';
import { z } from 'zod';
import { getInstallationOctokit } from '../github/client.js';
import type { IssueContext } from '../types/issue.js';

export const createIssueCommentTool = (issue: IssueContext) => {
    return tool({
        description: 'Comment on the issue',
        inputSchema: z.object({
            comment: z.string().describe('The comment to post on issue.'),
        }),
        execute: async ({comment}) => {
            try {
                const github = await getInstallationOctokit(
                    issue.installationId
                );
                const result = await github.rest.issues.createComment({
                    repo: issue.repo,
                    owner: issue.owner,
                    issue_number: issue.issueNumber,
                    body: comment,
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
};
