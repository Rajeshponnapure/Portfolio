import { describe, it, expect, vi } from 'vitest'
import { useOs } from '../store'

describe('useOs store', () => {
  it('initializes with lock phase', () => {
    const store = useOs.getState()
    expect(store.phase).toBe('lock')
    expect(store.activeApp).toBe('home')
    expect(store.pointerActive).toBe(false)
  })

  it('transitions to desktop on login', () => {
    useOs.getState().login()
    const store = useOs.getState()
    expect(store.phase).toBe('desktop')
  })

  it('updates active app', () => {
    useOs.getState().setActiveApp('projects')
    const store = useOs.getState()
    expect(store.activeApp).toBe('projects')
  })

  it('updates pointer active state', () => {
    useOs.getState().setPointerActive(true)
    const store = useOs.getState()
    expect(store.pointerActive).toBe(true)
  })
})