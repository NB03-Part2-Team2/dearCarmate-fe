import classNames from 'classnames/bind'
import styles from './Badge.module.scss'

const cx = classNames.bind(styles)

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'
export type BadgeSize = 'small' | 'medium'

type BadgeProps = {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
}

const Badge = ({ children, variant = 'primary', size = 'small', className }: BadgeProps) => {
  return (
    <span className={cx('badge', variant, size, className)}>
      {children}
    </span>
  )
}

export default Badge
