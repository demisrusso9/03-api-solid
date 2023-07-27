import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ValidadeCheckInUseCaseRequest {
  checkInId: string
}

interface ValidadeCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidadeCheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkInId
	}: ValidadeCheckInUseCaseRequest): Promise<ValidadeCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId)

		if (!checkIn) {
			throw new ResourceNotFoundError()
		}

		checkIn.validated_at = new Date()

		await this.checkInsRepository.save(checkIn)

		return {
			checkIn
		}
	}
}
