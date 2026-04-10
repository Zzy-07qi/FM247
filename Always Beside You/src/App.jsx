import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './styles/App.css'
import Top from './component/Top'
import Left from './component/Left'
import Tomato from './component/concenstrate/Tomato'
import Todo from './component/work/Todo'
import Right from './component/Right'
import Calendar from './component/work/Calendar'
import Sound from './component/concenstrate/Sound'
import Bottom from './component/Bottom'
import Lvl from './component/work/Lvl'
import StudyStatsPanel from './component/concenstrate/StudyStatsPanel'
import Setting from './component/Set/Setting'
import Login from './component/Login'
import { setNavigate } from './utils/request';
import { getUserInfo } from './api/user';
import SpinePet from './component/SpinePet/SpinePet';
import AiChat from './component/AIchat/AiChat';

// 背景元素组件，只在非登录页面显示
const BackgroundElements = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) return null;

  return (
    <div className="background-elements">
      <img src="/background/computer.png" alt="电脑" className="computer" />
      <img src="/background/cup.png" alt="杯子" className="cup" />
      <img src="/background/椅子.png" alt="椅子" className="chair" />
      <img src="/background/笔筒.png" alt="笔筒" className="pen-holder" />
    </div>
  );
};

const RouterWrap = () => {
  const navigate = useNavigate();
  setNavigate(navigate);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/main')
    } else { navigate('/login') }
  }, [navigate])
  return (<Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/main" element={<Main />} />
  </Routes>)
}

function Main() {
  const [showAll, setShowAll] = useState(true)
  const [left, setLeft] = useState('tomato')
  const [isShow, setShow] = useState(false)
  const [info, setInfo] = useState('')
  const [isTomatoActive, setTomatoActive] = useState(false)
  const [tomatoComplete, setTomatoComplete] = useState(false) // 跟踪番茄钟激活状态
  const spineData = '/spine.json'
  const getUserInfo1 = async () => {
    try {
      const res = await getUserInfo()
      setInfo(res.data)

    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getUserInfo1()
  }, [])
  return (<div >
    <Left showAll={showAll} setLeft={setLeft} setShow={setShow} left={left} isShow={isShow} />
    <Top isTomatoComplete={tomatoComplete} onTomatoCompleteReset={() => setTomatoComplete(false)} />
    {left === 'tomato' && isShow ? <Tomato onTomatoStatusChange={setTomatoActive} onTomatoComplete={() => setTomatoComplete(true)} /> : null}
    {left === 'todo' && isShow ? <Todo /> : null}
    {left === 'math' && isShow ? <StudyStatsPanel /> : null}
    {left === 'sound' && isShow ? <Sound /> : null}
    {left === 'calendar' && isShow ? <Calendar /> : null}
    <Right showAll={showAll} setLeft={setLeft} setShow={setShow} left={left} isShow={isShow} setShowAll={setShowAll} lvl={info.level ? info.level : null} />
    {left === 'lvl' && isShow ? <Lvl lvl={info.level} /> : null}
    {left === 'setting' && isShow ? <Setting setShow={setShow} data={info} seChangetData={setInfo} /> : null}
    {left === 'talk' && isShow ? <AiChat data={info} /> : null}
    <Bottom />
    <SpinePet spineData='/spine.json' scale={0.07} autoPlay={true} isTomatoActive={isTomatoActive} />
  </div>
  )
}

function App() {
  console.log('App component rendering');

  return (<>
    <BackgroundElements />
    <RouterWrap />
  </>
  )
}

export default App
