type Lists = Array<{name: string; url: string; id: string}>

type ListData = {name: string; isDone: boolean; id: string}

type ListReminders = {id: string; todoId: string; start: Date; end: Date}

type List = {
  data: Array<ListData>
  reminders: Array<ListReminders>
}

export {Lists, List, ListData, ListReminders}
