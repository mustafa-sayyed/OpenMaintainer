import express from 'express';
import { handleGitHubEvent } from './github/githubEventHandler.js';
import { handleIssue } from './agents/issueAgent.js';
import { getIssue } from './github/client.js';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toLocaleString() });
});

app.post('/api/v1/github', async (req, res) => {
    const event = req.headers['x-github-event'];

    const githubEvent = handleGitHubEvent(event as string, req.body);

    console.log('Received GitHub event:', githubEvent);

    const installationId = req.body.installation?.id;

    if (githubEvent?.type === 'issue') {
        const issue = await getIssue({
            installationId,
            issueNumber: githubEvent.issueNumber,
            owner: githubEvent.repoOwner,
            repo: githubEvent.repo,
        });

        console.log('Issue fetched from GitHub...');
        console.log('Issue details: ', {
            number: issue.number,
            title: issue.title,
            body: issue.body,
        });

        await handleIssue({...githubEvent, installationId: installationId});
    }

    res.status(200).send('Webhook received');
});

export { app };
