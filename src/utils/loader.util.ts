import { Constructor } from '../types/common.types';
import { promisify } from 'util';
import { basename } from "path";
const glob = promisify(require('glob'));

export namespace Loader {
	/**
	 * Returns all files matching the given glob pattern relative to root
	 *
	 * @param pattern - A glob pattern
	 * @param root - Root folder to start searching for matching files
	 * @returns Array of discovered files
	 */
	export async function discoverFiles(
		pattern: string,
		root: string,
	): Promise<string[]> {
		return glob(pattern, { root: root });
	}

	/**
	 * Given a function, returns true if it is a class, false otherwise.
	 *
	 * @param target - The function to check if it's a class or not.
	 * @returns True if target is a class. False otherwise.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export function isClass(target: any): target is Constructor<any> {
		return (
			typeof target === 'function' && target.toString().indexOf('class') === 0
		);
	}

	/**
	 * Returns an Array of Classes from given files. Works by requiring the file,
	 * identifying the exports from the file by getting the keys of the file
	 * and then testing each exported member to see if it's a class or not.
	 *
	 * @param files - An array of string of absolute file paths
	 * @param projectRootDir - The project root directory
	 * @returns An array of Class constructors from a file
	 */
	export function loadClassesFromFiles(
		files: string[],
	): Map<string, Function> {
		const classes: Map<string, Function> = new Map();
		for (const file of files) {
			const moduleObj = require(file);
			for (const k in moduleObj) {
				const exported = moduleObj[k];
				if (isClass(exported)) {
					classes.set(basename(file), exported);
				}
			}
		}
		return classes;
	}
}

