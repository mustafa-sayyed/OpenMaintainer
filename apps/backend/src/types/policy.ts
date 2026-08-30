export type Action =
    | 'create_issue_comment'
    | 'close_issue'
    | 'read_labels'
    | 'read_comments'
    | 'search_issues'
    | 'create_label';

export interface PolicyPayload {
    repo: string;
    owner: string;
    installationId: number;
}

export interface Policy {
    version: 1;

    permissions?: {
        create_issue_comment?: boolean;
        close_issue?: boolean;
        read_labels?: boolean;
        read_comments?: boolean;
        search_issues?: boolean;
        create_label?: boolean;
    };
}
