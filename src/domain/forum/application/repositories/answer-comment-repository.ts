import { PaginationProps } from '@/core/repositories/pagination-props'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentRepository {
  findManyByAnswerId(
    answerId: string,
    props: PaginationProps,
  ): Promise<AnswerComment[]>
  findById(id: string): Promise<AnswerComment | null>
  create(answerComment: AnswerComment): Promise<void>
  delete(answerComment: AnswerComment): Promise<void>
}
