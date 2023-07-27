import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms'
import { InMemoryGymsRepository } from 'tests/repository/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Search Gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it('should be able to fetch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near',
			latitude: -22.525443,
			longitude: -46.9568067
		})

		await gymsRepository.create({
			title: 'Far',
			latitude: -22.952715,
			longitude: -46.540082
		})

		const { gyms } = await sut.execute({
			userLatitude: -22.525443,
			userLongitude: -46.9568067,
			page: 1
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({ title: 'Near' })])
	})
})
