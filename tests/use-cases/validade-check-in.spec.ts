import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { ValidadeCheckInUseCase } from '@/use-cases/validade-check-in'
import { InMemoryCheckInsRepository } from 'tests/repository/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidadeCheckInUseCase

describe('Validade Check In Use Case', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository()
		sut = new ValidadeCheckInUseCase(checkInRepository)

		// vi.useFakeTimers()
	})

	afterEach(() => {
		// vi.useRealTimers()
	})

	it('should be able to validade the check-in', async () => {
		const createdCheckIn = await checkInRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-01'
		})

		const { checkIn } = await sut.execute({
			checkInId: createdCheckIn.id
		})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
		expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
	})

	it('should not be able to validade an inexistent check-in', async () => {
		await expect(() =>
			sut.execute({
				checkInId: 'inexistent-check-in'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
