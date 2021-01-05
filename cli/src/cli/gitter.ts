import { v4 } from 'uuid';
import { exec } from 'child_process';
import _ from 'lodash';

export type GitCommit = {
	id: string
	message: string
	files: string[]
	extraLines: string[]
}

export class Gitter {
	private _commits: GitCommit[] = [];
	public get commits() {
		return this._commits;
	}
	constructor(public signoff: string = "", public dryRun: boolean = false) {}
	/**
	 * Add a new commit to queue
	 *
	 * @param message Commit message
	 * @param files Files to add to the commit
	 * @param extraLines Extra explaining line to append to message
	 *
	 * @return string Returns commit ID
	 */
	commit = (message: string, files: string[], extraLines: string[] = []) => {
		const commitId = v4();
		this._commits.push({
			id: commitId,
			message,
			extraLines,
			files
		});
		return commitId;
	}
	/**
	 * Remove a commit from queue
	 *
	 * @param commitId Commit ID to remove
	 */
	uncommit = (commitId: string) => {
		_.remove(this._commits, commit => commit.id === commitId);
	}
	/**
	 * Run the commits' queue
	 */
	run = () => {
		if (!this.dryRun) {
			this._commits.forEach(({ files, extraLines, message }) => {
				exec(`git add ${_.join(files, " ")}`, (err, __, ___) => {
					if (err) throw err;
				});
				let msg = message;
				if (extraLines.length > 0) msg += `\n${_.join(extraLines, " ")}`;
				if (this.signoff !== "") msg += `\n${this.signoff}`;
				exec(`git commit -m "${msg}"`, (err, __, ___) => {
					if (err) throw err;
				});
			});
		}
	}
}

export let gitter = new Gitter();
