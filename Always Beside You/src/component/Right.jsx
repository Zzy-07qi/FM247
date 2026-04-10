import '../styles/Right.css'



function Right({ showAll, setLeft, isShow, left, setShow, setShowAll, lvl }) {


    return (
        <div className="sidebar-ri">

            {showAll ? <><button className="sidebar-btn-ri lvl" onClick={() => { if (left !== 'lvl' || !isShow) { setLeft('lvl'); setShow(true) } else { setShow(false) } }}>
                {lvl}
            </button>

                <button className="sidebar-btn-ri" onClick={() => { if (left !== 'talk' || !isShow) { setLeft('talk'); setShow(true) } else { setShow(false) } }}>
                    <img src="/image/message.png" alt="" />
                </button>

                <button className="sidebar-btn-ri" onClick={() => { if (left !== 'theme' || !isShow) { setLeft('theme'); setShow(true) } else { setShow(false) } }}>
                    <img src="/image/Gift.png" alt="" />
                </button>

                <button className="sidebar-btn-ri" onClick={() => { if (left !== 'setting' || !isShow) { setLeft('setting'); setShow(true) } else { setShow(false) } }}>
                    <img src="/image/Settings.png" alt="" />
                </button></> : null}
            <button className="sidebar-btn-ri" onClick={() => { if (left !== 'show' || !isShow) { setLeft('show'); setShow(true) } else { setShow(false) }; setShowAll(prev => { return !prev }) }}>
                <img src="/image/Eye.png" alt="" />
            </button>
            {showAll ? <button className="sidebar-btn-ri" onClick={() => {
                if (left !== 'close' || !isShow) { setLeft('close'); setShow(true) } else { setShow(false) }
                localStorage.removeItem('token');
                window.location.reload()
            }}>
                <img src="/image/Power.png" alt="" />
            </button> : null}
        </div>)
}
export default Right