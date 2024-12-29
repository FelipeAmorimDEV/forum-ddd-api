import { PaginationProps } from '@/core/repositories/pagination-props'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentRepository {
  findManyByQuestionId(
    questionId: string,
    props: PaginationProps,
  ): Promise<QuestionComment[]>
  findById(id: string): Promise<QuestionComment | null>
  create(questionComment: QuestionComment): Promise<void>
  delete(questionComment: QuestionComment): Promise<void>
}
