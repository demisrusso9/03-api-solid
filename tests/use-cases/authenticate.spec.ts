import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from 'tests/repository/in-memory/in-memory-users-repository'
import { describe, expect, it } from 'vitest'

describe('Authenticate Use Case', () => {
	it('should be able to authenticate', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const authenticateUseCaseMock = new AuthenticateUseCase(usersRepository)

		await usersRepository.create({
			name: 'test',
			email: 'example@example.com',
			password_hash: await hash('123456', 6)
		})

		const { user } = await authenticateUseCaseMock.execute({
			email: 'example@example.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to authenticate with wrong email', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const authenticateUseCaseMock = new AuthenticateUseCase(usersRepository)

		expect(() =>
			authenticateUseCaseMock.execute({
				email: 'example@example.com',
				password: '123456'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const authenticateUseCaseMock = new AuthenticateUseCase(usersRepository)

		await usersRepository.create({
			name: 'test',
			email: 'example@example.com',
			password_hash: await hash('123456', 6)
		})

		expect(() =>
			authenticateUseCaseMock.execute({
				email: 'example@example.com',
				password: '123123'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
