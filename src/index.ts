interface ZodUnknown {
  type: 'unknown'
  parse: (value: unknown) => unknown
}

interface ZodNumber {
  type: 'number'
  parse: (value: unknown) => number
}

interface ZodString {
  type: 'string'
  parse: (value: unknown) => string
}

interface ZodArray<T extends ZodType> {
  type: 'array'
  element: T
  parse: (value: unknown) => Array<Infer<T>>
}

interface ZodObject<T extends ZodType> {
  type: 'object'
  fields: Record<string, T>
  parse: (value: unknown) => InferZodObject<ZodObject<T>>
}

type ZodType =
  | ZodUnknown
  | ZodNumber
  | ZodString
  | ZodArray<ZodType>
  | ZodObject<ZodType>

type InferZodObject<T extends ZodObject<ZodType>> = {
  [K in keyof T['fields']]: Infer<T['fields'][K]>
}

type Infer<T extends ZodType> = T extends ZodUnknown
  ? unknown
  : T extends ZodNumber
    ? number
    : T extends ZodString
      ? string
      : T extends ZodArray<infer E>
        ? Array<Infer<E>>
        : T extends ZodObject<ZodType>
          ? InferZodObject<T>
          : 'invalid type'

const string = (): ZodString => ({
  type: 'string',
  parse (value) {
    if (typeof value !== 'string') throw new Error('Not a string')

    return value
  }
})
const number = (): ZodNumber => ({
  type: 'number',
  parse (value) {
    if (typeof value !== 'number') throw new Error('Not a number')

    return value
  }

})
const unknown = (): ZodUnknown => ({
  type: 'unknown',
  parse (value) {
    return value
  }
})
const array = <T extends ZodType>(element: T): ZodArray<T> => ({
  type: 'array',
  element,
  parse (value): Array<Infer<T>> {
    if (!Array.isArray(value)) throw new Error('Not an array')

    value.forEach(this.element.parse)

    return value
  }
})
const object = <T extends ZodType>(fields: Record<string, T>): ZodObject<T> => ({
  type: 'object',
  fields,
  parse (value) {
    if (typeof value !== 'object' || value === null) throw new Error('Not an object')

    const recordVal = value as Record<string, unknown>

    Object.entries(this.fields).forEach(([k, v]) => v.parse(recordVal[k]))

    return value as InferZodObject<ZodObject<T>>
  }
})

export const z = {
  string,
  number,
  unknown,
  array,
  object
}
