import { Question } from '@/domain/forum/enterprise/entities/question'

import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { PaginationProps } from '@/core/repositories/pagination-props'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryQuestionsRepository implements QuestionRepository {
  constructor(
    private questionAttachmentsRepository: QuestionAttachmentRepository,
  ) {}

  items: Question[] = []

  async findManyRecent(props: PaginationProps) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((props.page - 1) * 20, props.page * 20)

    return questions
  }

  async findById(questionId: string) {
    const question = this.items.find(
      (item) => item.id.toString() === questionId,
    )

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async create(question: Question) {
    this.items.push(question)
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items[itemIndex] = question
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items.splice(itemIndex, 1)

    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
