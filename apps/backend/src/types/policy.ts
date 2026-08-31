export type Action = 'closeIssue' | 'mergePullRequest';

export type Tool =
    | 'closeIssue'
    | 'searchIssues'
    | 'readIssueComments'
    | 'createIssueComment'
    | 'readIssueLabels'
    | 'createIssueLabel'
    | 'readPullRequest'
    | 'mergePullRequest';

export type UpdateType = 'major' | 'minor' | 'patch';
export type Decision = 'allow' | 'deny' | 'ask';

export type ToolSchema = Record<Tool, boolean>;

export interface PolicyEvaluationContext {
    issue?: {
        labels: string[];
    };
    pullRequest?: {
        author: string;
        updateType: UpdateType;
    };
}

export interface PolicyPayload {
    repo: string;
    owner: string;
    installationId: number;
}

export interface Policy {
    version: 1;
    permissions: {
        tools: ToolSchema;
        actions: {
            closeIssue: {
                decision: Decision;
                condition?: {
                    issues: {
                        labels: {
                            any: string[];
                        };
                    };
                };
            };
            mergePullRequest: {
                decision: Decision;
                condition?: {
                    pullRequest: {
                        author: string;
                        updateType: {
                            in: UpdateType[];
                        };
                    };
                };
            };
        };
    };
}
