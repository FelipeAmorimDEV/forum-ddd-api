import { DomainEvents } from '@/core/events/domain-events'
import { PaginationProps } from '@/core/repositories/pagination-props'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentRepository
{
  items: QuestionComment[] = []

  async findManyByQuestionId(questionId: string, props: PaginationProps) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((props.page - 1) * 20, props.page * 20)

    return questionComments
  }

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
    DomainEvents.dispatchEventsForAggregate(questionComment.id)
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )
    this.items.splice(itemIndex, 1)
  }
}
