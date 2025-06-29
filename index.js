const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('GITHUB_TOKEN');
    const timeLimitHours = parseFloat(core.getInput('tempo_limite_horas'));
    const timeLimitMs = timeLimitHours * 60 * 60 * 1000;

    const octokit = github.getOctokit(token);
    const { context } = github;
    const pullRequest = context.payload.pull_request;
    const { owner, repo } = context.repo;
    const prNumber = pullRequest.number;

    const createdAt = new Date(pullRequest.created_at);
    const mergedAt = new Date(pullRequest.merged_at);
    const durationMs = mergedAt - createdAt;

    const reviewersResponse = await octokit.rest.pulls.listRequestedReviewers({
      owner,
      repo,
      pull_number: prNumber,
    });

    const reviewers = reviewersResponse.data.users || [];

    let commentBody = '';

    if (durationMs < timeLimitMs && reviewers.length > 0) {
      const mentions = reviewers.map(user => `@${user.login}`).join(', ');

      commentBody = `
⚠️ Este PR foi mergeado em menos de ${timeLimitHours}h.
Reviewers ainda pendentes: ${mentions}
> Por favor, desatribua-se manualmente se for o caso.
      `.trim();
    }

    if (commentBody) {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: commentBody,
      });
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
