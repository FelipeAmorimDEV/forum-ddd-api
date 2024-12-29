import { SendNotificationUseCase } from '../use-cases/send-notification'

import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

import { makeQuestion } from 'test/factories/make-question'

import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { OnQuestionCommentCreated } from './on-question-comment-created'

let sendNotification: SendNotificationUseCase
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let sendNotificationExecuteSpy: MockInstance

describe('On Question Comment Created', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    // Criando subscribe
    new OnQuestionCommentCreated(inMemoryQuestionsRepository, sendNotification) //eslint-disable-line
  })
  it('should be able to send a notification when question comment is created', async () => {
    const question = makeQuestion()
    const questionComment = makeQuestionComment({
      questionId: question.id,
    })

    inMemoryQuestionsRepository.create(question)
    inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => expect(sendNotificationExecuteSpy).toBeCalled())
  })
})
