export type Action =
    | 'close_issue'
    | 'search_issues'
    | 'read_issue_comments'
    | 'create_issue_comment'
    | 'read_issue_labels'
    | 'create_issue_label';

export interface PolicyPayload {
    repo: string;
    owner: string;
    installationId: number;
}

export interface Policy {
    version: 1;

    permissions?: {
        close_issue?: boolean;
        search_issues?: boolean;
        read_issue_comments?: boolean;
        create_issue_comment?: boolean;
        read_issue_labels?: boolean;
        create_issue_label?: boolean;
    };
}
