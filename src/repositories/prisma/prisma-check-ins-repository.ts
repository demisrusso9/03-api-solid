import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = await prisma.checkIn.create({
			data
		})

		return checkIn
	}

	async save(data: CheckIn) {
		const checkIn = await prisma.checkIn.update({
			where: {
				id: data.id
			},
			data
		})

		return checkIn
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const checkIns = await prisma.checkIn.findFirst({
			where: {
				user_id: userId,
				created_at: {
					equals: new Date(
						date.getFullYear(),
						date.getMonth() - 1,
						date.getDay(),
					),
				}
			}
		})

		return checkIns
	}

	async findManyByUserId(userId: string, page: number) {
		const checkIns = await prisma.checkIn.findMany({
			where: {
				user_id: userId
			},
			take: 20,
			skip: (page - 1) * 20
		})

		return checkIns
	}

	async findById(id: string) {
		const checkIn = await prisma.checkIn.findUnique({
			where: {
				id
			}
		})

		return checkIn
	}

	async countByUserId(userId: string) {
		const count = await prisma.checkIn.count({
			where: {
				user_id: userId
			}
		})

		return count
	}
}
