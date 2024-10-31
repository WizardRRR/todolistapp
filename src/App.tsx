import { useState } from 'react'
import styles from './app.module.css'
import { Button, Header, Input, Tasks } from './components'
import { VisibilityOff } from './components/icons'
import { mockTasks } from './tasks.mock'
import { Task } from './types/task'
import { generateUUID } from './utils'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [tasksFiltered, setTasksFiltered] = useState(tasks)

  const unfinishedTasks = tasks.filter((task) => !task.checked)
  const isOnlyUncompleted = !tasksFiltered.some((task) => task.checked)

  const onClickHiddenConcluded = () => {
    if (isOnlyUncompleted) setTasksFiltered(tasks)
    else setTasksFiltered(unfinishedTasks)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const taskTitle = (e.target as HTMLFormElement).task.value
    const newTask = { id: generateUUID(), title: taskTitle, checked: false }
    const newTasks: Task[] = [...tasks, newTask]

    setTasks(newTasks)
    setTasksFiltered(
      isOnlyUncompleted ? newTasks.filter((task) => !task.checked) : newTasks
    )
    ;(e.target as HTMLFormElement).reset()
  }

  const handleChangeCheckbox = (id: string, checked: boolean) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) return { ...task, checked }
      return task
    })
    setTasks(newTasks)
    setTasksFiltered(
      isOnlyUncompleted ? newTasks.filter((task) => !task.checked) : newTasks
    )
  }

  const handleDelete = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id)
    setTasks(newTasks)
    setTasksFiltered(
      isOnlyUncompleted ? newTasks.filter((task) => !task.checked) : newTasks
    )
  }

  const handleEdit = (task: Task) => {
    const newTasks = tasks.map((t) => (t.id === task.id ? task : t))
    setTasks(newTasks)
    setTasksFiltered(
      isOnlyUncompleted ? newTasks.filter((task) => !task.checked) : newTasks
    )
  }

  return (
    <div className={styles.app}>
      <Header />
      <hr className={styles.line} />
      <div className={styles['button-wrapper']}>
        <Button
          prefixElement={<VisibilityOff fill='var(--secondary-text)' />}
          title={isOnlyUncompleted ? 'Ver todas' : 'Ocultar tareas concluidas'}
          onClick={onClickHiddenConcluded}
        />
      </div>
      <Tasks
        onDelete={handleDelete}
        onEdit={handleEdit}
        tasks={tasksFiltered}
        concludedTask={tasks.filter((task) => task.checked).length}
        onCheckedTask={handleChangeCheckbox}
      />
      <form onSubmit={handleSave} className={styles['input-wrapper']}>
        <Input placeholder='Nueva Nota' name='task' />
      </form>
    </div>
  )
}
