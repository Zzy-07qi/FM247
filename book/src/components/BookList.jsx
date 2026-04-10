import React, { useState } from 'react';
import axios from 'axios';
import AddBookForm from './AddBookForm';
import { useEffect } from 'react';
const deleteBook = async (id) => {
    // 1. 参数校验（避免空值请求）
    try {
        const response = await axios.delete(`/api/admin/books/${id}`,
            { withCredentials: true }

        )
        return response.data

    } catch (error) {
        console.error(error)
    }
};
const getbook = async () => {
    // 1. 参数校验（避免空值请求）
    try {
        const response = await axios.get('/api/books',
            { withCredentials: true }
        )
        return response.data.data;

    } catch (error) {
        // 4. 错误分类处理（便于排查问题）
        if (error.response) {
            // 服务器返回错误（状态码非2xx）
            const { status, data } = error.response;
            const errorMsg = data?.message || `登录失败（状态码：${status}）`;
            console.error('登录响应错误：', errorMsg);
            throw new Error(errorMsg);

        } else if (error.request) {
            // 请求发出去但未收到响应（网络/服务器问题）
            console.error('登录网络错误：', error.request);
            throw new Error('网络异常，请检查服务器连接或端口是否开放');

        } else {
            // 其他错误（参数校验、配置错误等）
            console.error('登录其他错误：', error.message);
            throw new Error(error.message);
        }
    }
};



const BookList = () => {
    // 状态管理：选中的图书、编辑弹窗显示

    const [selectedBook, setSelectedBook] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');

    // 筛选图书
    const [filteredBooks, setBook] = useState([])
    const [filteredBooks1, setBook1] = useState([])
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getbook();

                setBook1(data);
                setBook(data);
            } catch (error) {
                alert(error.message);
            }
        };
        fetchBooks();
    }, []);


    const searchbook = () => {
        setBook(filteredBooks1.filter(book =>
            book.bookname.includes(searchText) ||
            book.author.includes(searchText) ||
            book.id.toString().includes(searchText.toString())))
    }

    const handleEdit = (book) => {
        setSelectedBook(book);
        setIsEditModalOpen(true);
    };

    // 删除图书（模拟）
    const handleDelete = async (id) => {
        if (window.confirm('确定要删除这本书吗？')) {
            try {
                // const newBook = filteredBooks.filter(bok => bok.id != id);
                // setBook(newBook)
                const res = await deleteBook(id);
                console.log(res)
                alert(`已删除ID为${id}的图书`);
            } catch (error) {
                console.error('1', error)
            }
        };
    }

    return (
        <div className="book-management">
            <div className="book-header">
                <div className="book-search">
                    <input
                        type="text"
                        placeholder="搜索图书名称/作者/ID"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="search-btn" onClick={() => { searchbook() }}>搜索</button>
                </div>

            </div>


            <div className="book-grid">
                {filteredBooks.map((book) => (
                    <div className="book-card" key={book.id}>
                        <div className="book-info">
                            <h3 className="book-name">{book.bookname}</h3>
                            <p className="book-author">作者：{book.author}</p>
                            <div className="book-meta">

                                <span>ID：{book.id}</span>
                            </div>
                            <div className="book-stock">
                                库存：<span className={book.now_num > 0 ? 'in-stock' : 'out-stock'}>
                                    {book.now_num > 0 ? `${book.now_num}本可借` : '已售罄'}
                                </span>
                            </div>
                            <div className="book-actions">
                                <button className="edit-btn" onClick={() => handleEdit(book)}>编辑</button>
                                <button className="delete-btn" onClick={() => handleDelete(book.id)}>删除</button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isEditModalOpen && selectedBook && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>编辑图书信息</h3>
                            <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form className="book-form">
                                <div className="form-group">
                                    <label>图书名称</label>
                                    <input
                                        type="text"
                                        value={selectedBook.bookname}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, bookname: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>作者</label>
                                    <input
                                        type="text"
                                        value={selectedBook.author}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>库存数量</label>
                                    <input
                                        type="number"
                                        value={selectedBook.now_num} onChange={(e) => setSelectedBook({ ...selectedBook, now_num: Number(e.target.value) })}
                                        min="0"
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>取消</button>
                            <button className="save-btn" onClick={() => {
                                const editbook = filteredBooks.map(inibook => { if (inibook.id != selectedBook.id) return inibook; if (inibook.id == selectedBook.id) return selectedBook })
                                setBook(editbook)
                                alert('图书信息已更新');
                                setIsEditModalOpen(false);
                            }}>保存</button>
                        </div>
                    </div>
                </div>
            )
            }
            <AddBookForm />
        </div >);
};

export default BookList;