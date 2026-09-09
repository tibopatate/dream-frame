export type ElementType =
  | 'section'
  | 'container'
  | 'heading'
  | 'text'
  | 'button'
  | 'image'
  | 'icon'
  | 'divider'
  | 'badge'
  | 'product-list'

export type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export interface ElementStyles {
  // Typography
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  lineHeight?: string
  letterSpacing?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  color?: string
  fontStyle?: 'normal' | 'italic'

  // Colors & Shape
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  borderRadius?: string
  borderTopLeftRadius?: string
  borderTopRightRadius?: string
  borderBottomLeftRadius?: string
  borderBottomRightRadius?: string
  borderWidth?: string
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted'
  borderColor?: string
  boxShadow?: string
  opacity?: number

  // Spacing (4 sides)
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
  marginTop?: string
  marginRight?: string
  marginBottom?: string
  marginLeft?: string

  // Dimensions & Positioning
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
  position?: 'static' | 'relative' | 'absolute'
  overflow?: 'visible' | 'hidden' | 'auto'

  // Flexbox & Grid
  display?: 'flex' | 'block' | 'inline-block' | 'grid' | 'inline-flex'
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  gap?: string
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  gridTemplateColumns?: string

  // Image Specific
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  aspectRatio?: string
}

export interface ProductListConfig {
  category: 'ALL' | 'VINTAGE' | 'MODERN'
  limit: number
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest'
}

export interface PageElement {
  id: string
  type: ElementType
  tag?: string
  content?: string
  src?: string
  alt?: string
  href?: string
  iconName?: string
  hidden?: boolean
  styles: ElementStyles
  responsiveStyles?: {
    tablet?: Partial<ElementStyles>
    mobile?: Partial<ElementStyles>
  }
  productListConfig?: ProductListConfig
  children?: PageElement[]
}

export interface PageTreeDocument {
  schemaVersion: number
  updatedAt: string
  elements: PageElement[]
}

export interface PageTreeSnapshot {
  id: string
  name: string
  publishedAt: string
  elementCount: number
  document: PageTreeDocument
}
