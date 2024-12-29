import { PaginationProps } from '@/core/repositories/pagination-props'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentRepository
{
  items: AnswerComment[] = []

  async findManyByAnswerId(answerId: string, props: PaginationProps) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((props.page - 1) * 20, props.page * 20)

    return answerComments
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )
    this.items.splice(itemIndex, 1)
  }
}
