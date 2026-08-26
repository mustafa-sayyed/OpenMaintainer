export type IssueContext = {
    installationId: number;
    issueNumber: number;
    repo: string;
    owner: string;
};

export type IssueEvent = {
    installationId: number;
    issueNumber: number;
    repo: string;
    owner: string;
    repoFullName: string;
    type: string;
    action: string;
    title: string;
    body: string | null;
};
