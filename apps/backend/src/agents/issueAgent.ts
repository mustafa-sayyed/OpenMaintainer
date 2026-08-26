import { generateText, isStepCount } from 'ai';
import { groq } from '@ai-sdk/groq';
import { createIssueTools } from '../tools/issue.js';
import type { IssueEvent } from '../types/issue.js';

export async function handleIssue(issue: IssueEvent) {
    console.log('🤖 Issue Agent received an issue');

    const issueTools = await createIssueTools(issue);
    try {
        const { text } = await generateText({
            model: groq('openai/gpt-oss-120b'),
            tools: {
                createIssueCommentTool: issueTools.createComment,
                getCommentsTool: issueTools.getComments,
                createLabelTool: issueTools.createLabel,
                readlabelsTool: issueTools.readLabels,
            },
            prompt: `
            You are an AI Maintainer assistant helping triage and respond to GitHub issues.

            Repository: ${issue.repo}
            Issue Title: ${issue.title}
            Issue Description: ${issue.body ?? 'No description provided.'}
            Issue Action: ${issue.action}

            # Available tools:
            - getCommentsTool: Read existing comments on this issue before responding.
            - createIssueCommentTool: Post a concise maintainer-style comment on the issue.
            - createLabelTool: Create a label on the current github issue.
            - readlabelsTool: Read the labels of the current github issue.

            # Instructions:
            1. first check the issue action: If the issue is newly opened, analyze the issue title, and decription, respond with a brief, actionable comment that helps the user understand the next steps, add any relevant labels, and ask for more information if needed.

            2. If action is created, like comments or labels, use readlabelsTool to check the existing labels and getCommentsTool to review the existing comments to see if the issue is already being addressed. If it is, do not post a comment. If it is not, analyze the issue and respond with a brief, actionable comment that helps the user understand the next steps, add any relevant labels, and ask for more information if needed.


            # Other Instructions:
            1. If you see that the issue is already being addressed or has sufficient information, do not post a comment.
            2. Analyze the issue for clarity, urgency, reproducibility, expected behavior, and required next steps.
            3. Summarize the root issue in a brief, actionable way.
            4. If the issue is clear, suggest likely causes, verification steps, or a fix path.
            5. If more information is needed, ask a focused follow-up question.

            # Response style:
            - Be brief, professional, and actionable.
            - Avoid generic filler.
            - Focus on problem understanding, next steps, and collaboration.
            - Do not mention tool usage.
            - Keep the comment suitable for a public GitHub issue thread.
            `,
            stopWhen: isStepCount(7),
            onToolExecutionStart: (event) => {
                console.log(
                    `Tool executtion Started: ${event.toolCall.toolName}, Params: ${JSON.stringify(event.toolCall.input, null, 2)}`
                );
            },
            onToolExecutionEnd: (event) => {
                console.log(
                    `Tool Executed: ${event.toolCall.toolName}, Ouput: ${JSON.stringify(event.toolOutput, null, 2)}`
                );
            },
        });

        console.log('\n🤖 AI Agent Response:\n');
        console.log(text);
    } catch (error) {
        console.error('Error in handleIssue:', error);
    }
}
