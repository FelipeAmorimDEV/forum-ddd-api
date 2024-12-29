import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentRepository
{
  items: QuestionAttachment[] = []

  async deleteManyByQuestionId(questionId: string) {
    const attachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )
    this.items = attachments
  }

  async findManyByQuestionId(questionId: string) {
    const items = this.items.filter(
      (item) => item.questionId.toValue() === questionId,
    )

    return items
  }
}
