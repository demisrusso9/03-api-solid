import { CheckInUseCase } from '@/use-cases/check-in'
import { InMemoryCheckInsRepository } from 'tests/repository/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'

let checkInRepository: InMemoryCheckInsRepository
let getUserProfileUseCaseMock: CheckInUseCase

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		checkInRepository = new InMemoryCheckInsRepository()
		getUserProfileUseCaseMock = new CheckInUseCase(checkInRepository)
	})

	it('should not be able to get user profile with wrong id', async () => {
		const { checkIn } = await getUserProfileUseCaseMock.execute({
			userId: 'fake-user-id',
			gymId: 'fake-gym-id'
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
