import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

import { faker } from '@faker-js/faker'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(3),
      content: faker.lorem.sentence(8),
      ...override,
    },
    id,
  )

  return notification
}
