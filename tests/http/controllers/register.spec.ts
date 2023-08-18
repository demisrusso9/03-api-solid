import { afterAll, beforeAll, test, describe } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Register Controller (e2e)', async () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	test('should be able to register', async () => {
		await request(app.server)
			.post('/users')
			.send({
				name: 'John Doe',
				email: 'johndoe@test.com',
				password: 'testing123'
			})
			.expect(201)
	})
})
