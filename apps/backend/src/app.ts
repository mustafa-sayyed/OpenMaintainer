import express from 'express';
import { handleGitHubEvent } from './github/githubEventHandler.js';
import { handleIssue } from './agents/issueAgent.js';
import { handlePullRequest } from './agents/pullRequestAgent.js';
import { verifyGithubWebhook } from './github/verifyGithubWebhook.js';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toLocaleString() });
});

app.post('/api/v1/github', verifyGithubWebhook, async (req, res) => {
  const event = req.headers['x-github-event'] as string;

  const githubEvent = handleGitHubEvent(event, req.body);

  if (!githubEvent) {
    return res.status(200).send('Event not handled');
  }

  console.log('Received GitHub event:', githubEvent);

  if (githubEvent.eventType === 'pull_request') {
    await handlePullRequest(githubEvent);
  } else {
    await handleIssue(githubEvent);
  }

  res.status(200).send('Webhook received');
});

export { app };
