export type PullRequestEvent = {
    installationId: number;
    pullRequestNumber: number;
    repo: string;
    owner: string;
    repoFullName: string;
    eventType: 'pull_request';
    action: string;
    title: string;
    body?: string;
    author: string;
    authorType: string;
    draft: boolean;
    baseBranch: string;
    headBranch: string;
};
