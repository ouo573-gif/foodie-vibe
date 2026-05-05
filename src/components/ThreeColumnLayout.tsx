import type { ReactNode } from 'react'

interface ThreeColumnLayoutProps {
  left: ReactNode
  main: ReactNode
  right: ReactNode
  bottom: ReactNode
}

export default function ThreeColumnLayout({ left, main, right, bottom }: ThreeColumnLayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* 手機/平板：頂部橫條（桌面由左欄 grid 欄位渲染，此處只在小螢幕顯示）*/}
      <div className="lg:hidden">{left}</div>

      {/* 主內容區 */}
      <div
        className="three-col-grid"
        style={{ flex: 1 }}
      >
        {/* 左欄（桌面 24px 收合條，小螢幕隱藏）*/}
        <div className="hidden lg:block">
          {left}
        </div>

        {/* 主欄 */}
        <div
          style={{
            overflowY: 'auto',
            borderLeft: '1px solid var(--color-outline)',
            borderRight: '1px solid var(--color-outline)',
          }}
          className="lg:border-l-2 lg:border-r-2 lg:border-double lg:border-[--color-ink]"
        >
          {main}
        </div>

        {/* 右欄（桌面固定，小螢幕移至主欄下方）*/}
        <div className="hidden lg:block overflow-y-auto border-l-0">
          {right}
        </div>
      </div>

      {/* 小螢幕：右欄內容顯示在主欄下方 */}
      <div className="lg:hidden">
        {right}
      </div>

      {/* 底部 Tab 導覽 */}
      <div style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
        {bottom}
      </div>
    </div>
  )
}
