import { Question } from '@/domain/forum/enterprise/entities/question'

import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

export class InMemoryQuestionsRepository implements QuestionRepository {
  items: Question[] = []

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
  }

  async delete(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items.splice(questionIndex, 1)
  }
}
