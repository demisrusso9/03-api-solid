import { CheckInUseCase } from '@/use-cases/check-in'
import { InMemoryCheckInsRepository } from 'tests/repository/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'

let checkInRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		checkInRepository = new InMemoryCheckInsRepository()
		sut = new CheckInUseCase(checkInRepository)
	})

	it('should not be able to get user profile with wrong id', async () => {
		const { checkIn } = await sut.execute({
			userId: 'fake-user-id',
			gymId: 'fake-gym-id'
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
