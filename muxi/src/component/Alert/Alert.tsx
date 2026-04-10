
import './Alert.css'

export type AlertType = 'success' | 'warning' | 'error' | 'info'

interface AlertProps {
    type?: AlertType
    title?: string
    message?: string
    closable?: boolean
    onClose?: () => void
}

export const MyAlert = ({
    type = 'info',
    title,
    message,
    closable = false,
    onClose,
}: AlertProps) => {
    return (
        <div className={`alert alert-${type}`}>
            <div className="alert-content">
                {title && <div className="alert-title">{title}</div>}
                {message && <div className="alert-message">{message}</div>}
            </div>
            {closable && (
                <button className="alert-close" onClick={onClose}>
                    ×
                </button>
            )}
        </div>
    )
}
