import { CreateGymUseCase } from '@/use-cases/create-gym'
import { InMemoryGymsRepository } from 'tests/repository/in-memory/in-memory-gyms-repository'
import { describe, it, expect, beforeEach } from 'vitest'

let createGymRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
	beforeEach(() => {
		createGymRepository = new InMemoryGymsRepository()
		sut = new CreateGymUseCase(createGymRepository)
	})

	it('should be able to create a gym', async () => {
		const { gym } = await sut.execute({
			title: 'gym-01-title',
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})
