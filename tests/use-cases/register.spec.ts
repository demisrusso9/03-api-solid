import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from 'tests/repository/in-memory/in-memory-users-repository'
import { describe, it, expect, beforeEach } from 'vitest'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new RegisterUseCase(usersRepository)
	})

	it('should be able to register a user', async () => {
		const { user } = await sut.execute({
			name: 'test',
			email: 'test@example.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should hash user password upon registration', async () => {
		const { user } = await sut.execute({
			name: 'test',
			email: 'test@example.com',
			password: '123456'
		})

		const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})

	it('should not be able to register with same email twice', async () => {
		const email = 'test@example.com'

		await sut.execute({
			name: 'test',
			email,
			password: '123456'
		})

		await expect(
			sut.execute({
				name: 'test',
				email,
				password: '123456'
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
