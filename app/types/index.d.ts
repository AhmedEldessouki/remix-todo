type Lists = Array<{name: string; url: string; id: string}>

type TaskData = {name: string; isDone: boolean; id: string; description: string}

type TaskReminder = {id: string; todoId: string; start: Date; end: Date}

type List = {
  tasks: Array<TaskData>
  reminders: Array<TaskReminder>
}

type ObjectOfStrings = {[key: string]: string}

export {
  Lists,
  List,
  TaskData as ListData,
  TaskReminder as ListReminders,
  ObjectOfStrings,
}
