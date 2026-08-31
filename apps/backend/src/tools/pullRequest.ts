import { tool } from 'ai';
import { z } from 'zod';
import { getInstallationOctokit } from '../github/client.js';
import { policyEngine } from '../policy/policyEngine.js';
import type { Action, PolicyPayload } from '../types/policy.js';
import type { PullRequestEvent } from '../types/pullRequest.js';

export type DependencyUpdateType = 'major' | 'minor' | 'patch' | 'unsupported';

export const getDependencyUpdateType = (
    title: string,
    body?: string
): DependencyUpdateType => {
    const text = `${title}\n${body ?? ''}`;
    const versionMatch = text.match(
        /\bfrom\s+v?(\d+)\.(\d+)\.(\d+)\s+to\s+v?(\d+)\.(\d+)\.(\d+)\b/i
    );

    if (!versionMatch) {
        return 'unsupported';
    }

    const [fromMajor, fromMinor, fromPatch, toMajor, toMinor, toPatch] =
        versionMatch.slice(1).map(Number);

    if (
        toMajor < fromMajor ||
        (toMajor === fromMajor && toMinor < fromMinor) ||
        (toMajor === fromMajor &&
            toMinor === fromMinor &&
            toPatch <= fromPatch)
    ) {
        return 'unsupported';
    }

    if (toMajor > fromMajor) {
        return 'major';
    }

    if (toMinor > fromMinor) {
        return 'minor';
    }

    return 'patch';
};

export const createPullRequestTools = async (
    pullRequest: PullRequestEvent
) => {
    const github = await getInstallationOctokit(pullRequest.installationId);
    const policyPayload: PolicyPayload = {
        repo: pullRequest.repo,
        owner: pullRequest.owner,
        installationId: pullRequest.installationId,
    };

    const verifyPolicy = async (action: Action) => {
        const allowed = await policyEngine.canExecute(policyPayload, action);

        if (allowed) {
            return null;
        }

        return {
            error: 'Action denied by repository policy.',
            code: 'POLICY_DENIED',
            action,
        };
    };

    return {
        getPullRequest: tool({
            description: 'Read the current GitHub pull request.',
            inputSchema: z.object({}),
            execute: async () => {
                try {
                    const policyResult = await verifyPolicy('read_pull_request');
                    if (policyResult) {
                        return policyResult;
                    }

                    const result = await github.rest.pulls.get({
                        repo: pullRequest.repo,
                        owner: pullRequest.owner,
                        pull_number: pullRequest.pullRequestNumber,
                    });

                    return {
                        number: result.data.number,
                        title: result.data.title,
                        body: result.data.body ?? '',
                        state: result.data.state,
                        draft: result.data.draft ?? false,
                        author: result.data.user?.login ?? 'unknown',
                        baseBranch: result.data.base.ref,
                        headBranch: result.data.head.ref,
                        mergeable: result.data.mergeable,
                        mergeableState: result.data.mergeable_state,
                        updateType: getDependencyUpdateType(
                            result.data.title,
                            result.data.body ?? undefined
                        ),
                    };
                } catch (error) {
                    console.error(
                        'Error while executing getPullRequestTool',
                        error
                    );
                    return {
                        error: 'Error while executing getPullRequestTool',
                        details: error,
                    };
                }
            },
        }),

        mergePullRequest: tool({
            description:
                'Merge a Dependabot pull request when it is a clean minor or patch update.',
            inputSchema: z.object({}),
            execute: async () => {
                try {
                    const policyResult = await verifyPolicy('merge_pull_request');
                    if (policyResult) {
                        return policyResult;
                    }

                    const result = await github.rest.pulls.get({
                        repo: pullRequest.repo,
                        owner: pullRequest.owner,
                        pull_number: pullRequest.pullRequestNumber,
                    });
                    const currentPullRequest = result.data;

                    if (currentPullRequest.user?.login !== 'dependabot[bot]') {
                        return {
                            error: 'Only Dependabot pull requests can be merged.',
                            code: 'UNSAFE_PULL_REQUEST',
                        };
                    }

                    if (currentPullRequest.state !== 'open') {
                        return {
                            error: 'Pull request is not open.',
                            code: 'PULL_REQUEST_NOT_OPEN',
                        };
                    }

                    if (currentPullRequest.draft) {
                        return {
                            error: 'Draft pull requests cannot be merged.',
                            code: 'PULL_REQUEST_IS_DRAFT',
                        };
                    }

                    const updateType = getDependencyUpdateType(
                        currentPullRequest.title,
                        currentPullRequest.body ?? undefined
                    );

                    if (updateType !== 'minor' && updateType !== 'patch') {
                        return {
                            error:
                                'Only minor and patch Dependabot updates can be merged.',
                            code: 'UNSUPPORTED_UPDATE_TYPE',
                            updateType,
                        };
                    }

                    if (currentPullRequest.mergeable_state !== 'clean') {
                        return {
                            error:
                                'Pull request is not ready to merge cleanly.',
                            code: 'PULL_REQUEST_NOT_READY',
                            mergeableState: currentPullRequest.mergeable_state,
                        };
                    }

                    const mergeResult = await github.rest.pulls.merge({
                        repo: pullRequest.repo,
                        owner: pullRequest.owner,
                        pull_number: pullRequest.pullRequestNumber,
                        merge_method: 'squash',
                    });

                    if (mergeResult.status === 200 && mergeResult.data.merged) {
                        return {
                            message: 'Pull request merged successfully.',
                            updateType,
                            sha: mergeResult.data.sha,
                        };
                    }

                    return {
                        error: 'Pull request was not merged.',
                        details: mergeResult.data,
                    };
                } catch (error) {
                    console.error(
                        'Error while executing mergePullRequestTool',
                        error
                    );
                    return {
                        error: 'Error while executing mergePullRequestTool',
                        details: error,
                    };
                }
            },
        }),
    };
};
