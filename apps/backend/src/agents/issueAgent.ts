import { generateText, isStepCount } from 'ai';
import { groq } from '@ai-sdk/groq';
import { issueCommentTool } from '../tools/issueComment.js';

export async function handleIssue(issue: {
    action: string;
    issueNumber: number;
    title: string;
    body: string;
    repo: string;
    repoFullName: string;
    repoOwner: string;
    installationId: number;
}) {
    console.log('🤖 Issue Agent received an issue');

    try {
        const { text } = await generateText({
            model: groq('openai/gpt-oss-120b'),
            tools: {
                issueCommentTool,
            },
            prompt: `
            You are a AI Maintainer assistant.
            Analyze the following GitHub issue.

            Repository: ${issue.repo}
            Repo owner: ${issue.repoOwner}
            Issue #${issue.issueNumber}
            installationId: ${issue.installationId}

            Title:
            ${issue.title}

            Description:
            ${issue.body ?? 'No description provided.'}

            use the issue comment tool and tell these things:
            1. What is this issue about?
            2. Is it a bug, feature request, question, or other?
            3. What should a maintainer do next?
            `,
            stopWhen: isStepCount(4)
        });


        console.log('\n🤖 AI Agent Response:\n');
        console.log(text);
    } catch (error) {
        console.error('Error in handleIssue:', error);
    }
}
