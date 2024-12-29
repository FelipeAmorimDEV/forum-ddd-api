import { makeAnswer } from 'test/factories/make-answer'

import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let sut: CommentOnAnswerUseCase

describe('Comment On Answer', async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()
    inMemoryAnswersRepository.create(answer)

    await sut.execute({
      authorId: 'author-1',
      answerId: answer.id.toString(),
      content: 'Novo Comentário',
    })

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Novo Comentário',
    )
  })
})
