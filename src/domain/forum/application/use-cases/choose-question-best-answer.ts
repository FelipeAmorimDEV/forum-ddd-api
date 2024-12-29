import { QuestionRepository } from '../repositories/question-repository'

import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private answerRepository: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toValue(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toValue()) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return right({ question })
  }
}
