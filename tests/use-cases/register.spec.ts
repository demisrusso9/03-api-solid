import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from 'tests/repository/in-memory/in-memory-users-repository'
import { describe, it, expect } from 'vitest'

describe('Register Use Case', () => {
	it('should be able to register a user', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerUseCaseMock = new RegisterUseCase(usersRepository)

		const { user } = await registerUseCaseMock.execute({
			name: 'test',
			email: 'test@example.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should hash user password upon registration', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerUseCaseMock = new RegisterUseCase(usersRepository)

		const { user } = await registerUseCaseMock.execute({
			name: 'test',
			email: 'test@example.com',
			password: '123456'
		})

		const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})

	it('should not be able to register with same email twice', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerUseCaseMock = new RegisterUseCase(usersRepository)

		const email = 'test@example.com'

		await registerUseCaseMock.execute({
			name: 'test',
			email,
			password: '123456'
		})

		await expect(
			registerUseCaseMock.execute({
				name: 'test',
				email,
				password: '123456'
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
