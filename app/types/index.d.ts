type Lists = Array<{name: string; id: string}>

type TasksData = {name: string; isDone: boolean; id: string; notes: string}

type TaskReminder = {id: string; taskId: string; start: number; end: number}

type TaskType = {
  tasks: Array<TasksData>
  reminders: Array<TaskReminder>
}

type TodoIdRouteLoaderData = {
  message: string
  listId: string
  listData: TaskType
  isAllChecked: boolean | 'mixed'
}

type Inputs = {
  isDone?: string
  notes?: string
  name?: string
  taskId?: string
  reminderId?: string
  id?: string
  start?: string
  end?: string
  message?: string
}

type ActionReturnable = {
  errors: Inputs
  formData: Inputs
}

export {
  Lists,
  TaskType,
  TasksData as TaskData,
  TaskReminder,
  TodoIdRouteLoaderData,
  ActionReturnable,
}
