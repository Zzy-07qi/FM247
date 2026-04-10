
import './BookBorrowUI.css';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
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
// 模拟书籍列表数据
// const bookList = [
//     {
//         id: 1,
//         title: "React 设计模式与最佳实践",
//         author: "Michele Bertoli",
//         category: "前端开发",
//         status: "可借阅",
//         borrowCount: 120
//     },
//     {
//         id: 2,
//         title: "你不知道的 JavaScript（上卷）",
//         author: "Kyle Simpson",
//         category: "JavaScript",
//         status: "可借阅",
//         borrowCount: 205
//     },
//     {
//         id: 3,
//         title: "深入理解计算机系统",
//         author: "Randal E. Bryant",
//         category: "计算机基础",
//         status: "已借出",
//         borrowCount: 98
//     },
//     {
//         id: 4,
//         title: "Python编程：从入门到实践",
//         author: "Eric Matthes",
//         category: "Python",
//         status: "可借阅",
//         borrowCount: 156
//     }
// ];

// 模拟已借书籍列表数据
const borrowedList = [
    {
        id: 1,
        title: "React 设计模式与最佳实践",
        author: "Michele Bertoli",
        borrowTime: "2025-12-24"
    },
    {
        id: 4,
        title: "Python编程：从入门到实践",
        author: "Eric Matthes",
        borrowTime: "2025-12-20"
    }
];

const BookBorrowUI = () => {
    const [isActive, setActive] = useState('borrow')
    const [bookList, setBook] = useState([])
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getbook();
                setBook(data);
            } catch (error) {
                alert(error.message);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="borrow-container">
            <div className="borrow-header">
                <h2>图书借阅系统</h2>

            </div>

            {/* 标签切换 */}
            <div className="borrow-tabs">
                <div className={isActive === 'borrow' ? 'tab active' : 'tab'} onClick={() => { setActive('borrow') }}>书籍列表</div>
                <div className={isActive === 'myBorrow' ? 'tab active' : 'tab'} onClick={() => { setActive('myBorrow') }}>我的借阅</div>
            </div>



            {/* 书籍列表面板 */}
            <div className={isActive === 'borrow' ? 'panel active' : 'panel'}>
                <div className="book-list">
                    {bookList.map(book => (
                        <div className="book-card" key={book.id}>
                            <h3 className="book-title">{book.bookname}</h3>
                            <p className="book-author">作者：{book.author}</p>

                            <p className="book-status">
                                状态：
                                <span className={book.now_num > 0 ? "status-available" : "status-borrowed"}>
                                    {book.now_num}
                                </span>
                            </p>
                            <p className="book-borrow-count" >借阅次数：{book.borrowCount}</p>
                            <button className="borrow-btn" disabled={book.now_num <= 0}>
                                借阅
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 我的借阅面板（默认隐藏） */}
            <div className={isActive === 'myBorrow' ? 'panel active' : 'panel'}>
                <div className="borrowed-list">
                    {borrowedList.map(item => (
                        <div className="borrowed-item" key={item.id}>
                            <div className="item-info">
                                <h3>{item.title}</h3>
                                <p>作者：{item.author}</p>
                                <p>借阅时间：{item.borrowTime}</p>
                            </div>
                            <button className="return-btn">归还</button>
                        </div>
                    ))}
                </div>
                {/* 空状态（默认隐藏，可替换 borrowed-list 显示） */}
                {/* <div className="empty-tip">你尚未借阅任何书籍</div> */}
            </div>
        </div >
    );
};

export default BookBorrowUI;