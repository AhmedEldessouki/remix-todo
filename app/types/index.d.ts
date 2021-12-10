type Lists = Array<{name: string; url: string; id: string}>

type TaskData = {name: string; isDone: boolean; id: string; description: string}

type TaskReminder = {id: string; todoId: string; start: Date; end: Date}

type TaskType = {
  tasks: Array<TaskData>
  reminders: Array<TaskReminder>
}

type ObjectOfStrings = {[key: string]: string}

export {Lists, TaskType, TaskData, TaskReminder, ObjectOfStrings}
