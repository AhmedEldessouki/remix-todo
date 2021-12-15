import type {Lists} from '~/types'

const hasList = (lists: Lists, listId: string): boolean =>
  lists?.findIndex(listItem => listItem.id === listId) > -1

export {hasList}
