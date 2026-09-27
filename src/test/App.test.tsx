import { describe, it, expect, vi } from 'vitest'
import { useOs } from '../store'

describe('App store integration', () => {
  it('store is accessible', () => {
    const store = useOs.getState()
    expect(store).toBeDefined()
    expect(typeof store.login).toBe('function')
    expect(typeof store.setActiveApp).toBe('function')
    expect(typeof store.setPhase).toBe('function')
  })
})