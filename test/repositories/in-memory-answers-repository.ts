import { DomainEvents } from '@/core/events/domain-events'
import { PaginationProps } from '@/core/repositories/pagination-props'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  constructor(
    private answerAttachmentsRepository: AnswerAttachmentRepository,
  ) {}

  items: Answer[] = []

  async findManyByQuestionId(questionId: string, props: PaginationProps) {
    const items = this.items
      .filter((item) => item.questionId.toValue() === questionId)
      .slice((props.page - 1) * 20, props.page * 20)

    return items
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async create(answer: Answer) {
    this.items.push(answer)
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items[itemIndex] = answer
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items.splice(itemIndex, 1)
    await this.answerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.toString(),
    )
  }
}
