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

interface CartStore {
  items: CartItem[]
  lastNotification: CartNotificationData | null
  clearNotification: () => void
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  get subtotal(): number
  get count(): number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
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

          const totalCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

          return {
            items: updatedItems,
            lastNotification: {
              id: `${Date.now()}-${Math.random()}`,
              message: newItem.formatName ? `+${newItem.quantity} ${newItem.formatName} ajouté` : `+${newItem.quantity} ajouté au panier`,
              productName: newItem.productName,
              brand: newItem.brand,
              image: newItem.image,
              quantity: newItem.quantity,
              totalCount,
              formatName: newItem.formatName,
            },
          }
        })
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }))
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
          const totalCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

          let notification = state.lastNotification
          if (diff > 0 && currentItem) {
            notification = {
              id: `${Date.now()}-${Math.random()}`,
              message: `+${diff} ajouté au panier`,
              productName: currentItem.productName,
              brand: currentItem.brand,
              image: currentItem.image,
              quantity: diff,
              totalCount,
            }
          }

          return {
            items: updatedItems,
            lastNotification: notification,
          }
        })
      },

      clearCart: () => set({ items: [], lastNotification: null }),

      get subtotal() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      get count() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'dream-frame-cart',
      partialize: (state) => ({ items: state.items }), // Ne pas persister la notification temporaire
    }
  )
)

export const useCartStore = useCart

