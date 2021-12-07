type Lists = Array<{name: string; url: string; id: string}>

type ListData = {name: string; isDone: boolean; id: string}

type ListReminders = {id: string; todoId: string; start: Date; end: Date}

type List = {
  data: Array<ListData>
  reminders: Array<ListReminders>
}

type ObjectOfStrings = {[key: string]: string}

export {Lists, List, ListData, ListReminders, ObjectOfStrings}
