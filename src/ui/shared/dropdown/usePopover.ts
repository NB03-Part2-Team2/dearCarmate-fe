import { useCallback, useEffect, useRef, useState } from 'react'

const usePopover = (triggerRef?: React.RefObject<HTMLButtonElement>) => {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [isOpened, setIsOpened] = useState(false)

  const openPopover = () => {
    setIsOpened(true)
  }

  const closePopover = () => {
    setIsOpened(false)
  }

  const togglePopover = () => {
    setIsOpened((prev) => !prev)
  }

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const overlay = document.getElementById('overlay')
    if (!popoverRef.current) return
    if (!popoverRef.current.contains(event.target as Node)
      &&
      !triggerRef?.current?.contains(event.target as Node)
      &&
      overlay !== event.target
    ) {
      closePopover()
    }
  }, [triggerRef])

  useEffect(() => {
    if (!popoverRef.current) return
    if (isOpened) {
      popoverRef.current.style.display = 'block'
      document.addEventListener('mousedown', handleClickOutside)
    }
    else {
      popoverRef.current.style.display = 'none'
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside, isOpened])

  return { popoverRef, openPopover, closePopover, togglePopover, isOpened }
}

export default usePopover
