import { describe, expect, it } from 'bun:test'
import { z } from '.'

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  isVerified: z.bool()
})

const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number()
})

const user = {
  id: 1,
  name: 'John Doe',
  email: 'some@mail.com',
  isVerified: true
}

const product = {
  id: 1,
  name: 'Product',
  price: 100
}

const parsedUser = UserSchema.parse(user)
const parsedProduct = ProductSchema.parse(product)

describe('UserSchema', () => {
  it('should parse user correctly', () => {
    expect(parsedUser).toEqual(user)
  })
})

describe('ProductSchema', () => {
  it('should parse product correctly', () => {
    expect(parsedProduct).toEqual(product)
  })
})
