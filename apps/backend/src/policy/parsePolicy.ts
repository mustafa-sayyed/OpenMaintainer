import { load } from 'js-yaml';
import type { Policy } from '../types/policy.js';
import { PolicySchema } from './policySchema.js';

export const parsePolicy = (policyContent: string): Policy => {
  try {
    const document = load(policyContent);

    if (!document || typeof document !== 'object' || Array.isArray(document)) {
      throw new Error('Policy document must be a YAML object');
    }

    return PolicySchema.parse(document);
  } catch (error) {
    throw new Error('Failed to parse and validate policy content', {
      cause: error,
    });
  }
};
