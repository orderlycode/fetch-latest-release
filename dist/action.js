"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const process_1 = __importDefault(require("process"));
const customRepo = (repoPath) => {
    const segments = repoPath.split('/', 2);
    if (segments.length < 2) {
        core.info('Please provide a repository in the format `owner/repo`.');
    }
    return segments;
};
const repoInput = core.getInput('repo_path');
const [owner, repo] = repoInput
    ? customRepo(repoInput)
    : process_1.default.env['GITHUB_REPOSITORY'].split('/', 2);
const octokit = github.getOctokit(core.getInput('github_token', { required: true }));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let latestRelease;
        core.info(`Fetching the latest release for \`${owner}/${repo}\``);
        try {
            latestRelease = yield octokit.rest.repos.getLatestRelease({
                owner,
                repo,
            });
        }
        catch (error) {
            core.setOutput('tag_name', '0.0.0');
            return;
        }
        const { data } = latestRelease;
        core.setOutput('tag_name', data.tag_name);
    });
}
try {
    run()
        .catch(error => {
        core.setFailed(`Action failed with error ${error}`);
    });
}
catch (error) {
    core.setFailed(`Action failed with error ${error}`);
}
