import { PaginationProps } from '@/core/repositories/pagination-props'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  findManyByQuestionId(
    questionId: string,
    props: PaginationProps,
  ): Promise<Answer[]>
  findById(id: string): Promise<Answer | null>
  create(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
}
