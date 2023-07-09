import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		email: z.string().email(),
		password: z.string().min(6)
	})

	const { email, password } = schema.parse(req.body)

	try {
		const authenticateUseCase = makeAuthenticateUseCase()

		await authenticateUseCase.execute({ email, password })
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(400).send({ message: error.message })
		}

		throw error
	}

	return reply.status(200).send()
}
