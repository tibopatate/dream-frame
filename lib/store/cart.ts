'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  variantId: string
  productId: string
  productName: string
  slug?: string
  brand?: string
  image: string
  price: number // EUR
  quantity: number
  sku?: string
  formatName?: string
  formatSize?: string
  options?: {
    dimensions?: string
    ledColor?: string
    [key: string]: any
  }
}

export interface CartNotificationData {
  id: string
  message: string
  productName: string
  brand?: string
  image?: string
  quantity: number
  totalCount: number
  formatName?: string
}

function computeTotals(items: CartItem[]) {
  const count = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
  const subtotal = items.reduce((sum, item) => {
    const p = Number(item.price) || 0
    const q = Number(item.quantity) || 1
    return sum + (p * q)
  }, 0)
  return { count, subtotal: Math.round(subtotal * 100) / 100 }
}

interface CartStore {
  items: CartItem[]
  subtotal: number
  count: number
  lastNotification: CartNotificationData | null
  clearNotification: () => void
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      count: 0,
      lastNotification: null,

      clearNotification: () => set({ lastNotification: null }),

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === newItem.variantId && (i.formatName === newItem.formatName || (!i.formatName && !newItem.formatName))
          )
          let updatedItems: CartItem[]
          if (existing) {
            updatedItems = state.items.map((i) =>
              i === existing
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            )
          } else {
            updatedItems = [...state.items, newItem]
          }

          const { count, subtotal } = computeTotals(updatedItems)

          return {
            items: updatedItems,
            count,
            subtotal,
            lastNotification: {
              id: `${Date.now()}-${Math.random()}`,
              message: newItem.formatName ? `+${newItem.quantity} ${newItem.formatName} ajouté` : `+${newItem.quantity} ajouté au panier`,
              productName: newItem.productName,
              brand: newItem.brand,
              image: newItem.image,
              quantity: newItem.quantity,
              totalCount: count,
              formatName: newItem.formatName,
            },
          }
        })
      },

      removeItem: (variantId) => {
        set((state) => {
          const updatedItems = state.items.filter((i) => i.variantId !== variantId)
          const { count, subtotal } = computeTotals(updatedItems)
          return {
            items: updatedItems,
            count,
            subtotal,
          }
        })
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        set((state) => {
          const currentItem = state.items.find((i) => i.variantId === variantId)
          const diff = currentItem ? quantity - currentItem.quantity : 0
          const updatedItems = state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          )
          const { count, subtotal } = computeTotals(updatedItems)

          let notification = state.lastNotification
          if (diff > 0 && currentItem) {
            notification = {
              id: `${Date.now()}-${Math.random()}`,
              message: `+${diff} ajouté au panier`,
              productName: currentItem.productName,
              brand: currentItem.brand,
              image: currentItem.image,
              quantity: diff,
              totalCount: count,
            }
          }

          return {
            items: updatedItems,
            count,
            subtotal,
            lastNotification: notification,
          }
        })
      },

      clearCart: () => set({ items: [], count: 0, subtotal: 0, lastNotification: null }),

      getSubtotal: () => {
        const { subtotal } = computeTotals(get().items)
        return subtotal
      },

      getCount: () => {
        const { count } = computeTotals(get().items)
        return count
      },
    }),
    {
      name: 'dream-frame-cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.items)) {
          const { count, subtotal } = computeTotals(state.items)
          state.count = count
          state.subtotal = subtotal
        }
      },
    }
  )
)

export const useCartStore = useCart

