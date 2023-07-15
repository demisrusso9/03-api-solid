import { CheckInUseCase } from '@/use-cases/check-in'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryCheckInsRepository } from 'tests/repository/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from 'tests/repository/in-memory/in-memory-gyms-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let checkInRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		checkInRepository = new InMemoryCheckInsRepository()
		gymRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInRepository, gymRepository)

		gymRepository.items.push({
			id: 'fake-gym-id',
			title: 'Gym',
			description: '',
			phone: '',
			latitude: new Decimal(0),
			longitude: new Decimal(0)
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should not be able to get user profile with wrong id', async () => {
		const { checkIn } = await sut.execute({
			userId: 'fake-user-id',
			gymId: 'fake-gym-id',
			userLatitude: 0,
			userLongitude: 0
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2023, 0, 20, 8, 35, 0))

		await sut.execute({
			userId: 'fake-user-id',
			gymId: 'fake-gym-id',
			userLatitude: 0,
			userLongitude: 0
		})

		await expect(() =>
			sut.execute({
				userId: 'fake-user-id',
				gymId: 'fake-gym-id',
				userLatitude: 0,
				userLongitude: 0
			})
		).rejects.toBeInstanceOf(Error)
	})

	it('should be able to check in twice but in different day', async () => {
		vi.setSystemTime(new Date(2023, 0, 20, 8, 35, 0))

		await sut.execute({
			userId: 'fake-user-id',
			gymId: 'fake-gym-id',
			userLatitude: 0,
			userLongitude: 0
		})

		vi.setSystemTime(new Date(2023, 0, 21, 8, 35, 0))

		const { checkIn } = await sut.execute({
			userId: 'fake-user-id',
			gymId: 'fake-gym-id',
			userLatitude: 0,
			userLongitude: 0
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on a distant gym', async () => {
		gymRepository.items.push({
			id: 'fake-gym-id-2',
			title: 'Gym',
			description: '',
			phone: '',
			latitude: new Decimal(-22.255781),
			longitude: new Decimal(-46.899848)
		})

		await expect(() =>
			sut.execute({
				userId: 'fake-user-id',
				gymId: 'fake-gym-id',
				userLatitude: -22.22612,
				userLongitude: -47.027962
			})
		).rejects.toBeInstanceOf(Error)
	})
})
