import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from 'tests/repository/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let authenticateUseCaseMock: AuthenticateUseCase

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		authenticateUseCaseMock = new AuthenticateUseCase(usersRepository)
	})

	it('should be able to authenticate', async () => {
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
		await expect(() =>
			authenticateUseCaseMock.execute({
				email: 'example@example.com',
				password: '123456'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		await usersRepository.create({
			name: 'test',
			email: 'example@example.com',
			password_hash: await hash('123456', 6)
		})

		await expect(() =>
			authenticateUseCaseMock.execute({
				email: 'example@example.com',
				password: '123123'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
