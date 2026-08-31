export type IssueContext = {
    installationId: number;
    issueNumber: number;
    repo: string;
    owner: string;
    labels?: string[];
};

export type IssueEvent = {
    installationId: number;
    issueNumber: number;
    repo: string;
    owner: string;
    repoFullName: string;
    eventType: 'issues' | 'issue_comment';
    action: string;
    title: string;
    body?: string;
    labels?: string[];
    comment?: {
        body: string;
        author: string;
        authorType: string;
    };
};
