import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { GetUserProfileUseCase } from '@/use-cases/get-user-profile'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from 'tests/repository/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetUserProfileUseCase(usersRepository)
	})

	it('should not be able to get user profile with wrong id', async () => {
		const createdUser = await usersRepository.create({
			name: 'test',
			email: 'example@example.com',
			password_hash: await hash('123456', 6)
		})

		const { user } = await sut.execute({ userId: createdUser.id })

		expect(user.id).toEqual(expect.any(String))
	})

	it('should be able to get the user id', async () => {
		await expect(() =>
			sut.execute({
				userId: 'fake-user-id'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
