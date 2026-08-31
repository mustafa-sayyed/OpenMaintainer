import { getRepoPolicy } from "../github/client.js";
import type {
    Action,
    Policy,
    PolicyEvaluationContext,
    PolicyPayload,
    Tool,
} from "../types/policy.js";

class PolicyEngine {

    async getPolicy(policyPayload: PolicyPayload): Promise<Policy> {
        return await getRepoPolicy(policyPayload);
    }

    async canUseTool(
        policyPayload: PolicyPayload,
        tool: Tool
    ): Promise<boolean> {
        try {
            const policy = await this.getPolicy(policyPayload);
            return policy.permissions.tools[tool] === true;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            console.error('Policy unavailable; denying action', {
                tool,
                repository: `${policyPayload.owner}/${policyPayload.repo}`,
                error: message,
            });

            return false;
        }
    }

    async canExecuteAction(
        policyPayload: PolicyPayload,
        action: Action,
        context?: PolicyEvaluationContext
    ): Promise<boolean> {
        try {
            const policy = await this.getPolicy(policyPayload);

            switch (action) {
                case 'closeIssue': {
                    const actionPolicy = policy.permissions.actions.closeIssue;

                    if (
                        policy.permissions.tools.closeIssue !== true ||
                        actionPolicy.decision !== 'allow'
                    ) {
                        return false;
                    }

                    const labels = actionPolicy.condition?.issues?.labels?.any;
                    const issueLabels = context?.issue?.labels;

                    if (
                        !labels ||
                        labels.length === 0 ||
                        !issueLabels ||
                        issueLabels.length === 0
                    ) {
                        return false;
                    }

                    return labels.some((label) => issueLabels.includes(label));
                }

                case 'mergePullRequest': {
                    const actionPolicy =
                        policy.permissions.actions.mergePullRequest;

                    if (
                        policy.permissions.tools.mergePullRequest !== true ||
                        actionPolicy.decision !== 'allow'
                    ) {
                        return false;
                    }

                    const pullRequestCondition =
                        actionPolicy.condition?.pullRequest;
                    const pullRequestContext = context?.pullRequest;

                    if (
                        !pullRequestCondition ||
                        !pullRequestCondition.updateType?.in ||
                        pullRequestCondition.updateType.in.length === 0 ||
                        !pullRequestContext
                    ) {
                        return false;
                    }

                    return (
                        pullRequestContext.author ===
                            pullRequestCondition.author &&
                        pullRequestCondition.updateType.in.includes(
                            pullRequestContext.updateType
                        )
                    );
                }

                default:
                    return false;
            }
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
