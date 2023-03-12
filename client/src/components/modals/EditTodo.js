import {Form, Input, Modal, Select} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {permittedStatuses} from "../../constants";
import {useData} from "../../context/useData";

const EditTodo = ({initialData, handleInitialData}) => {
    const {setIsEditClicked, isEditClicked} = useData()
    const [error, setError] = useState(false)
    const [editData, setEditData] = useState({
        id: '',
        name: '',
        status: '',
    })

    useEffect(() => {
        setEditData({
            id: initialData.id,
            name: initialData.name,
            status: initialData.status,
        });
    }, [initialData]);

    const handleEdit = async () => {
        if (editData.name === "") {
            setError(true)
            return
        }
        setIsEditClicked(false)
        await axios.put(`/update/${editData.id}`, editData);
    }

    const handleChange = (e, input) => {
        setEditData((prev) =>
            ({...prev, [input]: input === 'name' ? e.target.value : e}));
    }

    return (
        <>
            {editData.name && (
                <Modal
                    open={isEditClicked}
                    onOk={handleEdit}
                    onCancel={() => {
                        handleInitialData({})
                        setIsEditClicked(false)
                    }}
                    okButtonProps={{type: "primary"}}
                >
                    <>
                        <Form onFinish={() => handleEdit(editData.id)}>
                            <Form.Item label="Name">
                                <Input
                                    onChange={(e) => handleChange(e, "name")}
                                    value={editData.name}
                                />
                            </Form.Item>
                            <Form.Item label="Status">
                                <Select
                                    onChange={(e) => handleChange(e, "status")}
                                    options={permittedStatuses}
                                    value={editData.status}
                                />
                            </Form.Item>
                        </Form>
                        {error && (
                            <p>Please give the ToDo a name!</p>
                        )}
                    </>
                </Modal>
            )}
        </>
    )
}

export default EditTodo