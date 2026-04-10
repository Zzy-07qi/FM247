import { useState } from 'react'
import { useRef } from 'react'
import './App.css'

function Input({ setComment, toggleAllSelect }) {
  const inputRef = useRef(null);
  const keydown = (e) => {
    if (e.key === 'Enter') {
      const value = inputRef.current.value.trim();
      if (!value) return;
      setComment(prev => [{ id: Date.now(), text: value }, ...prev]);
      inputRef.current.value = '';
    }
  };
  return (
    <div className="todo-header">
      <button className="toggle-btn" onClick={toggleAllSelect}>▼</button>
      <input
        type="text"
        placeholder="What needs to be done?"
        className="todo-input"
        onKeyDown={keydown}
        ref={inputRef}
      />
    </div>
  );
}

function Comment({ arr, check, setCheck, foot }) {
  const handleToggleItem = (id, e) => {
    setCheck(prev => ({ ...prev, [id]: e.target.checked }));
  };
  const newArr = arr.map(item => {
    const isChecked = check[item.id] || false;
    const textClass = isChecked ? "todo-textnot" : "todo-text";
    if (foot === "All") {
      return (
        <li className="todo-item" key={item.id}>
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={isChecked}
            onChange={(e) => handleToggleItem(item.id, e)}
          />
          <span className={textClass}>{item.text}</span>
        </li>
      );
    }
    else if (foot === "Active") {
      return !isChecked && (
        <li className="todo-item" key={item.id}>
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={isChecked}
            onChange={(e) => handleToggleItem(item.id, e)}
          />
          <span className={textClass}>{item.text}</span>
        </li>
      )
    }
    else if (foot === "Completed") {
      return isChecked && (
        <li className="todo-item" key={item.id}>
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={isChecked}
            onChange={(e) => handleToggleItem(item.id, e)}
          />
          <span className={textClass}>{item.text}</span>
        </li>
      )
    }
  });
  return <ul className="todo-list">{newArr}</ul>;
}

function App() {
  const [comment, setComment] = useState([]);
  const [check, setCheck] = useState({});
  const activeCount = comment.filter(item => !check[item.id]).length;
  const [foot, setFoot] = useState("All")


  const toggleAllSelect = () => {
    const isAllChecked = comment.every(item => check[item.id]);
    const newCheck = {};
    comment.forEach(item => {
      newCheck[item.id] = !isAllChecked;
    });
    setCheck(newCheck);
  };


  const handleClearCompleted = () => {
    const newComment = comment.filter(item => !check[item.id]);
    setComment(newComment);
    const newCheck = {};
    newComment.forEach(item => {
      newCheck[item.id] = check[item.id] || false;
    });
    setCheck(newCheck);
  };

  return (
    <div className="todo-container">
      <Input setComment={setComment} toggleAllSelect={toggleAllSelect} />
      <Comment arr={comment} check={check} setCheck={setCheck} foot={foot} />
      <div className="todo-footer">
        <span className="todo-count">{activeCount} item left!</span>
        <button
          className="clear-btn"
          onClick={handleClearCompleted}
          disabled={activeCount === comment.length}
        >
          Clear completed
        </button>
        <div className="filter-btns">
          <button className="filter-btn" onClick={() => setFoot("All")}>All</button>
          <button className="filter-btn" onClick={() => setFoot("Active")} >Active</button>
          <button className="filter-btn" onClick={() => setFoot("Completed")} >Completed</button>
        </div>
      </div>
    </div>
  );
}

export default App;