import '../styles/Left.css'



function Left({ showAll, setLeft, setShow, left, isShow }) {


    return (
        <div className="sidebar">
            {showAll ? <>
                <button className="sidebar-btn" onClick={() => { if (left !== 'tomato' || !isShow) { setLeft('tomato'); setShow(true) } else { setShow(false) } }
                }>
                    <img src="/image/番茄.png" alt="" />
                </button>

                <button className="sidebar-btn" onClick={() => { if (left !== 'todo' || !isShow) { setLeft('todo'); setShow(true) } else { setShow(false) } }}>
                    <img src="/image/代办.png" alt="" />
                </button>

                <button className="sidebar-btn" onClick={() => { if (left !== 'calendar' || !isShow) { setLeft('calendar'); setShow(true) } else { setShow(false) } }}>
                    <img src="/image/日历.png" alt="" />
                </button>


                <button className="sidebar-btn" onClick={() => { if (left !== 'math' || !isShow) { setLeft('math'); setShow(true) } else { setShow(false) } }}>
                    <img src="/image/统计.png" alt="" />
                </button>
                <button className="sidebar-btn" onClick={() => { if (left !== 'sound' || !isShow) { setLeft('sound'); setShow(true) } else { setShow(false) } }}>
                    <img src="/image/云.png" alt="" />
                </button></> : null}
        </div >)
}
export default Left