import { GetUserMetricsUseCase } from '@/use-cases/get-user-metrics'
import { InMemoryCheckInsRepository } from 'tests/repository/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'

let checkInRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository()
		sut = new GetUserMetricsUseCase(checkInRepository)
	})

	it('should not be able to get check-ins count from metrics', async () => {
		for (let i = 1; i <= 3; i++) {
			await checkInRepository.create({
				gym_id: `'gym-${i}'`,
				user_id: 'user-01'
			})
		}

		const { checkInsCount } = await sut.execute({
			userId: 'user-01'
		})

		expect(checkInsCount).toEqual(3)
	})
})
