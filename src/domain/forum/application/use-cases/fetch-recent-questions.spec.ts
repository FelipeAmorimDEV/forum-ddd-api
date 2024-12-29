import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', async () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch many recent questions', async () => {
    inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2024, 10, 20),
      }),
    )
    inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2024, 10, 23),
      }),
    )
    inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2024, 10, 18),
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 10, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 10, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 10, 18) }),
    ])
  })

  it('should be able to fetch many recent questions paginated', async () => {
    for (let i = 0; i < 22; i++) {
      inMemoryQuestionsRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(2)
  })
})
