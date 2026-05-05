import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { MealEntry } from '../types'

interface AlmanacHeaderProps {
  entries?: MealEntry[]
}

const SOLAR_TERMS: Array<{ from: string; to: string; yi: string; ji: string }> = [
  { from: '01-06', to: '01-19', yi: '養腎、食黑', ji: '貪涼、熬夜' },
  { from: '01-20', to: '02-03', yi: '補陽、食溫', ji: '生冷、久坐' },
  { from: '02-04', to: '02-18', yi: '踏青、食辛', ji: '暴飲、急躁' },
  { from: '02-19', to: '03-05', yi: '疏肝、食苦', ji: '飲酒、久臥' },
  { from: '03-06', to: '03-20', yi: '養肝、食酸', ji: '動怒、油膩' },
  { from: '03-21', to: '04-04', yi: '調氣、多蔬', ji: '寒飲、大怒' },
  { from: '04-05', to: '04-19', yi: '舒肝、食清', ji: '暴食、怒氣' },
  { from: '04-20', to: '05-05', yi: '舒肝、食辛', ji: '多鹽、大怒' },
  { from: '05-06', to: '05-20', yi: '養心、食苦', ji: '貪涼、急躁' },
  { from: '05-21', to: '06-05', yi: '健脾、食薏', ji: '暴曬、濕熱' },
  { from: '06-06', to: '06-20', yi: '清熱、食綠', ji: '貪食、久曬' },
  { from: '06-21', to: '07-06', yi: '養心、食瓜', ji: '冰冷、飲酒' },
  { from: '07-07', to: '07-22', yi: '消暑、食淡', ji: '油膩、烈日' },
  { from: '07-23', to: '08-06', yi: '養脾、食涼', ji: '過勞、暴熱' },
  { from: '08-07', to: '08-22', yi: '潤肺、食辛', ji: '貪涼、悲秋' },
  { from: '08-23', to: '09-07', yi: '養肺、食白', ji: '油炸、熬夜' },
  { from: '09-08', to: '09-22', yi: '潤燥、食梨', ji: '寒涼、大怒' },
  { from: '09-23', to: '10-07', yi: '調養、多果', ji: '暴食、憂思' },
  { from: '10-08', to: '10-22', yi: '補氣、食棗', ji: '貪涼、久濕' },
  { from: '10-23', to: '11-06', yi: '補脾、食柿', ji: '過辣、冷食' },
  { from: '11-07', to: '11-21', yi: '補腎、食黑', ji: '貪涼、過勞' },
  { from: '11-22', to: '12-06', yi: '溫補、食羊', ji: '生冷、熬夜' },
  { from: '12-07', to: '12-21', yi: '養腎、藏精', ji: '暴飲、大汗' },
  { from: '12-22', to: '12-31', yi: '補元、食湯', ji: '過涼、透支' },
  { from: '01-01', to: '01-05', yi: '補元、食湯', ji: '過涼、透支' },
]

function getSolarTermYiJi(): { yi: string; ji: string } {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const today = `${mm}-${dd}`

  for (const term of SOLAR_TERMS) {
    if (today >= term.from && today <= term.to) {
      return { yi: term.yi, ji: term.ji }
    }
  }
  return { yi: '均衡飲食', ji: '過食偏補' }
}

function getPersonalizedYiJi(entries: MealEntry[]): { yi: string; ji: string } {
  const base = getSolarTermYiJi()
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recent = entries.filter(e => e.timestamp >= sevenDaysAgo)
  const karmaCount = recent.filter(e => e.result.quadrant === 'karma-debt').length

  if (karmaCount >= 3) {
    const allChemicals = recent
      .filter(e => e.result.quadrant === 'karma-debt')
      .flatMap(e => e.result.components.flatMap(c => c.chemicals))
    const freq: Record<string, number> = {}
    allChemicals.forEach(c => { freq[c] = (freq[c] || 0) + 1 })
    const topChemical = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''

    const remedyMap: Record<string, string> = {
      '動物脂肪': '選清淡食物，多走動消耗油脂',
      '精製澱粉': '補充蛋白質對抗飢餓',
      '動物蛋白質': '配合蔬菜均衡營養',
      '飽和脂肪': '多運動提升代謝',
    }
    return {
      yi: remedyMap[topChemical] ?? base.yi,
      ji: base.ji,
    }
  }

  return base
}

function getTodayLunar(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()

  const heavenly = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const earthly = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  const yearIndex = (year - 4) % 60
  const stem = heavenly[yearIndex % 10]
  const branch = earthly[yearIndex % 12]

  const monthNames = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
  const dayNames = [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
  ]
  const approxDay = Math.min(((day + 14) % 30), 29)
  return `${stem}${branch}年${monthNames[month - 1]}月${dayNames[approxDay]}`
}

export default function AlmanacHeader({ entries = [] }: AlmanacHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { yi, ji } = getPersonalizedYiJi(entries)
  const lunarDate = getTodayLunar()

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setMounted(false), 350)
  }

  return (
    <>
      {/* 桌面：24px 收合條 */}
      <div className="hidden lg:flex" style={{ flexDirection: 'column', alignItems: 'center', height: '100%' }}>
        <div
          onClick={() => setIsOpen(true)}
          style={{
            width: '24px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRight: '3px double var(--color-ink)',
            background: 'var(--color-parchment)',
            gap: '8px',
          }}
        >
          <div style={{
            writingMode: 'vertical-rl',
            fontFamily: 'var(--font-serif)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--color-vermillion)',
            letterSpacing: '0.2em',
            userSelect: 'none',
          }}>
            食癒
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-outline)' }}>〉</div>
        </div>
      </div>

      {/* 桌面：CSS transition 滑入面板（portal 至 body 避免 grid 截切）*/}
      {mounted && createPortal(
        <>
          <div
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              background: 'rgba(38,24,22,0.15)',
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          />

          <div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              width: '180px',
              zIndex: 41,
              background: 'var(--color-parchment)',
              borderRight: '3px double var(--color-ink)',
              boxShadow: '6px 0 24px rgba(38,24,22,0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '24px 12px',
              gap: '20px',
              transform: isOpen ? 'translateX(0)' : 'translateX(-180px)',
              transition: 'transform 0.32s ease-out',
            }}
          >
            <div
              style={{
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 0.2s ease 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                width: '100%',
                height: '100%',
              }}
            >
              <div style={{
                writingMode: 'vertical-rl',
                fontFamily: 'var(--font-serif)',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-vermillion)',
                letterSpacing: '0.15em',
                lineHeight: 1.4,
              }}>
                食癒圖鑑今日轉運
              </div>

              <div style={{ writingMode: 'vertical-rl', fontSize: '13px', color: 'var(--color-inkwash)', letterSpacing: '0.1em' }}>
                {lunarDate}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                <div className="border-almanac" style={{ padding: '8px', textAlign: 'center' }}>
                  <div className="label-yi" style={{ marginBottom: '6px' }}>宜</div>
                  <div style={{ writingMode: 'vertical-rl', fontSize: '14px', color: 'var(--color-fortune-green)', lineHeight: 1.6 }}>
                    {yi}
                  </div>
                </div>
                <div className="border-almanac" style={{ padding: '8px', textAlign: 'center' }}>
                  <div className="label-ji" style={{ marginBottom: '6px' }}>忌</div>
                  <div style={{ writingMode: 'vertical-rl', fontSize: '14px', color: 'var(--color-vermillion)', lineHeight: 1.6 }}>
                    {ji}
                  </div>
                </div>
              </div>

              <div
                onClick={handleClose}
                style={{ fontSize: '11px', color: 'var(--color-outline)', letterSpacing: '0.15em', cursor: 'pointer', userSelect: 'none' }}
              >
                〈 收起
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* 手機/平板：頂部橫條 */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b-2 border-double border-[--color-ink] bg-[--color-parchment]">
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--color-vermillion)', letterSpacing: '0.1em' }}>
          食癒圖鑑今日轉運
        </div>
        <div className="flex gap-2 text-xs">
          <span className="label-yi">宜 {yi}</span>
          <span className="label-ji">忌 {ji}</span>
        </div>
      </div>
    </>
  )
}
