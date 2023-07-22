import { SearchGymsUseCase } from '@/use-cases/search-gyms'
import { InMemoryGymsRepository } from 'tests/repository/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new SearchGymsUseCase(gymsRepository)
	})

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'JavaScript Gym',
			latitude: -22.22612,
			longitude: -47.027962
		})

		await gymsRepository.create({
			title: 'TypeScript Gym',
			latitude: -22.22612,
			longitude: -47.027962
		})

		const { gyms } = await sut.execute({
			query: 'JavaScript',
			page: 1
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'JavaScript Gym' }),
		])
	})

	it('should be able to fetch paginated gym search', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `TypeScript Gym ${i}`,
				latitude: -22.22612,
				longitude: -47.027962
			})
		}

		const { gyms } = await sut.execute({
			query: 'TypeScript',
			page: 2
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'TypeScript Gym 21' }),
			expect.objectContaining({ title: 'TypeScript Gym 22' })
		])
	})
})
