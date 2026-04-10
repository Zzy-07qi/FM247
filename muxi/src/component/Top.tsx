import "./Top.css";

const Top = () => {
  return (
    <div className="top-container">
      <div className="top-logo"></div>
      <input
        type="text"
        placeholder="请输入感兴趣的内容哦"
        className="top-search"
      />
    </div>
  );
};
export default Top;
