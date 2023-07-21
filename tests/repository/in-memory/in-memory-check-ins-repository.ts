import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = []

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date()
		}

		this.items.push(checkIn)

		return checkIn
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf('date')
		const endOfTheDay = dayjs(date).endOf('date')

		const checkInOnSameDay = this.items.find(checkIn => {
			const checkInDate = dayjs(checkIn.created_at)

			const isOnTheSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

			return checkIn.user_id === userId && isOnTheSameDate
		})

		if (!checkInOnSameDay) {
			return null
		}

		return checkInOnSameDay
	}

	async findManyByUserId(userId: string, page: number) {
		const items_per_page = 20

		return this.items
			.filter(item => item.user_id === userId)
			.slice((page - 1) * items_per_page, page * items_per_page)
	}
}
