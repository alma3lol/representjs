export namespace Model {
	/**
	 * Model's configuration
	 */
	export type Config = {
		/**
		 * Table name to use when fetching/storing into databases
		 */
		table: string
		/**
		 * API's URI to use when performing CRUD operations
		 */
		uri: string
	}

	/**
	 * Model property's configuration
	 * 
	 * ```ts
	 * // Example:
	 * class Cars extends Model {
	 *   \@Decorators.Model.property({
	 *     default: "whatever"
	 *   })
	 *   carId: string
	 *   // ... SNIP ... //
	 * }
	 * ```
	 */
	export type PropertyConfig = {
		/**
		 * Default property's value
		 */
		default?: any
	}
}
