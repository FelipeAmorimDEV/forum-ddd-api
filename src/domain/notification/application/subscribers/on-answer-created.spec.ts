import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'

import { OnAnswerCreated } from './on-answer-created'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

let sendNotification: SendNotificationUseCase
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let sendNotificationExecuteSpy: MockInstance

describe('On Answer Created', () => {
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
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    // Criando subscribe
    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotification) //eslint-disable-line
  })
  it('should be able to send a notification when answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })

    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)

    await waitFor(() => expect(sendNotificationExecuteSpy).toBeCalled())
  })
})
