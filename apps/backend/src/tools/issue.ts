import { tool } from 'ai';
import { z } from 'zod';
import { getInstallationOctokit } from '../github/client.js';
import type { IssueContext } from '../types/issue.js';
import { policyEngine } from '../policy/policyEngine.js';
import type { PolicyPayload, Tool } from '../types/policy.js';

export const createIssueTools = async (issue: IssueContext) => {
  const github = await getInstallationOctokit(issue.installationId);

  const policyPayload: PolicyPayload = {
    repo: issue.repo,
    owner: issue.owner,
    installationId: issue.installationId,
  };

  const verifyPolicy = async (tool: Tool) => {
    const allowed = await policyEngine.canUseTool(policyPayload, tool);

    if (allowed) {
      return null;
    }

    return {
      error: 'Action denied by repository policy.',
      code: 'POLICY_DENIED',
      action: tool,
    };
  };

  return {
    createComment: tool({
      description: 'Post a comment on a GitHub issue.',
      inputSchema: z.object({
        comment: z.string().describe('The comment to post on issue.'),
      }),
      execute: async ({ comment }) => {
        try {
          const policyResult = await verifyPolicy('createIssueComment');
          if (policyResult && policyResult.code === 'POLICY_DENIED') {
            return policyResult;
          }

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
          console.log('Error while executing createIssueCommentTool', error);
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
        const policyResult = await verifyPolicy('readIssueComments');
        if (policyResult && policyResult.code === 'POLICY_DENIED') {
          return policyResult;
        }

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
          const policyResult = await verifyPolicy('createIssueLabel');
          if (policyResult && policyResult.code === 'POLICY_DENIED') {
            return policyResult;
          }

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
          console.error('Error while executing createLabelTool', error);
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
          const policyResult = await verifyPolicy('readIssueLabels');
          if (policyResult && policyResult.code === 'POLICY_DENIED') {
            return policyResult;
          }

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
          console.error('Error while executing readLabelsTool', error);
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
        reason: z.string().describe('The reason for closing the issue.'),
      }),
      execute: async ({ stateReason, reason }) => {
        try {
          const policyResult = await verifyPolicy('closeIssue');
          if (policyResult && policyResult.code === 'POLICY_DENIED') {
            return policyResult;
          }

          const actionAllowed = await policyEngine.canExecuteAction(
            policyPayload,
            'closeIssue',
            {
              issue: {
                labels: issue.labels ?? [],
              },
            }
          );

          if (!actionAllowed) {
            return {
              error: 'Action denied by repository policy.',
              code: 'POLICY_DENIED',
              action: 'closeIssue',
            };
          }

          const result = await github.rest.issues.update({
            repo: issue.repo,
            owner: issue.owner,
            issue_number: issue.issueNumber,
            state: 'closed',
            state_reason: stateReason,
          });
          if (result.status === 200) {
            console.log('Issue closed successfully.', reason, stateReason);
            return 'Issue closed successfully.';
          }
          return 'Failed to close issue';
        } catch (error) {
          console.error('Error while executing closeIssueTool', error);
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
          const policyResult = await verifyPolicy('searchIssues');
          if (policyResult && policyResult.code === 'POLICY_DENIED') {
            return policyResult;
          }

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
                  typeof label === 'string' ? label : (label.name ?? '')
                ),
              })),
            };
          }
          return {
            error: 'Failed to search issues',
          };
        } catch (error) {
          console.error('Error while executing searchIssuesTool', error);
          return {
            error: 'Error while executing searchIssuesTool',
            details: error,
          };
        }
      },
    }),
  };
};
