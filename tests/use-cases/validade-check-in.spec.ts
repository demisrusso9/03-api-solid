import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { ValidadeCheckInUseCase } from '@/use-cases/validade-check-in'
import { InMemoryCheckInsRepository } from 'tests/repository/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidadeCheckInUseCase

describe('Validade Check In Use Case', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository()
		sut = new ValidadeCheckInUseCase(checkInRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
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

	it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

		const createdCheckIn = await checkInRepository.create({
			user_id: 'user-01',
			gym_id: 'gym-01'
		})

		const twentyOneMinutesInMs = 1000 * 60 * 21

		vi.advanceTimersByTime(twentyOneMinutesInMs)

		await expect(() =>
			sut.execute({
				checkInId: createdCheckIn.id
			})
		).rejects.toBeInstanceOf(LateCheckInValidationError)
	})
})
