import { motion, AnimatePresence } from 'framer-motion'
import type { FoodCharm } from '../types'

interface FortuneCharmProps {
  charm: FoodCharm
  visible: boolean
  onDismiss: () => void
}

export default function FortuneCharm({ charm, visible, onDismiss }: FortuneCharmProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="charm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onDismiss}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(38,24,22,0.4)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {/* 蓋章效果：先放大後縮至正常 */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              background: '#b22222',
              width: '160px',
              minHeight: '420px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px 16px',
              boxShadow: '4px 4px 0 rgba(38,24,22,0.4)',
              border: '4px double #8f000d',
              gap: '12px',
            }}
          >
            <div style={{ width: '100%', height: '2px', background: 'rgba(255,248,247,0.4)' }} />

            <div
              style={{
                writingMode: 'vertical-rl',
                fontFamily: 'var(--font-serif)',
                fontSize: '20px',
                fontWeight: 700,
                color: '#fff8f7',
                letterSpacing: '0.2em',
                lineHeight: 1.4,
                textAlign: 'center',
              }}
            >
              {charm.title}
            </div>

            <div style={{ width: '100%', height: '1px', background: 'rgba(255,248,247,0.3)' }} />

            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '13px',
                color: '#fff8f7',
                lineHeight: 2.2,
                letterSpacing: '0.08em',
                whiteSpace: 'pre-line',
                textAlign: 'center',
                flex: 1,
              }}
            >
              {charm.poem}
            </div>

            <div style={{ width: '100%', height: '1px', background: 'rgba(255,248,247,0.3)' }} />

            <div style={{ fontSize: '10px', color: 'rgba(255,248,247,0.8)', textAlign: 'center', lineHeight: 1.6, letterSpacing: '0.05em' }}>
              {charm.remediation.split(' · ').map((item, i) => (
                <div key={i}>・{item}</div>
              ))}
            </div>

            <div style={{ width: '100%', height: '2px', background: 'rgba(255,248,247,0.4)' }} />

            <div style={{ fontSize: '10px', color: 'rgba(255,248,247,0.5)', letterSpacing: '0.2em' }}>點擊收起</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
