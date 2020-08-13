export namespace Model {
	/**
	 * Model's configuration
	 */
	export type Config = {
		/**
		 * Table name to use when fetching/storing into databases
		 */
		table?: string
		/**
		 * Name to identify the model. (optional)
		 */
		name?: string
		/**
		 * API's URI to use when performing CRUD operations
		 */
		uri?: string
	}

	/**
	 * Model property's configuration
	 * 
	 * ```ts
	 * // Example:
	 * class Cars extends Model {
	 *   \@Decorators.Model.property({
	 *     id: true,
	 *     defaultFn: "uuidv4",
	 *     default: "whatever" // Overwrites the above defaultFn
	 *   })
	 *   carId: string
	 *   // ... SNIP ... //
	 * }
	 * ```
	 */
	export type PropertyConfig = {
		/**
		 * Marks the property as ID.
		 * 
		 * SHOULD ONLY BE USED ONCE PER MODEL
		 */
		id?: boolean
		/**
		 * Default property value's generator function.
		 * 
		 * Currently supported functions: [uuidv4]
		 */
		defaultFn?: "uuidv4"
		/**
		 * Default property's value.
		 * 
		 * Overwrites assigned values & [defaultFn](#ModelPropertyConfig.defaultFn)
		 */
		default?: any
	}
}
