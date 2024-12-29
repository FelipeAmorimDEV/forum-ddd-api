import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'

import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should be able to choose a question best answer', async () => {
    const question = makeQuestion()

    inMemoryQuestionsRepository.create(question)

    const answer = makeAnswer(
      {
        questionId: question.id,
      },
      new UniqueEntityID('answer-1'),
    )
    inMemoryAnswersRepository.create(answer)

    await sut.execute({
      authorId: question.authorId.toValue(),
      answerId: 'answer-1',
    })

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose a question best answer from another user', async () => {
    const question = makeQuestion()

    inMemoryQuestionsRepository.create(question)

    const answer = makeAnswer(
      {
        questionId: question.id,
      },
      new UniqueEntityID('answer-1'),
    )
    inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
