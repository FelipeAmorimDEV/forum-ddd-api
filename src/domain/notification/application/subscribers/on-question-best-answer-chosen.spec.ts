import { SendNotificationUseCase } from '../use-cases/send-notification'

import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'

import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'

import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'

let sendNotification: SendNotificationUseCase
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let sendNotificationExecuteSpy: MockInstance

describe('On Question Best Answer Chosen', () => {
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
    new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotification) //eslint-disable-line
  })
  it('should be able to send a notification when question best answer is chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })

    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id
    inMemoryQuestionsRepository.save(question)

    await waitFor(() => expect(sendNotificationExecuteSpy).toBeCalled())
  })
})
