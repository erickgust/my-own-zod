interface ZodUnknown {
  type: 'unknown'
}
interface ZodNumber {
  type: 'number'
}
interface ZodString {
  type: 'string'
}

interface ZodArray<T extends ZodType> {
  type: 'array'
  element: T
}

interface ZodObject<T extends ZodType> {
  type: 'object'
  fields: Record<string, T>
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

const string = (): ZodString => ({ type: 'string' })
const number = (): ZodNumber => ({ type: 'number' })
const unknown = (): ZodUnknown => ({ type: 'unknown' })
const array = <T extends ZodType>(element: T): ZodArray<T> => ({
  type: 'array',
  element
})
const object = <T extends ZodType>(fields: Record<string, T>): ZodObject<T> => ({
  type: 'object',
  fields
})

export const z = {
  string,
  number,
  unknown,
  array,
  object
}
