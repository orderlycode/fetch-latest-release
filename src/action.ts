import core from '@actions/core'
import github from '@actions/github'
import process from 'process'

const customRepo = (repoPath: string) => {
  const segments = repoPath.split('/', 2)
  if (segments.length < 2) {
    core.info('Please provide a repository in the format `owner/repo`.')
  }
  return segments
}

const repoInput = core.getInput('repo_path')

const [owner, repo] = repoInput
  ? customRepo(repoInput)
  : process.env['GITHUB_REPOSITORY']!.split('/', 2)

const octokit = github.getOctokit(
  core.getInput('github_token', { required: true })
)

async function run() {
  let latestRelease
  core.info(`Fetching the latest release for \`${owner}/${repo}\``)
  try {
    latestRelease = await octokit.rest.repos.getLatestRelease({
      owner,
      repo,
    })
  } catch (error) {
    core.setOutput('tag_name', '0.0.0')
    return
  }

  const { data } = latestRelease
  core.setOutput('tag_name', data.tag_name)
}

try {
  run()
    .catch(error => {
      core.setFailed(`Action failed with error ${error}`)
    })
} catch (error) {
  core.setFailed(`Action failed with error ${error}`)
}
