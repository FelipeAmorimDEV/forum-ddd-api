import { QuestionRepository } from '../repositories/question-repository'

import { Question } from '../../enterprise/entities/question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}
  async execute({
    authorId,
    attachmentIds,
    content,
    title,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    const attachments = attachmentIds.map((id) =>
      QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueEntityID(id),
      }),
    )

    const questionAttachmentList = new QuestionAttachmentList(attachments)

    question.attachments = questionAttachmentList

    this.questionRepository.create(question)

    return right({ question })
  }
}
