import { getRepoPolicy } from "../github/client.js";
import type { Action, Policy, PolicyPayload } from "../types/policy.js";

class PolicyEngine {

    async getPolicy(policyPayload: PolicyPayload): Promise<Policy> {
        return await getRepoPolicy(policyPayload);
    }

    async canExecute(
        policyPayload: PolicyPayload,
        action: Action
    ): Promise<boolean> {
        try {
            const policy = await this.getPolicy(policyPayload);
            return policy?.permissions?.[action] === true;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            console.error('Policy unavailable; denying action', {
                action,
                repository: `${policyPayload.owner}/${policyPayload.repo}`,
                error: message,
            });

            return false;
        }
    }
}

export const policyEngine = new PolicyEngine();
