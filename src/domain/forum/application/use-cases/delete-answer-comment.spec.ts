import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', async () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()
    inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toValue(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer comment by other users', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })
    inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
