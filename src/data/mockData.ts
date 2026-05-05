import type { FoodAnalysisResult, MealEntry } from '../types'

interface MockFoodEntry {
  components: { name: string; chemicals: string[]; physicalImpact: number }[]
  mentalModifier: number
  clashTrigger?: string[]
  charm: FoodAnalysisResult['charm']
}

export const MOCK_FOOD_DB: Record<string, MockFoodEntry> = {
  '排骨便當': {
    components: [
      { name: '白米飯', chemicals: ['精製澱粉', '動物脂肪'], physicalImpact: -35 },
      { name: '排骨', chemicals: ['動物蛋白質', '飽和脂肪'], physicalImpact: -15 },
      { name: '白菜', chemicals: ['纖維素', '維生素C'], physicalImpact: 10 },
    ],
    mentalModifier: -5,
    charm: {
      title: '業障初現，警示之兆',
      poem: '精製白飯堆積體脂\n動物油脂纏繞血管\n纖維雖在難以抵擋\n轉運需從明日做起',
      remediation: '宜 飯後步行20分鐘 · 晚餐選清蒸食物 · 補充膳食纖維',
    },
  },
  '水果優格': {
    components: [
      { name: '新鮮水果', chemicals: ['維生素C', '膳食纖維', '天然果糖'], physicalImpact: 30 },
      { name: '益生菌優格', chemicals: ['益生菌', '鈣質', '乳糖'], physicalImpact: 25 },
    ],
    mentalModifier: 15,
    charm: {
      title: '福澤綿延，大吉之象',
      poem: '水果清甜滋養五臟\n益生菌群護佑腸道\n鈣質充盈骨骼強健\n今日飲食功德圓滿',
      remediation: '宜 維持此飲食習慣 · 多嘗試彩虹蔬果 · 補充優質蛋白',
    },
  },
  '深夜麻辣鍋': {
    components: [
      { name: '麻辣湯底', chemicals: ['酒精', '辣椒素', '高鈉辛香料'], physicalImpact: -30 },
      { name: '牛肉片', chemicals: ['嘌呤', '飽和脂肪酸'], physicalImpact: -10 },
      { name: '精製澱粉類', chemicals: ['精製澱粉', '單寧酸'], physicalImpact: -20 },
    ],
    mentalModifier: -10,
    charm: {
      title: '業障深重，急需化解',
      poem: '深夜麻辣灼傷腸胃\n辣椒素擾亂睡眠品質\n高鈉水腫業障纏身\n轉運需從戒宵夜始',
      remediation: '忌 宵夜大量飲水偌2000ml · 明早補充水果優格 · 週末清腸排毒',
    },
  },
  '心情極差的一口蛋糕': {
    components: [
      { name: '蛋糕', chemicals: ['精製糖', '蛋白質', '動物脂肪'], physicalImpact: -25 },
    ],
    mentalModifier: 30,
    charm: {
      title: '必要之惡，赦免安慰',
      poem: '精製糖分雖傷身體\n心靈撫慰不可或缺\n甜蜜滋味解憂一時\n下次記得選擇黑巧克力',
      remediation: '宜 好好休息 · 明日補充10分鐘運動 · 允許自己偶爾軟弱',
    },
  },
  '水煮雞胸': {
    components: [
      { name: '雞胸肉', chemicals: ['完全蛋白質', '必需胺基酸', '低脂肪'], physicalImpact: 40 },
      { name: '蔬菜', chemicals: ['礦物質', '膳食纖維', '維生素B群'], physicalImpact: 20 },
    ],
    mentalModifier: -15,
    charm: {
      title: '苦行之路，讚美意志',
      poem: '雞胸清淡考驗意志\n完全蛋白強健肌肉\n雖無滋味卻有功德\n苦行僧道終得正果',
      remediation: '宜 加入蒜頭薑絲提味 · 搭配優質澱粉補充能量 · 允許週末獎勵自己',
    },
  },
  '燕麥粥': {
    components: [
      { name: '燕麥', chemicals: ['β-葡聚糖', '膳食纖維', '複合澱粉'], physicalImpact: 35 },
      { name: '牛奶', chemicals: ['鈣離子', '維生素D', '乳清蛋白'], physicalImpact: 20 },
    ],
    mentalModifier: 10,
    charm: {
      title: '福澤深厚，平安之象',
      poem: '燕麥纖維護衛腸道\nβ-葡聚糖穩定血糖\n鈣質充盈活力滿滿\n今日飲食大吉大利',
      remediation: '宜 加入堅果增加好脂肪 · 搭配水果補充維生素 · 持續此健康習慣',
    },
  },
  '酒後宵夜鹹酥雞': {
    components: [
      { name: '鹹酥雞', chemicals: ['酒精', '精製澱粉', '動物脂肪'], physicalImpact: -40 },
      { name: '炸物配料', chemicals: ['酒精殘留', '高鈉'], physicalImpact: -30 },
    ],
    mentalModifier: -20,
    clashTrigger: ['酒精', '高鈉'],
    charm: {
      title: '業障極重，緊急警示',
      poem: '酒後油炸雙重業障\n酒精油脂同時代謝\n深夜腸胃苦不堪言\n明日必見水腫報應',
      remediation: '忌 立刻補水500ml · 明早空腹喝溫熱水 · 本週禁止深夜飲食 · 週末排毒',
    },
  },
}

const now = Date.now()
const day = 24 * 60 * 60 * 1000

export const MOCK_HISTORY: MealEntry[] = [
  {
    id: 'hist-1',
    timestamp: now - 6 * day,
    rawInput: '燕麥粥',
    mood: '喜',
    result: {
      rawInput: '燕麥粥',
      components: [
        { name: '燕麥', chemicals: ['β-葡聚糖', '膳食纖維', '複合澱粉'] },
        { name: '牛奶', chemicals: ['鈣離子', '維生素D', '乳清蛋白'] },
      ],
      physicalScore: 55,
      mentalScore: 50,
      quadrant: 'great',
      charm: MOCK_FOOD_DB['燕麥粥'].charm,
    },
  },
  {
    id: 'hist-2',
    timestamp: now - 5 * day,
    rawInput: '排骨便當',
    mood: '累',
    result: {
      rawInput: '排骨便當',
      components: [
        { name: '白米飯', chemicals: ['精製澱粉', '動物脂肪'] },
        { name: '排骨', chemicals: ['動物蛋白質', '飽和脂肪'] },
        { name: '白菜', chemicals: ['纖維素', '維生素C'] },
      ],
      physicalScore: -40,
      mentalScore: -45,
      quadrant: 'karma-debt',
      charm: MOCK_FOOD_DB['排骨便當'].charm,
    },
  },
  {
    id: 'hist-3',
    timestamp: now - 4 * day,
    rawInput: '心情極差的一口蛋糕',
    mood: '怒',
    result: {
      rawInput: '心情極差的一口蛋糕',
      components: [
        { name: '蛋糕', chemicals: ['精製糖', '蛋白質', '動物脂肪'] },
      ],
      physicalScore: -25,
      mentalScore: 10,
      quadrant: 'necessary-evil',
      charm: MOCK_FOOD_DB['心情極差的一口蛋糕'].charm,
    },
  },
  {
    id: 'hist-4',
    timestamp: now - 3 * day,
    rawInput: '水煮雞胸',
    mood: '平',
    result: {
      rawInput: '水煮雞胸',
      components: [
        { name: '雞胸肉', chemicals: ['完全蛋白質', '必需胺基酸', '低脂肪'] },
        { name: '蔬菜', chemicals: ['礦物質', '膳食纖維', '維生素B群'] },
      ],
      physicalScore: 60,
      mentalScore: -15,
      quadrant: 'ascetic',
      charm: MOCK_FOOD_DB['水煮雞胸'].charm,
    },
  },
  {
    id: 'hist-5',
    timestamp: now - 2 * day,
    rawInput: '水果優格',
    mood: '喜',
    result: {
      rawInput: '水果優格',
      components: [
        { name: '新鮮水果', chemicals: ['維生素C', '膳食纖維', '天然果糖'] },
        { name: '益生菌優格', chemicals: ['益生菌', '鈣質', '乳糖'] },
      ],
      physicalScore: 55,
      mentalScore: 55,
      quadrant: 'great',
      charm: MOCK_FOOD_DB['水果優格'].charm,
    },
  },
  {
    id: 'hist-6',
    timestamp: now - 1 * day,
    rawInput: '深夜麻辣鍋',
    mood: '累',
    result: {
      rawInput: '深夜麻辣鍋',
      components: [
        { name: '麻辣湯底', chemicals: ['酒精', '辣椒素', '高鈉辛香料'] },
        { name: '牛肉片', chemicals: ['嘌呤', '飽和脂肪酸'] },
        { name: '精製澱粉類', chemicals: ['精製澱粉', '單寧酸'] },
      ],
      physicalScore: -80,
      mentalScore: -40,
      quadrant: 'karma-debt',
      clashWarning: '深夜攝取酒精與精製澱粉相剋，代謝負擔加重',
      charm: MOCK_FOOD_DB['深夜麻辣鍋'].charm,
    },
  },
]
