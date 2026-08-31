import { z } from 'zod';

const ToolPermissionsSchema = z
  .object({
    closeIssue: z.boolean(),
    searchIssues: z.boolean(),
    createIssueComment: z.boolean(),
    readIssueComments: z.boolean(),
    readIssueLabels: z.boolean(),
    createIssueLabel: z.boolean(),
    readPullRequest: z.boolean(),
    mergePullRequest: z.boolean(),
  })
  .strict();

const CloseIssueConditionSchema = z
  .object({
    issues: z
      .object({
        labels: z
          .object({
            any: z.array(z.string()).min(1),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

const MergePullRequestConditionSchema = z
  .object({
    pullRequest: z
      .object({
        author: z.string(),
        updateType: z
          .object({
            in: z.array(z.enum(['major', 'minor', 'patch'])).min(1),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

export const PolicySchema = z
  .object({
    version: z.literal(1),
    permissions: z
      .object({
        tools: ToolPermissionsSchema,
        actions: z
          .object({
            closeIssue: z
              .object({
                decision: z.enum(['allow', 'deny', 'ask']),
                condition: CloseIssueConditionSchema.optional(),
              })
              .strict(),
            mergePullRequest: z
              .object({
                decision: z.enum(['allow', 'deny', 'ask']),
                condition: MergePullRequestConditionSchema.optional(),
              })
              .strict(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

export type PolicySchemaType = z.infer<typeof PolicySchema>;
