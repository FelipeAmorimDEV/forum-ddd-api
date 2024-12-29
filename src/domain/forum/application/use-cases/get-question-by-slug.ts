import { QuestionRepository } from '../repositories/question-repository'

import { Question } from '../../enterprise/entities/question'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}
  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
