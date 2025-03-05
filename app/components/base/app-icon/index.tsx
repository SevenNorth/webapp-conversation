import type { FC } from 'react'
import classNames from 'classnames'
import panda from '../icons/panda.png'

import style from './style.module.css'
export type AppIconProps = {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large'
  rounded?: boolean
  icon?: string
  background?: string
  className?: string
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  background,
  className,
}) => {
  return (
    <div
      className={classNames(
        style.appIcon,
        size !== 'medium' && style[size],
        rounded && style.rounded,
        className ?? '',
      )}
      style={{
        background,
      }}
    >
      <img src={panda.src} alt="" className='rounded-2xl' />
    </div>
  )
}

export default AppIcon
