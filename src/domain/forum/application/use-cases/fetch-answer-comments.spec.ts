import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comment', async () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )
    inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )
    inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch answer comments paginated', async () => {
    for (let i = 0; i < 22; i++) {
      inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
