import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionCommentCreatedNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    )
  }

  async sendQuestionCommentCreatedNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: 'Um novo comentario foi publicado em sua duvida.',
        content: questionComment.content.substring(0, 100).concat('....'),
      })
    }
  }
}
