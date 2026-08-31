import { generateText, isStepCount } from 'ai';
import { groq } from '@ai-sdk/groq';
import { createPullRequestTools } from '../tools/pullRequest.js';
import { pullRequestAgentPrompt } from '../prompts/pullRequestAgent.prompt.js';
import type { PullRequestEvent } from '../types/pullRequest.js';

export async function handlePullRequest(pullRequest: PullRequestEvent) {
  console.log('🤖 Pull Request Agent received a pull request');

  const pullRequestTools = await createPullRequestTools(pullRequest);
  try {
    const { text } = await generateText({
      model: groq('openai/gpt-oss-120b'),
      tools: {
        getPullRequestTool: pullRequestTools.getPullRequest,
        mergePullRequestTool: pullRequestTools.mergePullRequest,
      },
      prompt: pullRequestAgentPrompt(pullRequest),
      stopWhen: isStepCount(3),
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

    console.log('\n🤖 Pull Request Agent Response:\n');
    console.log(text);
  } catch (error) {
    console.error('Error in handlePullRequest:', error);
  }
}
