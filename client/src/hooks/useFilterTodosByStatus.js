export const useFilterTodosByStatus = (allTodos) => {
    const toDoTodos = allTodos.filter((toDo) => toDo.status === 'todo')
    const inProgressTodos = allTodos.filter((toDo) => toDo.status === 'in progress')
    const doneTodos = allTodos.filter((toDo) => toDo.status === 'done')

    return {toDoTodos, inProgressTodos, doneTodos}
}