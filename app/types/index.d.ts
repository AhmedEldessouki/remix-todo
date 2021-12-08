type Lists = Array<{name: string; url: string; id: string}>

type ListData = {name: string; isDone: boolean; id: string; description: string}

type ListReminders = {id: string; todoId: string; start: Date; end: Date}

type List = {
  tasks: Array<ListData>
  reminders: Array<ListReminders>
}

type ObjectOfStrings = {[key: string]: string}

export {Lists, List, ListData, ListReminders, ObjectOfStrings}
