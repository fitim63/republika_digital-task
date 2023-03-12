import {Form, Input, Modal, Select} from "antd";
import {useState} from "react";
import axios from "axios";
import {permittedStatuses} from "../../constants";

const AddTodo = ({handleIsAddClicked, isAddClicked, handleAddTodo, handleAddAllTodos}) => {

    const [addData, setAddData] = useState({
        name: "",
        status: "",
    })
    const [error, setError] = useState(false)

    const handleAdd = async () => {
        if (addData.name === "") {
            setError(true)
            return
        }
        const {data} = await axios.post("/create", addData);
        console.log('data', data)
        handleAddTodo(data)
        handleAddAllTodos(data)
        handleIsAddClicked(false)
    }

    const handleChange = (e, input) => {
        setAddData((prev) =>
            ({...prev, [input]: input === 'name' ? e.target.value : e}));
    }
    return (
        <Modal
            open={isAddClicked}
            onOk={handleAdd}
            onCancel={() => handleIsAddClicked(false)}
            okButtonProps={{type: "primary"}}
        >
            <>
                <Form onFinish={handleAdd}>
                    <Form.Item label="Name">
                        <Input
                            onChange={(e) => handleChange(e, "name")}
                            value={addData.name}
                        />
                    </Form.Item>
                    <Form.Item label="Status">
                        <Select
                            onChange={(e) => handleChange(e, "status")}
                            options={permittedStatuses}
                            value={addData.status}
                        />
                    </Form.Item>
                </Form>
                {error && (
                    <p>Please give the ToDo a name!</p>
                )}
            </>
        </Modal>
    )
}

export default AddTodo