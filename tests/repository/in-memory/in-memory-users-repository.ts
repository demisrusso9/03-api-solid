import { UsersRepository } from '@/repositories/users-repository'
import { Prisma, User } from '@prisma/client'

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = []

	async create(data: Prisma.UserCreateInput) {
		const user = {
			id: 'id-test',
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date()
		}

		this.items.push(user)

		return user
	}

	async findByEmail(email: string) {
		const user = this.items.find(item => item.email === email)

		if (!user) return null

		return user
	}
}
