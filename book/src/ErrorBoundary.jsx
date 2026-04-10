import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // 更新状态，显示错误提示
        return { hasError: true, error: error.message };
    }

    componentDidCatch(error, info) {
        // 可记录错误日志（如上报到服务器）
        console.error('组件错误：', error, info);
    }

    render() {
        if (this.state.hasError) {
            // 自定义错误提示界面
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h3>图书列表加载失败</h3>
                    <p>错误原因：{this.state.error}</p>
                    <button onClick={() => window.location.reload()}>刷新重试</button>
                </div>
            );
        }
        // 无错误时渲染子组件
        return this.props.children;
    }
}

export default ErrorBoundary;