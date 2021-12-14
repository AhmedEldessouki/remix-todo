type Lists = Array<{name: string; id: string}>

type TasksData = {name: string; isDone: boolean; id: string; notes: string}

type TaskReminder = {id: string; taskId: string; start: number; end: number}

type TaskType = {
  tasks: Array<TasksData>
  reminders: Array<TaskReminder>
}

type ObjectOfStrings = Record<string, string>

type TodoIdRouteLoaderData = {
  message: string
  listId: string
  listData: TaskType
}

export {
  Lists,
  TaskType,
  TasksData as TaskData,
  TaskReminder,
  ObjectOfStrings,
  TodoIdRouteLoaderData,
}
