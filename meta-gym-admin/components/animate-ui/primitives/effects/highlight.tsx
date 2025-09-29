'use client'

import * as React from 'react'
import { motion, Transition } from 'motion/react'
import { cn } from '@/lib/utils'

interface HighlightContextProps {
  activeItem: string | null
  setActiveItem: (item: string | null) => void
  enabled: boolean
  mode: 'parent' | 'item'
  controlledItems: boolean
}

const HighlightContext = React.createContext<HighlightContextProps | null>(null)

function useHighlight() {
  const context = React.useContext(HighlightContext)
  if (!context) {
    throw new Error('useHighlight must be used within a Highlight component')
  }
  return context
}

interface HighlightProps {
  children: React.ReactNode
  enabled?: boolean
  hover?: boolean
  controlledItems?: boolean
  mode?: 'parent' | 'item'
  containerClassName?: string
  forceUpdateBounds?: boolean
  transition?: Transition
  className?: string
}

function Highlight({
  children,
  enabled = true,
  hover = false,
  controlledItems = false,
  mode = 'item',
  containerClassName,
  forceUpdateBounds = false,
  transition = { type: 'spring', stiffness: 350, damping: 35 },
  className
}: HighlightProps) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null)

  const contextValue = React.useMemo<HighlightContextProps>(
    () => ({
      activeItem,
      setActiveItem,
      enabled,
      mode,
      controlledItems
    }),
    [activeItem, enabled, mode, controlledItems]
  )

  return (
    <HighlightContext.Provider value={contextValue}>
      <div className={cn('relative', containerClassName, className)}>
        {children}
      </div>
    </HighlightContext.Provider>
  )
}

interface HighlightItemProps {
  children: React.ReactNode
  activeClassName?: string
  id?: string
  className?: string
}

function HighlightItem({
  children,
  activeClassName = 'bg-accent',
  id = 'default',
  className
}: HighlightItemProps) {
  const { activeItem, setActiveItem, enabled, mode } = useHighlight()
  const isActive = activeItem === id
  
  const handleMouseEnter = () => {
    if (enabled && mode === 'item') {
      setActiveItem(id)
    }
  }

  const handleMouseLeave = () => {
    if (enabled && mode === 'item') {
      setActiveItem(null)
    }
  }

  return (
    <div
      className={cn(
        'relative transition-colors',
        isActive && activeClassName,
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-highlight={isActive ? 'true' : undefined}
    >
      {children}
    </div>
  )
}

export { Highlight, HighlightItem, useHighlight }