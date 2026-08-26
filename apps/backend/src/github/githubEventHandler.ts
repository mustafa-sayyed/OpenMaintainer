import type { IssueEvent } from '../types/issue.js';

export const handleGitHubEvent = (
    event: string,
    body: any
): IssueEvent | null => {
    if (event === 'issues') {
        const { action, issue, repository, installation } = body;

        return {
            type: 'issue',
            action,
            installationId: installation?.id,
            issueNumber: issue.number,
            title: issue.title,
            body: issue.body,
            repo: repository.name,
            repoFullName: repository.full_name,
            owner: repository.owner.login,
        };
    }

    return null;
};
