import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import './main.css'
import {Button} from "antd";
import AddTodo from "./modals/AddTodo";
import {useData} from "../context/useData";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {useFilterTodosByStatus} from "../hooks/useFilterTodosByStatus";
import _ from 'lodash'
import ToDoItem from "./ToDoItem";

const Main = () => {
    const {isEditClicked, isDeleteClicked} = useData()
    const [allTodos, setAllTodos] = useState([])
    const [isAddClicked, setIsAddClicked] = useState(false)
    const [dropped, setDropped] = useState(false)
    const {toDoTodos, inProgressTodos, doneTodos} = useFilterTodosByStatus(allTodos)

    const [todoState, setTodoState] = useState({
        "todo": {
            title: "Todo",
            todos: []
        },
        "in progress": {
            title: "In Progress",
            todos: []
        },
        "done": {
            title: "Done",
            todos: []
        }
    })

    const handleIsAddClicked = (clicked) => {
        setIsAddClicked(clicked)
    }

    const handleAddAllTodos = (todo) => {
        setAllTodos((prev) => [...prev, todo])
    }

    const fetchTodos = useCallback(async () => {
        const {data} = await axios.get(
            "/todos"
        )
        setAllTodos(data);
    }, []);


    const handleEdit = async (id, status) => {
        await axios.put(`/updateStatus/${id}`, {id, status}).catch(e => console.log('error ', e));
    }
    useEffect(() => {
        fetchTodos()
    }, [isAddClicked, dropped, isDeleteClicked, isEditClicked])

    useEffect(() => {
        setTodoState(prevState => ({
            ...prevState,
            todo: {
                ...prevState.todo,
                todos: toDoTodos
            },
            "in progress": {
                ...prevState["in progress"],
                todos: inProgressTodos
            },
            done: {
                ...prevState.done,
                todos: doneTodos
            }
        }));
    }, [allTodos])

    const handleDragEnd = ({destination, source}) => {
        if (!destination) {
            return
        }
        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            return
        }
        const reorderedItem = {...todoState[source.droppableId].todos[source.index]}
        setTodoState(prev => {
            prev = {...prev}
            prev[source.droppableId].todos.splice(source.index, 1)
            prev[destination.droppableId].todos.splice(destination.index, 0, reorderedItem)
            return prev
        })
        const newAllTodos = allTodos.map(item => {
            if (item.id === reorderedItem.id) {
                return {...item, status: destination.droppableId};
            }
            return item;
        });
        setAllTodos(newAllTodos);
        setDropped(true)
        handleEdit(reorderedItem.id, destination.droppableId)
    }

    const handleAddTodo = (newTodo) => {
        setTodoState(prev => {
            return {
                ...prev,
                todo: {
                    title: newTodo.status,
                    todos: [
                        {
                            id: newTodo.id,
                            name: newTodo.name
                        },
                        ...prev.todo.todos
                    ]
                }
            }
        })
    }

    return (
        <div className="main">
            <Button className="addButton" onClick={() => setIsAddClicked(true)} type="primary">Add a Todo</Button>
            <div className="container">
                <DragDropContext onDragEnd={handleDragEnd}>
                    {_.map(todoState, (data, key) => {
                        return (
                            <div key={key} className="column">
                                <h3>{data.title}</h3>
                                <Droppable droppableId={key}>
                                    {(provided) => {
                                        return (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="droppableColumn"
                                            >
                                                {data.todos.map((item, index) => {
                                                    return (
                                                        <Draggable key={item.id} index={index}
                                                                   draggableId={item.id.toString()}>
                                                            {(provided, snapshot) => {
                                                                return (
                                                                    <div
                                                                        className="todoItem"
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <p>{item.name}</p>
                                                                        <ToDoItem item={item}/>
                                                                    </div>
                                                                )
                                                            }}
                                                        </Draggable>
                                                    )
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        )
                                    }}
                                </Droppable>
                            </div>
                        )
                    })}
                </DragDropContext>
            </div>
            {isAddClicked && (
                <AddTodo handleIsAddClicked={handleIsAddClicked}
                         isAddClicked={isAddClicked}
                         handleAddTodo={handleAddTodo}
                         handleAddAllTodos={handleAddAllTodos}
                />
            )}
        </div>
    )
}

export default Main