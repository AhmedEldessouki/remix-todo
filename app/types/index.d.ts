type Lists = Array<{name: string; url: string; id: string}>

type TaskData = {name: string; isDone: boolean; id: string; notes: string}

type TaskReminder = {id: string; taskId: string; start: number; end: number}

type TaskType = {
  tasks: Array<TaskData>
  reminders: Array<TaskReminder>
}

type ObjectOfStrings = {[key: string]: string}

export {Lists, TaskType, TaskData, TaskReminder, ObjectOfStrings}
