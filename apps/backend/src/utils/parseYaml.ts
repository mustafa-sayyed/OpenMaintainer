import { load } from 'js-yaml';
import { z } from 'zod';
import type { Policy } from '../types/policy.js';

const PolicySchema = z
    .object({
        version: z.literal(1),
        permissions: z
            .object({
                close_issue: z.boolean().optional(),
                search_issues: z.boolean().optional(),
                read_issue_comments: z.boolean().optional(),
                create_issue_comment: z.boolean().optional(),
                read_issue_labels: z.boolean().optional(),
                create_issue_label: z.boolean().optional(),
            })
            .strict()
            .default({}),
    })
    .strict();

export const parsePolicy = (policyContent: string): Policy => {
    try {
        const document = load(policyContent);
        return PolicySchema.parse(document);
    } catch (error) {
        throw new Error('Failed to parse and validate policy content', {
            cause: error,
        });
    }
};
