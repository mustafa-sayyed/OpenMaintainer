import { tool } from 'ai';
import { z } from 'zod';
import { getInstallationOctokit } from '../github/client.js';
import type { IssueContext } from '../types/issue.js';

export const createIssueTools = async (issue: IssueContext) => {
    const github = await getInstallationOctokit(issue.installationId);

    return {
        createComment: tool({
            description: 'Post a comment on a GitHub issue.',
            inputSchema: z.object({
                comment: z.string().describe('The comment to post on issue.'),
            }),
            execute: async ({ comment }) => {
                try {
                    const result = await github.rest.issues.createComment({
                        repo: issue.repo,
                        owner: issue.owner,
                        issue_number: issue.issueNumber,
                        body: comment,
                    });

                    if (result.status == 201) {
                        return 'Comment posted successfully.';
                    }

                    return {
                        error: 'Failed to post comment',
                        details: result.data,
                    };
                } catch (error) {
                    console.log(
                        'Error while executing createIssueCommentTool',
                        error
                    );
                    return {
                        error: 'Error while executing createIssueCommentTool',
                        details: error,
                    };
                }
            },
        }),

        getComments: tool({
            description: 'Read the comments of the current github issue.',
            inputSchema: z.object({}),
            execute: async () => {
                const result = await github.rest.issues.listComments({
                    repo: issue.repo,
                    owner: issue.owner,
                    issue_number: issue.issueNumber,
                });

                return {
                    comments: result.data.map((cmts) => {
                        return {
                            name: cmts.user?.login ?? 'unknown',
                            comment: cmts.body ?? '',
                            createdAt: cmts.created_at,
                        };
                    }),
                };
            },
        }),

        createLabel: tool({
            description: 'Create a label on the current github issue.',
            inputSchema: z.object({
                label: z.string().describe('The label to create on the issue.'),
            }),
            execute: async ({ label }) => {
                try {
                    const result = await github.rest.issues.addLabels({
                        repo: issue.repo,
                        owner: issue.owner,
                        issue_number: issue.issueNumber,
                        labels: [label],
                    });
                    if (result.status === 200) {
                        return 'Label created successfully.';
                    }
                    return 'Failed to create label';
                } catch (error) {
                    console.error(
                        'Error while executing createLabelTool',
                        error
                    );
                    return {
                        error: 'Error while executing createLabelTool',
                        details: error,
                    };
                }
            },
        }),

        readLabels: tool({
            description: 'Read the labels of the current github issue.',
            inputSchema: z.object({}),
            execute: async () => {
                try {
                    const result = await github.rest.issues.listLabelsOnIssue({
                        repo: issue.repo,
                        owner: issue.owner,
                        issue_number: issue.issueNumber,
                    });
                    if (result.status === 200) {
                        return {
                            labels: result.data.map((label) => label.name),
                        };
                    }
                    return 'Failed to read labels';
                } catch (error) {
                    console.error(
                        'Error while executing readLabelsTool',
                        error
                    );
                    return {
                        error: 'Error while executing readLabelsTool',
                        details: error,
                    };
                }
            },
        }),

        closeIssue: tool({
            description: 'Close the current github issue.',
            inputSchema: z.object({
                stateReason: z
                    .enum(['not_planned', 'completed', 'duplicate', 'reopened'])
                    .describe('The action type for closing the issue.'),
                reason: z
                    .string()
                    .describe('The reason for closing the issue.'),
            }),
            execute: async ({ stateReason, reason }) => {
                try {
                    const result = await github.rest.issues.update({
                        repo: issue.repo,
                        owner: issue.owner,
                        issue_number: issue.issueNumber,
                        state: 'closed',
                        state_reason: stateReason,
                    });
                    if (result.status === 200) {
                        console.log(
                            'Issue closed successfully.',
                            reason,
                            stateReason
                        );
                        return 'Issue closed successfully.';
                    }
                    return 'Failed to close issue';
                } catch (error) {
                    console.error(
                        'Error while executing closeIssueTool',
                        error
                    );
                    return {
                        error: 'Error while executing closeIssueTool',
                        details: error,
                    };
                }
            },
        }),

        searchIssues: tool({
            description: 'Search for issues in the current repository.',
            inputSchema: z.object({
                query: z.string().describe('The GraphQL search query for issues.'),
            }),
            execute: async ({ query }) => {
                try {
                    const result = await github.rest.issues.listForRepo({
                        repo: issue.repo,
                        owner: issue.owner,
                        state: 'open',
                        query: query,
                    });
                    if (result.status === 200) {
                        return {
                            issues: result.data.map((issue) => ({
                                number: issue.number,
                                title: issue.title,
                                body: issue.body,
                                labels: issue.labels.map((label) =>
                                    typeof label === 'string'
                                        ? label
                                        : label.name ?? ''
                                ),
                            }))
                        };
                    }
                    return {
                        error: 'Failed to search issues',
                    };
                } catch (error) {
                    console.error(
                        'Error while executing searchIssuesTool',
                        error
                    );
                    return {
                        error: 'Error while executing searchIssuesTool',
                        details: error,
                    };
                }
            },
        }),
    };
};
