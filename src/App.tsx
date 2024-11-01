import { useState } from 'react'
import styles from './app.module.css'
import { Button, Header, Input, Tasks } from './components'
import { VisibilityOff } from './components/icons'
import { Task } from './types/task'
import { generateUUID, getItemLocalStorage, setItemLocalStorage } from './utils'

export default function App() {
  const tasks = (() => {
    const storedTasks = getItemLocalStorage<Task[]>('tasks')
    if (storedTasks) return storedTasks
    setItemLocalStorage('tasks', [])
    return []
  })()

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
    const newTask = {
      id: generateUUID(),
      title: taskTitle,
      checked: false,
      createdAt: new Date().toISOString()
    }
    const newTasks: Task[] = [...tasks, newTask]

    setItemLocalStorage('tasks', newTasks)
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
    setItemLocalStorage('tasks', newTasks)
    setTasksFiltered(
      isOnlyUncompleted ? newTasks.filter((task) => !task.checked) : newTasks
    )
  }

  const handleDelete = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id)
    setItemLocalStorage('tasks', newTasks)
    setTasksFiltered(
      isOnlyUncompleted ? newTasks.filter((task) => !task.checked) : newTasks
    )
  }

  const handleEdit = (task: Task) => {
    const newTasks = tasks.map((t) => (t.id === task.id ? task : t))
    setItemLocalStorage('tasks', newTasks)
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
      {tasks.length === 0 && (
        <div className={styles.empty}>
          <p>Bienvenido a mi To Do List!</p>
          <p>Crea una nueva tarea para comenzar</p>
        </div>
      )}
      {unfinishedTasks.length === 0 && (
        <p className={styles['no-tasks']}>No hay tareas pendientes, felicidades!</p>
      )}
      <form onSubmit={handleSave} className={styles['input-wrapper']}>
        <Input placeholder='Nueva Nota' name='task' />
      </form>
    </div>
  )
}
