export const handleGitHubEvent = (event: string, body: any) => {
    if (event === 'issues') {
        const { action, issue, repository } = body;

        return {
            type: 'issue',
            action,
            issueNumber: issue.number,
            title: issue.title,
            body: issue.body,
            repo: repository.name,
            repoFullName: repository.full_name,
            repoOwner: repository.owner.login,
        };
    }

    return null;
};
