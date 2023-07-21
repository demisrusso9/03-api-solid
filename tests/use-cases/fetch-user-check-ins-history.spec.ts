import { FetchUserCheckInsHistoryUseCase } from '@/use-cases/fetch-user-check-ins-history'
import { InMemoryCheckInsRepository } from 'tests/repository/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'

let checkInRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch user Check-in Use Case', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository()
		sut = new FetchUserCheckInsHistoryUseCase(checkInRepository)
	})

	it('should not be able to fetch check-in history', async () => {
		await checkInRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		})

		await checkInRepository.create({
			gym_id: 'gym-02',
			user_id: 'user-01'
		})

		const { checkIns } = await sut.execute({
			userId: 'user-01',
			page: 1
		})

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-01' }),
			expect.objectContaining({ gym_id: 'gym-02' })
		])
	})

	it('should not be able to fetch check-in history', async () => {
		for (let i = 1; i <= 22; i++) {
			await checkInRepository.create({
				gym_id: `gym-${i}`,
				user_id: 'user-01'
			})
		}

		const { checkIns } = await sut.execute({
			userId: 'user-01',
			page: 2
		})

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-21' }),
			expect.objectContaining({ gym_id: 'gym-22' })
		])
	})
})
