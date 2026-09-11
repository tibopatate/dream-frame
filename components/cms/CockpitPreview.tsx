'use client'

import { SectionRenderer } from '@/components/page-builder/SectionRenderer'
import type { PageSection } from '@/lib/page-builder/types'

interface CockpitPreviewProps {
  sections: PageSection[]
  activeDevice: 'desktop' | 'mobile'
  activeSectionId: string | null
  hoveredSectionId: string | null
  onSelectSection: (id: string) => void
  onHoverSection: (id: string | null) => void
}

export function CockpitPreview({
  sections,
  activeDevice,
  activeSectionId,
  hoveredSectionId,
  onSelectSection,
  onHoverSection,
}: CockpitPreviewProps) {
  return (
    <div className="flex-1 w-full overflow-y-auto bg-slate-100 flex justify-center relative">
      <div
        className={`transition-all duration-300 bg-[#080807] text-white shadow-2xl ${
          activeDevice === 'mobile'
            ? 'w-full md:max-w-[390px] md:border-x md:border-slate-300 md:my-6 md:rounded-[2rem] overflow-hidden min-h-full md:min-h-[844px] md:shadow-xl'
            : 'w-full'
        }`}
      >
        {sections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            isEditor={true}
            isSelected={activeSectionId === section.id}
            isHovered={hoveredSectionId === section.id}
            onSelect={() => onSelectSection(section.id)}
            onHover={(hovering) => onHoverSection(hovering ? section.id : null)}
          />
        ))}
      </div>
    </div>
  )
}
