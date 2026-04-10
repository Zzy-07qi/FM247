import type React from 'react'
import './Button.css'
interface ButtonProps {
    children: React.ReactNode
    type?: 'default' | 'primary'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    background?: string
    border?: 'normal' | 'round'
    onClick?: () => void
}


export const MyButton = ({
    children,
    type = 'default',
    size = 'md',
    disabled = false,
    background,
    border = 'normal',
    onClick,
}: ButtonProps) => {
    return (
        <button className={`btn btn-${type} btn-${size} btn-${border}`} disabled={disabled} onClick={onClick} style={{ background }}>
            {children}
        </button>
    )
}