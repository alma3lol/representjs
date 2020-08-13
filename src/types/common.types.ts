/**
 * A class constructor accepting arbitrary arguments.
 */
export type Constructor<T> =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (...args: any[]) => T;

/**
 * Interface for classes with `new` operator and static properties/methods
 */
export interface Class<T> {
	// new MyClass(...args) ==> T
	new(...args: any[]): T;
	// Other static properties/operations
	[property: string]: any;
}

/**
 * Objects with open properties
 */
export interface AnyObject {
	[property: string]: any;
}