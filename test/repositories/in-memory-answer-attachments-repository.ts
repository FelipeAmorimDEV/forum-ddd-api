import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentRepository
{
  items: AnswerAttachment[] = []

  async deleteManyByAnswerId(answerId: string) {
    const attachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )
    this.items = attachments
  }

  async findManyByAnswerId(answerId: string) {
    const items = this.items.filter(
      (item) => item.answerId.toValue() === answerId,
    )

    return items
  }
}
