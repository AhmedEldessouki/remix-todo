import type {Lists} from '~/types'

const hasListName = (lists: Lists, listName: string): boolean =>
  lists?.findIndex(listItem => listItem.name === listName) > -1

export {hasListName}
