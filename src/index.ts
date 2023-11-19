interface ZodUnknown { type: 'unknown' }
interface ZodNumber { type: 'number' }
interface ZodString { type: 'string' }

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
