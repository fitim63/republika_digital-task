import {Button} from "antd";
import EditTodo from "./modals/EditTodo";
import DeleteTodo from "./modals/DeleteTodo";
import {useData} from "../context/useData";
import axios from "axios";
import {useState} from "react";
import {SettingOutlined, DeleteOutlined} from '@ant-design/icons'

const ToDoItem = ({item}) => {
    const {setIsEditClicked, setIsDeleteClicked, isEditClicked, isDeleteClicked} = useData()
    const [initialData, setInitialData] = useState({})

    const handleItemClick = async () => {
        try {
            const {data} = await axios.get(`/getTodoById/${item.id}`)
            setInitialData((prev) => ({...prev, ...data}));
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleInitialData = (value) => {
        setInitialData(value)
    }
    return (
        <div>
            <Button
                onClick={() => {
                    handleItemClick()
                    setIsEditClicked(true)
                }}
                type="primary"
                icon={<SettingOutlined/>}
            />
            <Button
                onClick={() => {
                    handleItemClick()
                    setIsDeleteClicked(true)
                }}
                danger
                type="primary"
                icon={<DeleteOutlined/>}
            />
            {isEditClicked && (
                <EditTodo initialData={initialData} handleInitialData={handleInitialData}/>
            )}
            {isDeleteClicked && (
                <DeleteTodo handleInitialData={handleInitialData} initialData={initialData}/>
            )}
        </div>
    );
}

export default ToDoItem