'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { PageElement, ElementStyles, DeviceMode } from '@/lib/page-builder/types'
import { Plus, Sparkles, ArrowRight, Star, ShoppingBag, Eye, Trash2, Copy, MoveUp, MoveDown } from 'lucide-react'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatPriceFromDecimal } from '@/lib/utils'
import { ProductDemonstrationSection } from '@/components/home/ProductDemonstrationSection'

export function resolveStyles(
  base: ElementStyles,
  responsive?: { tablet?: Partial<ElementStyles>; mobile?: Partial<ElementStyles> },
  device: DeviceMode = 'desktop'
): React.CSSProperties {
  let merged: ElementStyles = { ...base }

  if (device === 'tablet' && responsive?.tablet) {
    merged = { ...merged, ...responsive.tablet }
  } else if (device === 'mobile') {
    // Mobile inherits tablet overrides if any, then mobile overrides
    if (responsive?.tablet) {
      merged = { ...merged, ...responsive.tablet }
    }
    if (responsive?.mobile) {
      merged = { ...merged, ...responsive.mobile }
    }
  }

  // Convert to React.CSSProperties
  const style: React.CSSProperties = {
    fontFamily: merged.fontFamily,
    fontSize: merged.fontSize,
    fontWeight: merged.fontWeight as any,
    lineHeight: merged.lineHeight,
    letterSpacing: merged.letterSpacing,
    textAlign: merged.textAlign,
    textTransform: merged.textTransform,
    color: merged.color,
    fontStyle: merged.fontStyle,

    backgroundColor: merged.backgroundColor,
    backgroundImage: merged.backgroundImage,
    backgroundSize: merged.backgroundSize,
    backgroundPosition: merged.backgroundPosition,
    borderRadius: merged.borderRadius,
    borderTopLeftRadius: merged.borderTopLeftRadius,
    borderTopRightRadius: merged.borderTopRightRadius,
    borderBottomLeftRadius: merged.borderBottomLeftRadius,
    borderBottomRightRadius: merged.borderBottomRightRadius,
    borderWidth: merged.borderWidth,
    borderStyle: merged.borderStyle as any,
    borderColor: merged.borderColor,
    boxShadow: merged.boxShadow,
    opacity: merged.opacity,

    paddingTop: merged.paddingTop,
    paddingRight: merged.paddingRight,
    paddingBottom: merged.paddingBottom,
    paddingLeft: merged.paddingLeft,
    marginTop: merged.marginTop,
    marginRight: merged.marginRight,
    marginBottom: merged.marginBottom,
    marginLeft: merged.marginLeft,

    width: merged.width,
    maxWidth: merged.maxWidth,
    minWidth: merged.minWidth,
    height: merged.height,
    maxHeight: merged.maxHeight,
    minHeight: merged.minHeight,
    position: merged.position as any,
    overflow: merged.overflow as any,

    display: merged.display as any,
    flexDirection: merged.flexDirection as any,
    alignItems: merged.alignItems as any,
    justifyContent: merged.justifyContent as any,
    gap: merged.gap,
    flexWrap: merged.flexWrap as any,
    gridTemplateColumns: merged.gridTemplateColumns,

    objectFit: merged.objectFit as any,
    aspectRatio: merged.aspectRatio,
  }

  return style
}

interface ElementRendererProps {
  element: PageElement
  isEditor?: boolean
  selectedId?: string | null
  hoveredId?: string | null
  activeDevice?: DeviceMode
  onSelect?: (id: string, e: React.MouseEvent) => void
  onHover?: (id: string | null) => void
  onUpdateContent?: (id: string, content: string) => void
  onInsertSibling?: (targetId: string, position: 'before' | 'after') => void
  onDeleteElement?: (id: string) => void
  onDuplicateElement?: (id: string) => void
  onMoveElement?: (id: string, direction: 'up' | 'down') => void
  depth?: number
  parentType?: string
}

export function ElementRenderer({
  element,
  isEditor = false,
  selectedId,
  hoveredId,
  activeDevice = 'desktop',
  onSelect,
  onHover,
  onUpdateContent,
  onInsertSibling,
  onDeleteElement,
  onDuplicateElement,
  onMoveElement,
  depth = 0,
  parentType,
}: ElementRendererProps) {
  const [isEditingInline, setIsEditingInline] = useState(false)
  const isSelected = isEditor && selectedId === element.id
  const isHovered = isEditor && hoveredId === element.id && !isSelected
  const contentEditableRef = useRef<HTMLElement>(null)

  if (element.hidden && !isEditor) {
    return null
  }

  const computedStyles = resolveStyles(element.styles, element.responsiveStyles, activeDevice)

  // Handle double click for inline text editing
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isEditor) return
    e.stopPropagation()
    const canEditText = ['heading', 'text', 'button', 'badge'].includes(element.type)
    if (canEditText) {
      setIsEditingInline(true)
      setTimeout(() => {
        contentEditableRef.current?.focus()
      }, 50)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setIsEditingInline(false)
    if (onUpdateContent) {
      const newText = e.currentTarget.innerText.trim()
      if (newText !== element.content) {
        onUpdateContent(element.id, newText)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      e.currentTarget.blur()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isEditor) {
      e.preventDefault()
      e.stopPropagation()
      if (onSelect) onSelect(element.id, e)
    }
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isEditor && onHover) {
      e.stopPropagation()
      onHover(element.id)
    }
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isEditor && onHover) {
      e.stopPropagation()
      onHover(null)
    }
  }

  // Type label helper
  const getTypeLabel = (type: string, tag?: string) => {
    switch (type) {
      case 'heading':
        return tag ? tag.toUpperCase() : 'TITRE'
      case 'text':
        return 'PARAGRAPHE'
      case 'button':
        return 'BOUTON'
      case 'image':
        return 'IMAGE'
      case 'container':
        return 'CONTENEUR'
      case 'section':
        return 'SECTION'
      case 'badge':
        return 'BADGE'
      case 'product-list':
        return 'COLLECTION DYNAMIQUE'
      case 'divider':
        return 'SÉPARATEUR'
      default:
        return type.toUpperCase()
    }
  }

  // Editor overlay outline classes
  let outlineClasses = ''
  if (isEditor) {
    if (isSelected) {
      outlineClasses = 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black relative z-30'
    } else if (isHovered) {
      outlineClasses = 'ring-1 ring-blue-400 ring-offset-1 ring-offset-black/50 relative z-20'
    }
  }

  // Dynamic Product List Renderer
  const renderProductList = () => {
    const config = element.productListConfig || {
      category: 'ALL',
      limit: 8,
      sortBy: 'featured',
    }

    let products = [...MOCK_PRODUCTS]
    if (config.category !== 'ALL') {
      products = products.filter((p) => p.era === config.category)
    }
    if (config.sortBy === 'price-asc') {
      products.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (config.sortBy === 'price-desc') {
      products.sort((a, b) => Number(b.price) - Number(a.price))
    }
    products = products.slice(0, config.limit)

    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="group relative rounded-2xl bg-neutral-900/60 border border-neutral-800/80 overflow-hidden hover:border-amber-400/50 transition duration-300 shadow-xl"
            >
              <div className="relative aspect-[4/3] bg-black/50 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prod.images?.[0] || '/atelier/chiron-wall.jpg'}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-amber-400 font-mono text-[9px] uppercase tracking-wider font-bold">
                  {prod.brand}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition truncate">
                  {prod.name}
                </h4>
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80 text-xs">
                  <span className="text-white font-mono font-bold">
                    {formatPriceFromDecimal(prod.price)} €
                  </span>
                  <span className="text-[10px] text-amber-400/80 font-mono">
                    3 Formats
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Common wrapper props
  const elementProps = {
    id: element.id,
    style: computedStyles,
    className: `${outlineClasses} ${element.hidden ? 'opacity-40 grayscale' : ''}`,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onDoubleClick: handleDoubleClick,
  }

  // Badges displayed in editor mode on hover / select
  const renderEditorBadge = () => {
    if (!isEditor) return null
    if (!isSelected && !isHovered) return null

    return (
      <div
        className={`absolute -top-6 left-0 z-40 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase pointer-events-none flex items-center gap-1 shadow-md ${
          isSelected
            ? 'bg-amber-400 text-black'
            : 'bg-blue-600 text-white'
        }`}
      >
        <span>{getTypeLabel(element.type, element.tag)}</span>
        {element.responsiveStyles?.mobile && (
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Style personnalisé mobile" />
        )}
      </div>
    )
  }

  // "+" Insert buttons between elements (visible on hover)
  const renderInsertButtons = () => {
    if (!isEditor || (!isSelected && !isHovered)) return null

    return (
      <>
        {/* Insert Before */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onInsertSibling?.(element.id, 'before')
          }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-40 w-6 h-6 rounded-full bg-amber-400 hover:bg-white text-black flex items-center justify-center shadow-lg transition cursor-pointer hover:scale-110"
          title="Insérer un élément au-dessus"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Insert After */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onInsertSibling?.(element.id, 'after')
          }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-40 w-6 h-6 rounded-full bg-amber-400 hover:bg-white text-black flex items-center justify-center shadow-lg transition cursor-pointer hover:scale-110"
          title="Insérer un élément en dessous"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </>
    )
  }

  // Children rendering
  const renderedChildren = element.children?.map((child) => (
    <ElementRenderer
      key={child.id}
      element={child}
      isEditor={isEditor}
      selectedId={selectedId}
      hoveredId={hoveredId}
      activeDevice={activeDevice}
      onSelect={onSelect}
      onHover={onHover}
      onUpdateContent={onUpdateContent}
      onInsertSibling={onInsertSibling}
      onDeleteElement={onDeleteElement}
      onDuplicateElement={onDuplicateElement}
      onMoveElement={onMoveElement}
      depth={depth + 1}
      parentType={element.type}
    />
  ))

  // ─── RENDER BY TYPE ────────────────────────────────────────────────────────

  switch (element.type) {
    case 'section':
      if (element.id === 'demo-section') {
        return (
          <section {...elementProps}>
            {renderEditorBadge()}
            {renderInsertButtons()}
            <ProductDemonstrationSection />
            {renderedChildren}
          </section>
        )
      }
      return (
        <section {...elementProps}>
          {renderEditorBadge()}
          {renderInsertButtons()}
          {renderedChildren}
        </section>
      )

    case 'container':
      return (
        <div {...elementProps}>
          {renderEditorBadge()}
          {renderInsertButtons()}
          {renderedChildren}
        </div>
      )

    case 'heading': {
      const Tag = (element.tag || 'h2') as any
      return (
        <Tag
          {...elementProps}
          ref={contentEditableRef}
          contentEditable={isEditingInline}
          suppressContentEditableWarning={true}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        >
          {renderEditorBadge()}
          {element.content}
        </Tag>
      )
    }

    case 'text':
      return (
        <p
          {...elementProps}
          ref={contentEditableRef as any}
          contentEditable={isEditingInline}
          suppressContentEditableWarning={true}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        >
          {renderEditorBadge()}
          {element.content}
        </p>
      )

    case 'button':
      return (
        <div className="relative inline-block">
          {renderEditorBadge()}
          <button
            {...elementProps}
            type="button"
            ref={contentEditableRef as any}
            contentEditable={isEditingInline}
            suppressContentEditableWarning={true}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          >
            {element.content}
          </button>
        </div>
      )

    case 'badge':
      return (
        <div className="relative inline-block">
          {renderEditorBadge()}
          <span
            {...elementProps}
            ref={contentEditableRef as any}
            contentEditable={isEditingInline}
            suppressContentEditableWarning={true}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          >
            {element.content}
          </span>
        </div>
      )

    case 'image':
      return (
        <div className="relative inline-block" style={{ width: computedStyles.width, maxWidth: computedStyles.maxWidth }}>
          {renderEditorBadge()}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...elementProps}
            src={element.src || '/atelier/chiron-wall.jpg'}
            alt={element.alt || ''}
          />
        </div>
      )

    case 'product-list':
      return (
        <div {...elementProps}>
          {renderEditorBadge()}
          {renderProductList()}
        </div>
      )

    case 'divider':
      return (
        <div className="relative w-full">
          {renderEditorBadge()}
          <hr {...elementProps} />
        </div>
      )

    default:
      return (
        <div {...elementProps}>
          {renderEditorBadge()}
          {element.content || null}
          {renderedChildren}
        </div>
      )
  }
}
