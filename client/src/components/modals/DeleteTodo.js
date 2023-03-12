import axios from "axios";
import {Modal} from "antd";
import {useData} from "../../context/useData";
import {useEffect, useState} from "react";

const DeleteTodo = ({handleInitialData, initialData}) => {
    const {setIsDeleteClicked, isDeleteClicked} = useData()
    const [todoToBeDeleted, setTodoToBeDeleted] = useState({
        id: undefined,
        name: undefined,
    })
    const handleDelete = async () => {
        try {
            await axios.delete(`/delete/${todoToBeDeleted.id}`);
            setIsDeleteClicked(false)
        } catch (err) {
            console.log('err', err)
        }
    }

    useEffect(() => {
        setTodoToBeDeleted((prev) => ({...prev, ...initialData}));
    }, [initialData]);

    return (
        <>
            {todoToBeDeleted.name && (
                <Modal title="Delete ToDo"
                       open={isDeleteClicked}
                       onOk={handleDelete}
                       onCancel={() => {
                           handleInitialData({})
                           setIsDeleteClicked(false)
                       }}
                       okButtonProps={{danger: true}}
                >
                    <p>Are you sure you want to delete "{todoToBeDeleted.name}"?</p>
                </Modal>
            )}
        </>
    )
}

export default DeleteTodo