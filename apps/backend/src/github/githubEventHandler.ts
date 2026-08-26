import type { IssueEvent } from '../types/issue.js';

export const handleGitHubEvent = (
    event: string,
    body: any
): IssueEvent | null => {
    if (event === 'issues' || event === 'issue_comment') {
        const { action, issue, repository, installation } = body;

        return {
            eventType: event,
            action,
            installationId: installation?.id,
            issueNumber: issue.number,
            title: issue.title,
            body: issue.body,
            repo: repository.name,
            repoFullName: repository.full_name,
            owner: repository.owner.login,
            comment: event === 'issue_comment' ? body.comment.body : undefined,
        };
    }

    return null;
};
