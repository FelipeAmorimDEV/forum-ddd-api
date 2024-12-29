import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}
  async execute({
    instructorId,
    questionId,
    content,
    attachmentIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    const attachments = attachmentIds.map((id) =>
      AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityID(id),
      }),
    )

    const answerAttachmentList = new AnswerAttachmentList(attachments)

    answer.attachments = answerAttachmentList

    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
