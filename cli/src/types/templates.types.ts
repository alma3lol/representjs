import _ from 'lodash';

export namespace Templates {
    export namespace Models {
        export type Property = {
            /**
             * Property name
             */
            name: string
            /**
             * Whether this is the ID or not
             */
            id?: boolean
            /**
             * Property type
             */
            type: 'string' | 'boolean' | 'number' | 'object' | 'array'
            /**
             * Array property type
             */
            arrType?: 'string' | 'boolean' | 'number' | 'object'
            /**
             * Default value
             */
            defaultValue?: any
            /**
             * Wether required or not
             */
            required?: boolean
        }
        export type Relation = {
            /**
             * Relationship type
             */
            relationship: 'hasMany' | 'hasOne' | 'belongsTo'
            /**
             * Relation name
             */
            name: string
            /**
             * Relation model's name
             */
            model: string
            /**
             * Relation model's property
             */
            key: string
            /**
             * Relation type
             */
            type: 'string' | 'number' | 'array' | 'model'
            /**
             * Wether required or not
             */
            required: boolean
        }
    }
}
