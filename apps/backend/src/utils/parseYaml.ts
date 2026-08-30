import { load } from 'js-yaml';
import { z } from 'zod';
import type { Policy } from '../types/policy.js';

const PolicySchema = z
    .object({
        version: z.literal(1),
        permissions: z
            .object({
                create_issue_comment: z.boolean().optional(),
                close_issue: z.boolean().optional(),
                read_labels: z.boolean().optional(),
                read_comments: z.boolean().optional(),
                search_issues: z.boolean().optional(),
                create_label: z.boolean().optional(),
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
