"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const process_1 = __importDefault(require("process"));
const customRepo = (repoPath) => {
    const segments = repoPath.split('/', 2);
    if (segments.length < 2) {
        core_1.default.info('Please provide a repository in the format `owner/repo`.');
    }
    return segments;
};
const repoInput = core_1.default.getInput('repo_path');
const [owner, repo] = repoInput
    ? customRepo(repoInput)
    : process_1.default.env['GITHUB_REPOSITORY'].split('/', 2);
const octokit = github_1.default.getOctokit(core_1.default.getInput('github_token', { required: true }));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let latestRelease;
        core_1.default.info(`Fetching the latest release for \`${owner}/${repo}\``);
        try {
            latestRelease = yield octokit.rest.repos.getLatestRelease({
                owner,
                repo,
            });
        }
        catch (error) {
            core_1.default.setOutput('tag_name', '0.0.0');
            return;
        }
        const { data } = latestRelease;
        core_1.default.setOutput('tag_name', data.tag_name);
    });
}
try {
    run()
        .catch(error => {
        core_1.default.setFailed(`Action failed with error ${error}`);
    });
}
catch (error) {
    core_1.default.setFailed(`Action failed with error ${error}`);
}
