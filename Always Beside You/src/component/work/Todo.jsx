import { useEffect, useState, useRef } from "react";
import '../../styles/Todo.css'
import { getTodo, createTodo, deleteTodo, changeTodo } from "../../api/todo";

function Todo() {
    // 新增代办
    const [createTodoData, setCreateTodoData] = useState({ event: "" });
    // 代办列表
    const [todos, setTodos] = useState([]);
    const [show, setShow] = useState(false);
    const inputRef = useRef(null);

    const handleTodoChange = async (id, newValue) => {
        try {
            // 先本地更新，体验更流畅
            setTodos(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, event: newValue } : item
                )
            );
            // 再提交后端
            await changeTodo(id, { event: newValue });

        } catch (err) {
            console.log("修改失败", err);
        }
    };

    // 获取 todo 列表
    const handleGetTodo = async () => {
        try {
            const res = await getTodo();
            setTodos(res.data);
            setShow(true);
        } catch (err) {
            console.log("获取失败", err);
            setShow(false);
        }
    };

    // 新增 todo
    const handleCreateTodo = async (data) => {
        if (!data.event?.trim()) return; // 空内容不提交
        try {
            await createTodo(data);
            setCreateTodoData({ event: "" }); // 清空输入框
            handleGetTodo(); // 刷新列表
        } catch (err) {
            console.log("上传失败", err);
        }
    };

    // 删除 todo
    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id);
            handleGetTodo();
        } catch (err) {
            console.log("删除失败", err);
        }
    };

    useEffect(() => {
        handleGetTodo();
    }, []);

    return (
        <>
            <div className="todo">
                <input
                    type="text"
                    value={createTodoData.event}
                    placeholder="输入代办事项"
                    ref={inputRef}
                    className="todo-input"
                    onChange={(e) => {
                        setCreateTodoData({ event: e.target.value });
                    }}
                />
                <img
                    src="/image/勾.png"
                    alt="添加"
                    onClick={() => {
                        handleCreateTodo(createTodoData);
                    }}
                    className="todo-img"
                />
            </div>

            {show && (
                <div className="todo-list">
                    {todos.map((todo) => (
                        <div key={todo.id} className="todo-item">
                            <input
                                className="todo-input"
                                value={todo.event}
                                onChange={(e) =>
                                    handleTodoChange(todo.id, e.target.value)
                                }
                            />
                            <div className="todo-delete" onClick={() => handleDeleteTodo(todo.id)}>
                                x
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Todo;