import { useState } from 'react';
import './AddBookForm.css';
import axios from 'axios';

// 表单配置项（可通过修改此数组扩展表单项）
const addBook = async (init) => {
    try {
        const response = await axios({
            method: 'post',
            url: 'http://8.148.72.91:8080/api/admin/books',
            data: {
                "bookname": init.bookname,
                "Author": init.Author,
                "num": init.num
            },
            timeout: 10000,
            withCredentials: true
        });
        console.log('add：', response.data);
        return response.data;

    } catch (error) {
        console.error(error);

    }
};


const formItems = [
    {
        id: 'bookname',
        label: '书籍标题',
        type: 'text',
        placeholder: '请输入书籍标题',
        errorTip: '标题不能为空'
    },
    {
        id: 'Author',
        label: '作者',
        type: 'text',
        placeholder: '请输入作者姓名',
        errorTip: '作者不能为空'
    },

    {
        id: 'num',
        label: '初始借阅次数',
        type: 'number',
        placeholder: '请输入初始借阅次数',
        errorTip: '请输入有效数字'
    }
];

const AddBookForm = () => {
    const [init, setAdd] = useState({})
    const [isFormVisible, setIsFormVisible] = useState(false);

    // 打开表单
    const openForm = () => {
        setIsFormVisible(true);
    };

    // 关闭表单
    const closeForm = () => {
        setIsFormVisible(false);
    };

    return (
        <>
            {/* 触发按钮：可放在页面任意位置 */}
            <button
                type="button"
                className="open-add-book-btn"
                style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    background: '#165DFF',
                    color: '#fff',
                    cursor: 'pointer',
                    margin: '20px'
                }}
                onClick={openForm}
            >
                添加书籍
            </button>

            {/* 遮罩层 */}
            <div className={`add-book-mask ${isFormVisible ? 'active' : ''}`} onClick={closeForm}></div>

            {/* 表单容器 */}
            <div className={`add-book-container ${isFormVisible ? 'active' : ''}`}>
                <h3 className="add-book-title">添加新书籍</h3>
                <form className="add-book-form" onSubmit={(e) => e.preventDefault()}>
                    {formItems.map(item => (
                        <div className="form-group" key={item.id}>
                            <label className="form-label" htmlFor={item.id}>
                                {item.label}
                            </label>
                            <input
                                type={item.type}
                                id={item.id}
                                className="form-input"
                                placeholder={item.placeholder}
                                onChange={(e) => { setAdd(prev => ({ ...prev, [item.id]: e.target.value })) }}
                            />
                            <div className="error-tip">{item.errorTip}</div>
                        </div>
                    ))}
                    <div className="form-actions">
                        <button type="button" className="form-btn cancel-btn" onClick={closeForm}>取消</button>
                        <button type="submit" className="form-btn submit-btn" onClick={() => addBook(init)}>添加书籍</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddBookForm;