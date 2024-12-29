import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', async () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete an answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswersAttachmentsRepository.items.push(
      makeAnswerAttachment({
        attachmentId: new UniqueEntityID('1'),
        answerId: newAnswer.id,
      }),
      makeAnswerAttachment({
        attachmentId: new UniqueEntityID('2'),
        answerId: newAnswer.id,
      }),
    )

    await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswersAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
