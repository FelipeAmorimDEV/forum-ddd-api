import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Comment, CommentProps } from './comment'

import { Optional } from '@/core/types/optional'
import { QuestionCommentCreatedEvent } from '../events/question-comment-created-event'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const question = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewComment = !id

    if (isNewComment) {
      question.addDomainEvent(new QuestionCommentCreatedEvent(question))
    }

    return question
  }
}
