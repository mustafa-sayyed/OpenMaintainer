import type { IssueEvent } from '../types/issue.js';
import type { PullRequestEvent } from '../types/pullRequest.js';

export const handleGitHubEvent = (
  event: string,
  body: any
): IssueEvent | PullRequestEvent | null => {
  if (
    (event === 'issues' && body?.action === 'opened') ||
    (event === 'issue_comment' &&
      body?.action === 'created' &&
      body?.comment?.user?.type === 'User')
  ) {
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
      labels: issue.labels?.map((label: any) =>
        typeof label === 'string' ? label : (label.name ?? '')
      ),
      comment:
        event === 'issue_comment'
          ? {
              body: body.comment.body,
              author: body.comment.user.login,
              authorType: body.comment.user.type,
            }
          : undefined,
    };
  }

  const pullRequest = body?.pull_request;
  const pullRequestActions = [
    'opened',
    'reopened',
    'synchronize',
    'ready_for_review',
  ];

  if (
    event === 'pull_request' &&
    pullRequestActions.includes(body?.action) &&
    pullRequest?.user?.login === 'dependabot[bot]' &&
    pullRequest?.user?.type === 'Bot'
  ) {
    const { action, repository, installation } = body;

    return {
      eventType: 'pull_request',
      action,
      installationId: installation?.id,
      pullRequestNumber: pullRequest.number,
      title: pullRequest.title,
      body: pullRequest.body,
      repo: repository.name,
      repoFullName: repository.full_name,
      owner: repository.owner.login,
      author: pullRequest.user.login,
      authorType: pullRequest.user.type,
      draft: pullRequest.draft ?? false,
      baseBranch: pullRequest.base.ref,
      headBranch: pullRequest.head.ref,
    };
  }

  return null;
};
