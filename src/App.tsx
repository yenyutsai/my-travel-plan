/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Bus, 
  Train, 
  Plane, 
  Bed, 
  CheckCircle2, 
  Navigation, 
  Utensils, 
  ChevronRight,
  ArrowLeft,
  CloudSun,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Info,
  Wallet,
  Coins,
  ExternalLink,
  Calendar,
  Map as MapIcon,
  Clock,
  Trophy,
  Award,
  Music,
  Waves,
  Sparkles,
  Coffee,
  Home,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---

interface TimelineItem {
  time: string;
  title: string;
  detail: string;
  transport?: string;
  amount?: number; // JPY
  type: 'transport' | 'spot' | 'food' | 'task';
  sop?: string[];
  label?: { text: string; color: 'red' | 'green' };
  payment?: string;
  isGlory?: boolean;
  hasCoupon?: boolean;
  timerLabel?: string;
}

interface DayData {
  id: number;
  date: string;
  weekday: string;
  title: string;
  route: string;
  highlights: string;
  theme: 'nature' | 'urban';
  timeline: TimelineItem[];
  stamps?: string[];
  topWarning?: string;
  specialCard?: {
    title: string;
    items: string[];
    tips?: string;
  };
  accommodation?: {
    name: string;
    mapUrl: string;
    price?: string;
  };
  survivalNotes?: {
    type: 'evening' | 'stamp' | 'luggage' | 'sop' | 'food';
    title: string;
    items: string[];
  }[];
}

// --- Data ---

const ITINERARY_DATA: DayData[] = [
  {
    id: 0,
    date: '4/23',
    weekday: '日',
    title: '抵達紀伊田邊',
    route: '機場 -> 紀伊田邊',
    highlights: '抵達日本、移動至熊野門戶',
    theme: 'urban',
    accommodation: {
      name: 'Dormy Inn Premium 和歌山',
      mapUrl: 'https://maps.google.com/0'
    },
    timeline: [
      { time: '15:40', title: '台北飛大阪 (D7378)', detail: '桃園機場 TPE 出發', type: 'transport' },
      { time: '19:20', title: '抵達關西機場 (KIX)', detail: '辦理入境手續', type: 'transport' },
      { time: '20:40', title: 'JR 關空快速', detail: '往和歌山/田邊方向', transport: 'JR 關空快速', amount: 900, type: 'transport', sop: ['日根野站轉乘 (注意車廂拆分)', '對面月台轉乘往和歌山方向'] },
      { time: '22:30', title: '抵達紀伊田邊', detail: '民宿 Check-in', type: 'spot' },
    ],
    survivalNotes: [
      { type: 'evening', title: '晚上任務', items: ['買 2L 飲用水', '確認明早 06:04 車次', '準備登山裝備'] }
    ]
  },
  {
    id: 1,
    date: '4/24',
    weekday: '一',
    title: '熊野古道中邊路',
    route: '瀧尻王子 -> 近露王子',
    highlights: '經典中邊路精華、地獄爬坡、森林石階',
    theme: 'nature',
    accommodation: {
      name: '熊野古道宿 G 近露',
      mapUrl: 'https://maps.google.com/1',
      price: '1人 ¥7,700 (不含餐)'
    },
    timeline: [
      { 
        time: '06:04 - 07:48', 
        title: 'JR 紀勢本線 (紀伊國線)', 
        detail: '和歌山站 → 紀伊田邊站 (直通免轉乘)。搶先機！07:48 抵達可避開大阪特急人潮，悠哉去 LAWSON 買早餐。', 
        transport: 'JR', 
        amount: 1520, 
        type: 'transport',
        payment: '刷 ICOCA / Suica'
      },
      { 
        time: '07:48 - 08:32', 
        title: '紀伊田邊站整備', 
        detail: '觀光中心領地圖 (08:00開)、補給飯糰、廁所整理裝備。', 
        type: 'task' 
      },
      { 
        time: '08:32 - 09:10', 
        title: '巴士接駁 (明光巴士 95 號)', 
        detail: '紀伊田邊站 → 瀧尻王子。備案：08:37 龍神巴士 81 號。', 
        transport: 'Bus', 
        amount: 970, 
        type: 'transport' 
      },
      { 
        time: '09:30', 
        title: '正式起登：瀧尻王子', 
        detail: '蓋章 (聖域入口)、伸展。這天是「經典中邊路精華」，約 14-15 km。', 
        type: 'spot',
        label: { text: '地獄爬坡', color: 'red' }
      },
      { 
        time: '11:30', 
        title: '高原 (霧之里)', 
        detail: '挑戰地獄爬坡後的梯田展望。建議小休吃午餐 (田邊買的飯糰)。', 
        type: 'spot',
        label: { text: '森林石階', color: 'green' }
      },
      { 
        time: '14:30 - 15:30', 
        title: '抵達近露王子', 
        detail: '牛馬童子像、道之駅紅豆麻糬、森林石階古道。', 
        type: 'spot' 
      },
    ],
    survivalNotes: [
      { type: 'sop', title: '生存提醒', items: ['【裝備】樹根濕滑，需穿登山鞋。', '【安全】務必在 17:00 前抵達，天黑後近露巴士極少。', '【任務】收集「押印」記得帶本子。'] },
      { type: 'evening', title: '🛒 晚上任務', items: ['晚餐：笑路茶屋 -WARAJI CHAYA- https://maps.app.goo.gl/C9ohuUEuTai6QmyFA', '超市：A Coop Kumano Kodo Chikatsuyu（隔日行動糧 / 早餐） https://maps.app.goo.gl/sX4cbE25TqvVk446A'] }
    ]
  },
  {
    id: 2,
    date: '4/25',
    weekday: '二',
    title: '近露 → 發心門王子 → 熊野本宮大社',
    route: '近露 -> 繼櫻王子 -> 發心門',
    highlights: '野中之清水、古道深處、發心門鳥居',
    theme: 'nature',
    stamps: ['瀧尻', '近露', '繼櫻', '發心門'],
    accommodation: {
      name: 'Kumano Backpackers',
      mapUrl: 'https://maps.google.com/5',
      price: '1人 ¥4,500 (預估)'
    },
    timeline: [
      { 
        time: '07:30 - 08:30', 
        title: '早餐：KUMANOYASAI CAFE', 
        detail: '就在近露，這是今天最後一頓熱食，請務必吃飽。', 
        type: 'food' 
      },
      { 
        time: '08:30', 
        title: '正式起登 (Start)', 
        detail: '任務：【必做】近露王子蓋章。檢查水袋（至少 1.5L）。重要提醒：出發前務必將行李交給民宿老闆進行「行李轉運」託運。', 
        type: 'task' 
      },
      { 
        time: '09:40', 
        title: '繼櫻王子 / 野中之清水', 
        detail: '任務：【必做】蓋章。欣賞「一方杉」震撼景觀，補滿飲水。', 
        type: 'spot',
        label: { text: '震撼景觀', color: 'green' }
      },
      { 
        time: '11:00', 
        title: '小廣王子 (挑戰開始)', 
        detail: '備註：進入無補給的「小廣嶺」陡坡路段，注意調整呼吸。', 
        type: 'spot',
        label: { text: '無補給陡坡區', color: 'red' }
      },
      { 
        time: '12:30', 
        title: '蛇形地藏 (午餐小休)', 
        detail: '提醒：拿出田邊準備的行動糧，此段路程 4 小時內完全無自動販賣機。', 
        type: 'food' 
      },
      { 
        time: '15:00', 
        title: '抵達「發心門王子」 (Goal)', 
        detail: '任務：【必做】蓋章！這代表 38km 前半段高難度區完成。亮點：發心門鳥居非常美，建議休息拍照。', 
        type: 'spot' 
      },
      { 
        time: '15:30', 
        title: '巴士接駁 (龍神巴士)', 
        detail: '路線：發心門王子 → 本宮大社前。警告：16:30 為末班車，絕對不可錯過，否則需再走 2 小時下坡路。', 
        transport: 'Bus', 
        amount: 470, 
        type: 'transport' 
      },
    ],
    survivalNotes: [
      { type: 'sop', title: '聖雅各聯動任務', items: ['提醒拿出「西班牙護照 (Credential)」與熊野護照合照，體驗雙朝聖的靈性連結。'] },
      { type: 'stamp', title: '傍晚預選任務', items: ['[ ] 證書預審：若 17:00 前抵達，可先去「世界遺產本宮館」確認西班牙證書，為明日領證鋪路。', '[ ] 交通劃位：建議先在「熊野本宮前」巴士站確認 4/27 黑潮號指定席劃位。'] },
      { type: 'evening', title: '晚上清單', items: ['晚餐：宮ずし https://maps.app.goo.gl/uXvY6vXzXzXzXzXzX', '補給：KUMANO POWER HONGU (購買隔日早餐、能量飲料) https://maps.app.goo.gl/vYvY6vXzXzXzXzXzX'] }
    ]
  },
  {
    id: 3,
    date: '4/26',
    weekday: '三',
    title: '熊野本宮大社 → 發心門王子 → 領證儀式 → 湯之峰溫泉',
    route: '發心門王子 -> 本宮 -> 湯之峰',
    highlights: '領取雙朝聖證書、大齋原、壺湯體驗',
    theme: 'nature',
    accommodation: {
      name: 'J-Hoppers Kumano Yunomine',
      mapUrl: 'https://maps.app.goo.gl/VZApFg5EYwsKSmVk7',
      price: '已訂'
    },
    timeline: [
      { 
        time: '08:00 - 09:00', 
        title: '早餐與寄物', 
        detail: '建議在住宿處享用（周邊無便利店）。任務：退房並將大行李放置於大社前寄物櫃。', 
        type: 'task' 
      },
      { 
        time: '09:00 - 09:40', 
        title: '巴士接駁', 
        detail: '路線：本宮大社前 → 發心門王子 (龍神巴士)。', 
        transport: 'Bus', 
        amount: 470, 
        type: 'transport' 
      },
      { 
        time: '09:45 - 11:30', 
        title: '健行「公主之道」', 
        detail: '距離：約 7 km (下坡多，好走) | 終點：熊野本宮大社。', 
        type: 'spot' 
      },
      { 
        time: '11:45', 
        title: '慶祝午餐：鰻料理「鹿六」本宮店', 
        detail: '提醒：週日營業至 14:30，建議抵達後先拿號碼牌。 https://maps.app.goo.gl/bBbLPy3FBhAUAsFbA', 
        type: 'food' 
      },
      { 
        time: '13:00', 
        title: '榮耀時刻：世界遺產本宮館', 
        detail: '任務：出示證書/護照、填表審核、登錄名冊、敲響榮耀太鼓。', 
        type: 'spot',
        isGlory: true
      },
      { 
        time: '14:00', 
        title: '參拜大齋原', 
        detail: '亮點：巨大鳥居、黑色郵筒寄明信片 (完美結局)。', 
        type: 'spot' 
      },
      { 
        time: '14:30', 
        title: '晚餐採買：Hachiya 商店', 
        detail: '必買：めはり壽司、熊野地酒、生雞蛋(網袋裝)。 https://maps.app.goo.gl/ABpSwv6rKyPV2KqU7', 
        type: 'food' 
      },
      { 
        time: '15:00 - 15:30', 
        title: '移動至湯之峰溫泉', 
        detail: '交通：巴士或計程車 (約 10-15 分鐘)。', 
        transport: 'Bus', 
        amount: 400, 
        type: 'transport' 
      },
      { 
        time: '16:00', 
        title: '湯之峰溫泉體驗', 
        detail: '任務：【首要】預約壺湯 → 煮溫泉蛋 (湯筒) → 19:30 泡湯。', 
        type: 'spot',
        amount: 800
      },
      { 
        time: '18:00', 
        title: '慶功晚餐', 
        detail: '菜單：溫泉蛋 + めはり壽司 + 熊野地酒。', 
        type: 'food' 
      },
    ],
    specialCard: {
      title: '雙朝聖領證必備',
      items: [
        '[ ] 西班牙 Santiago 證書 或 蓋滿章的 Credential',
        '[ ] 熊野古道蓋章本 (需含：1.瀧尻 2.近露 3.發心門 4.本宮大社)'
      ],
      tips: '領證照片會留存一輩子，建議穿著朝聖裝備或紀念衫拍照。'
    },
    survivalNotes: [
      { type: 'sop', title: '「溫泉區」生存筆記', items: ['【零錢必備】購買煮蛋網袋或小店消費僅收硬幣。', '【毛巾自備】壺湯不提供毛巾，請從 J-Hoppers 帶去。', '【水分補充】泡完溫泉喝地酒雖爽，但務必補充純水。', '【D4 預告】J-Hoppers 溫泉粥 07:00 開始供應。'] }
    ]
  },
  {
    id: 4,
    date: '4/27',
    weekday: '四',
    title: '湯之峰溫泉 → 那智山 → 大阪難波',
    route: '本宮 -> 那智 -> 大阪',
    highlights: '那智大社、瀑布、黑潮號海景',
    theme: 'nature',
    accommodation: {
      name: 'Toho Hotel Namba Motomachi',
      mapUrl: 'https://maps.app.goo.gl/2vpeKcDNfWQwvHcF8',
      price: '大國町站 2號出口'
    },
    timeline: [
      { 
        time: '07:00', 
        title: '早餐與退房', 
        detail: '享用 J-Hoppers 溫泉粥，隨即出發。', 
        type: 'food' 
      },
      { 
        time: '08:14 - 09:21', 
        title: '巴士：湯之峰 → 新宮站', 
        detail: '交通：熊野御坊南海巴士 (53號)。提醒：認明「新宮駅行き」標示，此路線最省時。', 
        transport: 'Bus', 
        amount: 1540, 
        type: 'transport' 
      },
      { 
        time: '09:44 - 10:09', 
        title: 'JR 鐵道：新宮 → 紀伊勝浦', 
        detail: '【專業提醒】務必坐在前進方向「左側」靠窗位，欣賞太平洋海景。SOP：抵達新宮後先劃位「黑潮號」指定席。', 
        transport: 'JR', 
        amount: 240, 
        type: 'transport',
        label: { text: '海景段', color: 'green' }
      },
      { 
        time: '10:10 - 10:25', 
        title: '紀伊勝浦站：存行李與買票', 
        detail: 'SOP：衝出站 → 車站置物櫃存大行李 → 窗口購買「那智山往返券 (¥1,100)」。', 
        type: 'task' 
      },
      { 
        time: '10:25 - 10:45', 
        title: '巴士：紀伊勝浦 → 大門坂', 
        detail: '前往那智山入口。', 
        transport: 'Bus', 
        type: 'transport' 
      },
      { 
        time: '10:45 - 13:00', 
        title: '那智山精華路徑', 
        detail: '大門坂石階、那智大社、青岸渡寺、三重塔、那智大瀑布 (133m 落差)。', 
        type: 'spot' 
      },
      { 
        time: '13:00', 
        title: '午餐與甜點', 
        detail: '美瀧庵蕎麥麵、必吃「黑糖霜淇淋」。', 
        type: 'food' 
      },
      { 
        time: '14:31', 
        title: '關鍵下山巴士', 
        detail: '那智の滝前 → 紀伊勝浦 (接續黑潮號的最後保險)。', 
        transport: 'Bus', 
        type: 'transport',
        label: { text: '最後防線', color: 'red' }
      },
      { 
        time: '15:51 - 19:33', 
        title: '特急黑潮 32 號：紀伊勝浦 → 天王寺', 
        detail: '3.5小時車程，建議購買「鮪魚便當」上車吃。', 
        transport: 'JR', 
        amount: 7500, 
        type: 'transport' 
      },
      { 
        time: '20:30', 
        title: '抵達飯店', 
        detail: '大國町站 → Toho Hotel Namba Motomachi。交通：天王寺站轉地鐵御堂筋線 → 大國町站。', 
        type: 'spot' 
      },
    ],
    specialCard: {
      title: '那智精華 Checklist',
      items: [
        '[ ] 夫婦杉合照',
        '[ ] 樟靈社胎內巡禮',
        '[ ] 三重塔+瀑布經典合影',
        '[ ] 喝延命水/吃黑糖霜淇淋'
      ]
    },
    survivalNotes: [
      { type: 'luggage', title: '行李 SOP', items: ['紀伊勝浦站置物櫃多，務必輕裝上山。'] },
      { type: 'sop', title: '現金提醒', items: ['那智山區小店多半只收現金。'] },
      { type: 'food', title: '便當推薦', items: ['紀伊勝浦站對面「川柳」的鮪魚便當 (¥1,080)。'] }
    ]
  },
  {
    id: 5,
    date: '4/28',
    weekday: '五',
    title: '堺市大鳥大社 → 空堀商店街 → 難波美食',
    route: '難波 -> 堺市 -> 空堀',
    highlights: '大鳥大社、老屋散策、未來御守',
    theme: 'urban',
    accommodation: {
      name: 'Toho Hotel Namba Motomachi',
      mapUrl: 'https://maps.app.goo.gl/2vpeKcDNfWQwvHcF8',
      price: '大國町站 2號出口'
    },
    timeline: [
      { 
        time: '09:30 - 10:15', 
        title: '難波出發 → 大鳥大社', 
        detail: '路線：JR 難波 → 天王寺 (轉乘) → 鳳站 (Otori)。SOP 轉乘祕訣：在天王寺轉乘 JR 阪和線時，必搭「快速」列車，鳳站是大站，搭快速可省 10 分鐘。', 
        transport: 'JR', 
        amount: 530, 
        type: 'transport' 
      },
      { 
        time: '10:15 - 13:00', 
        title: '大鳥大社參拜 (和泉國一之宮)', 
        detail: '靈氣亮點：購買「透明看見未來御守」；神木參拜：祈福金牌氛圍極其神聖。午餐：鳳站周邊在地拉麵或簡餐。', 
        type: 'spot',
        label: { text: '未來御守', color: 'green' }
      },
      { 
        time: '13:00 - 14:00', 
        title: '大鳥大社 → 空堀商店街', 
        detail: '路線：JR 鳳站 → 天王寺 (轉地鐵) → 谷町六丁目站。', 
        transport: 'Train', 
        amount: 510, 
        type: 'transport' 
      },
      { 
        time: '14:00 - 17:00', 
        title: '老屋散策：空堀商店街', 
        detail: '亮點：二戰倖存老建築文創空間「惣 (Sou)、練 (Len)、萌 (Hou)」。體驗：在昭和懷舊風的老建築內享用下午茶，感受慢活大阪。', 
        type: 'spot',
        label: { text: '文創老屋', color: 'green' }
      },
      { 
        time: '17:00 - 19:00', 
        title: '晚餐：天婦羅 太郎次郎', 
        detail: '特色：難波高評價 (4.3星) 現炸清爽天婦羅。', 
        type: 'food' 
      },
      { 
        time: '19:00+', 
        title: '心齋橋/道頓堀自由時間', 
        detail: '宵夜推薦：さかえすし (Sakae Sushi) 玉屋町店。 https://maps.app.goo.gl/bTmRV1GQCQcHP5wR9', 
        type: 'food' 
      },
    ],
    specialCard: {
      title: '備選方案',
      items: [
        '若想改走現代文藝風，可續搭地鐵至「中崎町」。'
      ]
    },
    survivalNotes: [
      { type: 'sop', title: '交通提醒', items: ['JR 難波站步行約 10 分鐘，記得預留走去車站的時間。'] },
      { type: 'sop', title: '拍照建議', items: ['大鳥大社的神木金牌區非常有層次感，建議使用人像模式拍攝。'] },
      { type: 'food', title: '美食提醒', items: ['天婦羅太郎次郎 17:00 開始營業，建議準時抵達免排隊。'] }
    ]
  },
  {
    id: 6,
    date: '4/29',
    weekday: '六',
    title: '京都清水寺 → 東山散策 → 梅田藥妝',
    route: '大阪 <-> 京都',
    highlights: '清水寺、八坂神社、梅田藥妝掃貨',
    theme: 'urban',
    topWarning: '【一哥精算：黃金週生存對策】4/29 為日本昭和之日，京都交通極度繁忙，請嚴格執行避人潮 SOP。',
    accommodation: {
      name: 'Toho Hotel Namba Motomachi',
      mapUrl: 'https://maps.app.goo.gl/2vpeKcDNfWQwvHcF8',
      price: '今日總預算 ¥1,270 (交通)'
    },
    timeline: [
      { 
        time: '08:30 - 10:00', 
        title: '難波出發 → 京都清水寺', 
        detail: '路線：大國町 (地鐵) → 淀屋橋 (轉乘京阪電鐵特急) → 清水五条站。絕對避開公車！若清水五条站外公車站排隊過長，建議直接搭計程車 (約 ¥700-900) 或是步行 15 分鐘上坡。', 
        transport: 'Train', 
        amount: 620, 
        type: 'transport' 
      },
      { 
        time: '10:00 - 11:30', 
        title: '第一站：清水寺參拜', 
        detail: '亮點：清水舞台、音羽瀑布（喝智慧/健康/長壽水）。', 
        type: 'spot' 
      },
      { 
        time: '10:45', 
        title: '飲食登記黃金時間', 
        detail: '鎖定奧丹湯豆腐、葫蘆親子丼。必須在此時抵達店家探路或登記位子，否則預計等待 2 小時。', 
        type: 'task',
        timerLabel: '飲食登記黃金時間'
      },
      { 
        time: '11:30 - 13:00', 
        title: '中午必吃：京都指標美食', 
        detail: '奧丹清水 (湯豆腐) 或 ひさご (葫蘆親子丼)。預留等待時間標記：黃金週預計 2 小時。', 
        type: 'food' 
      },
      { 
        time: '13:00 - 15:30', 
        title: '東山下坡散步', 
        detail: '路線：二三年坂 → 八坂塔 → 八坂庚申堂 → 石塀小路。一路走下坡，體力換美景。', 
        type: 'spot' 
      },
      { 
        time: '15:30 - 17:30', 
        title: '祇園與鴨川', 
        detail: '景點：八坂神社、花見小路 (看藝伎)、鴨川邊吹風感受納涼床氛圍。', 
        type: 'spot' 
      },
      { 
        time: '18:00 - 19:00', 
        title: '京都 → 梅田 (阪急電鐵)', 
        detail: '路線：京都河原町 → 大阪梅田 (特急直達)。', 
        transport: 'Train', 
        amount: 410, 
        type: 'transport' 
      },
      { 
        time: '19:00', 
        title: '梅田藥妝戰場啟動', 
        detail: '大國藥妝梅田旗艦店 (準備護照退稅)。大型液體類建議在此採買後直接回飯店。', 
        type: 'task',
        timerLabel: '梅田藥妝戰場啟動',
        hasCoupon: true
      },
      { 
        time: '19:00 - 21:00', 
        title: '梅田戰場：藥妝掃貨與晚餐', 
        detail: '晚餐：神座拉麵 或 龜王拉麵。', 
        type: 'food' 
      },
      { 
        time: '21:00', 
        title: '返回飯店', 
        detail: '梅田 (地鐵御堂筋線) → 大國町站。', 
        transport: 'Subway', 
        amount: 240, 
        type: 'transport' 
      },
    ],
    specialCard: {
      title: '互動 Checklist',
      items: [
        '[ ] 清水大舞台拍照',
        '[ ] 喝音羽瀑布泉水',
        '[ ] 八坂庚申堂拍彩色猴子',
        '[ ] 鴨川邊吹風'
      ]
    },
    survivalNotes: [
      { type: 'sop', title: '【交通：絕對避開公車】', items: ['4/29 京都路面交通慘烈。SOP：清水五条站下車步行上山，回程河原町搭阪急。', '警告：嚴禁在京都車站等公車，預計節省 1 小時以上排隊時間。'] },
      { type: 'sop', title: '【飲食：提前登錄策略】', items: ['鎖定奧丹湯豆腐、葫蘆親子丼。', '策略：必須在 10:45 - 11:00 前抵達店家探路或登記位子，否則預計等待 2 小時。'] },
      { type: 'sop', title: '【儲值：前導作業】', items: ['前一晚在難波站將 ICOCA 儲值至少 ¥3,000。', '好處：避開京都車站人工與機器儲值的排隊人潮。'] },
      { type: 'sop', title: '黃金週警告', items: ['4/29 景點人潮極多，建議 08:30 前準時出發以搶佔清水寺先機。'] },
      { type: 'sop', title: '步行建議', items: ['今日為全步行散策，建議穿著 D1-D2 健行時的舒適鞋款。'] }
    ]
  },
  {
    id: 7,
    date: '4/30',
    weekday: '日',
    title: '箕面勝尾寺 → 慶功壽喜燒 → 關西機場',
    route: '箕面 -> 難波 -> 關空',
    highlights: '勝利達摩、慶功壽喜燒、回程賦歸',
    theme: 'urban',
    accommodation: {
      name: '旅程圓滿達成',
      mapUrl: 'https://maps.app.goo.gl/VZApFg5EYwsKSmVk7',
      price: '今日總預算 ¥10,000 - ¥13,000'
    },
    timeline: [
      { 
        time: '08:10 - 08:50', 
        title: '出發：難波 → 箕面', 
        detail: '路線：地鐵御堂筋線 (直通北大阪急行) → 千里中央站。SOP：早上退房後，大行李直接拉到「南海難波站」3樓寄物櫃，輕裝前往箕面。', 
        transport: 'Subway', 
        amount: 500, 
        type: 'transport',
        label: { text: '行李先寄難波站', color: 'red' }
      },
      { 
        time: '09:10', 
        title: '平日最後保險：29號巴士', 
        detail: '關鍵：衝向「4號公車站」等候。平日 09:10 為關鍵班次，錯過建議直接改搭計程車 (約 ¥3,500) 以免毀掉後續行程。', 
        transport: 'Bus', 
        amount: 500, 
        type: 'transport',
        timerLabel: '巴士最後通牒'
      },
      { 
        time: '09:43 - 11:30', 
        title: '勝尾寺參拜 (勝利達摩)', 
        detail: '門票：¥500 | 亮點：找尋角落的小達摩、達摩奉納棚。', 
        type: 'spot',
        amount: 500
      },
      { 
        time: '11:30 - 13:00', 
        title: '箕面大瀑布', 
        detail: '建議：平日巴士極少，請寺前店員代叫計程車前往瀑布區 (約 ¥2,000/車)。', 
        type: 'spot',
        amount: 2000
      },
      { 
        time: '14:00', 
        title: '慶功宴：壽喜燒大餐', 
        detail: '地點：返回難波吃「壽喜燒 壹番」或「北むら」。朝聖完畢的最高級獎勵。', 
        type: 'food',
        amount: 6000
      },
      { 
        time: '15:30 - 17:00', 
        title: '南海難波站整備', 
        detail: '任務：領取行李、憑 QR Code 兌換 Rapi:t 實體票。', 
        type: 'task' 
      },
      { 
        time: '17:00 - 18:30', 
        title: '特急 Rapi:t 37 號', 
        detail: '路線：難波 → 關西機場。', 
        transport: 'Train', 
        amount: 1490, 
        type: 'transport' 
      },
      { 
        time: '18:30', 
        title: '關西機場報到與貴賓室', 
        detail: 'SOP：提前 2.5 小時抵達。JCB 貴賓室：搭接駁電車至「中間站」(1-16號登機門方向)，下樓即達「Annex 六甲」。', 
        type: 'spot' 
      },
      { 
        time: '20:55', 
        title: '飛機起飛', 
        detail: '帶領滿滿靈氣回台灣。', 
        type: 'transport' 
      },
    ],
    specialCard: {
      title: 'JCB 貴賓室：Annex 六甲',
      items: [
        '位置：第一航廈 2 樓 (出境後)',
        '前往方式：搭接駁電車至「中間站」',
        '下樓即達 (1-16號登機門方向)'
      ],
      tips: '憑 JCB 白金卡以上等級信用卡與登機證即可免費進入。'
    },
    survivalNotes: [
      { type: 'luggage', title: '行李 SOP', items: ['南海難波站 3 樓置物櫃多，務必先寄物再出發。'] },
      { type: 'sop', title: '平日生存提醒', items: ['箕面巴士平日班次極少，務必守時。', '計程車預備金 ¥5,000 建議留在身上。'] },
      { type: 'food', title: '慶功建議', items: ['壽喜燒壹番建議提前預約，或 14:00 離峰時段前往。'] }
    ]
  }
];

// --- Components ---

function FlightCard() {
  return (
    <div className="glass-card p-8 mb-10 relative overflow-hidden group">
      {/* Flight Path Animation */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-bronze/30 to-transparent pointer-events-none" />
      <motion.div
        className="absolute top-1/2 left-0 text-bronze/60"
        animate={{ 
          x: ['-10%', '110%'],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <Plane size={20} className="rotate-90" />
      </motion.div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8 text-bronze">
          <Plane size={20} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">航班資訊儀表板</span>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-bronze/20 text-bronze text-[10px] font-black">去程 D7378</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">4/23 (日)</span>
              </div>
              <p className="text-xl font-black text-white tracking-tight">15:40 TPE → 19:20 KIX</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-white/40">台北桃園</p>
              <p className="text-[10px] font-bold text-white/40">大阪關西</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-bronze/20 text-bronze text-[10px] font-black">回程 D7379</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">4/30 (日)</span>
              </div>
              <p className="text-xl font-black text-white tracking-tight">20:55 KIX → 22:55 TPE</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-white/40">大阪關西</p>
              <p className="text-[10px] font-bold text-white/40">台北桃園</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function BudgetDashboard() {
  return (
    <div className="glass-card p-8 mb-10 border-bronze/30">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-bronze/10">
          <Wallet size={18} className="text-bronze" />
        </div>
        <span className="text-xs font-black uppercase tracking-[0.3em] text-white/60">旅程預算精算</span>
      </div>
      
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-black text-bronze uppercase tracking-widest mb-1">總預算估計</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">¥83,700</h3>
          </div>
          <p className="text-lg font-black text-gold-pale/60 italic">≈ $31,742 TWD</p>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden flex shadow-inner">
          <div className="w-[25%] h-full bg-bronze shadow-[0_0_10px_rgba(168,139,74,0.5)]" />
          <div className="w-[20%] h-full bg-morandi" />
          <div className="w-[10%] h-full bg-rust" />
          <div className="w-[30%] h-full bg-gold-pale" />
          <div className="w-[15%] h-full bg-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { label: '機票費用', amount: '$7,400', color: 'bg-bronze' },
          { label: '住宿 (台幣)', amount: '$7,100', color: 'bg-morandi' },
          { label: '住宿 (日圓)', amount: '¥7,700', color: 'bg-rust' },
          { label: '交通預算', amount: '¥28,000', color: 'bg-gold-pale' },
          { label: '餐飲預算', amount: '¥40,000', color: 'bg-gold-pale' },
          { label: '門票雜支', amount: '¥8,000', color: 'bg-white/10' },
        ].map((cat, i) => (
          <div key={i} className="flex items-center gap-3 group">
            <div className={`w-1.5 h-6 rounded-full ${cat.color} group-hover:scale-y-125 transition-transform`} />
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{cat.label}</p>
              <p className="text-sm font-black text-white/90">{cat.amount}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 mb-6 text-gold-pale">
          <ShoppingBag size={18} />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">換匯清單 CHECK (需準備現金)</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {['民宿尾款', '交通票券', '靈氣聖物', '鄉下餐飲'].map((item, i) => (
            <motion.span 
              key={i} 
              whileHover={{ scale: 1.05 }}
              className="text-[10px] font-black bg-gold-pale/5 text-gold-pale/80 px-4 py-2 rounded-xl border border-gold-pale/10 tracking-widest"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryTable({ onSelectDay }: { onSelectDay: (id: number) => void }) {
  return (
    <div className="mb-12 relative z-10">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-xs font-black text-bronze uppercase tracking-[0.4em] flex items-center gap-3">
          <Calendar size={18} />
          朝聖行程總覽
        </h3>
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">D0 - D7</span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {ITINERARY_DATA.map((day) => (
          <motion.div 
            key={day.id} 
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectDay(day.id)}
            className="glass-card p-6 cursor-pointer group hover:border-bronze/50 transition-all bg-forest/40"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-bronze/10 border border-bronze/20 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black text-bronze leading-none mb-0.5">D{day.id}</span>
                  <span className="text-[8px] font-bold text-bronze/60 uppercase">{day.weekday}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 mb-0.5">{day.date}</p>
                  <h4 className="font-black text-white group-hover:text-bronze transition-colors">{day.title}</h4>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/20 group-hover:text-bronze transition-colors" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-white/40 leading-relaxed line-clamp-1">
                  {day.highlights}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
                <Bed size={10} className="text-bronze" />
                <span className="text-[9px] font-black text-bronze uppercase tracking-tighter">
                  {day.accommodation?.name.split(' ')[0]}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OverviewPage({ onSelectDay }: { onSelectDay: (id: number) => void }) {
  return (
    <div className="max-w-md mx-auto px-6 py-12 relative">
      {/* Mountain Background Illustration */}
      <div className="mountain-bg" />

      <FlightCard />
      <SummaryTable onSelectDay={onSelectDay} />
      <BudgetDashboard />
    </div>
  );
}

function StampProgressBar({ stamps }: { stamps: string[] }) {
  return (
    <div className="mb-8 glass-card p-6">
      <div className="flex items-center gap-2 mb-4 text-bronze">
        <CheckCircle2 size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">今日蓋章進度</span>
      </div>
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 z-0" />
        {stamps.map((stamp, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-forest border border-bronze flex items-center justify-center text-[10px] font-bold text-bronze shadow-lg shadow-black/50">
              印
            </div>
            <span className="text-[10px] font-bold text-white/40">{stamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailPage({ day, onBack }: { day: DayData, onBack: () => void }) {
  const isKyoto = day.id === 6;
  const isDay7 = day.id === 7;
  const isHiking = day.id >= 1 && day.id <= 3;
  
  return (
    <div className={`min-h-screen pb-24 text-white relative transition-colors duration-1000 ${
      isKyoto ? 'bg-gradient-to-b from-[#5D1916] via-[#2D1B1B] to-[#0A0A0F]' : 
      isDay7 ? 'bg-gradient-to-b from-[#8B0000] via-[#4A0000] to-[#1A0000]' : ''
    }`}>
      {/* Mountain Background Illustration */}
      <div className="mountain-bg" />

      {/* Urban Background Illustration */}
      {day.theme === 'urban' && !isDay7 && (
        <div className="fixed inset-0 pointer-events-none opacity-[0.05] overflow-hidden z-0">
          <svg viewBox="0 0 1000 1000" className="w-full h-full text-white fill-current">
            {/* Osaka Silhouette */}
            <path d="M400 1000 L400 800 L350 800 L350 700 L400 700 L400 600 L450 600 L450 500 L550 500 L550 600 L600 600 L600 700 L650 700 L650 800 L600 800 L600 1000 Z" />
            <path d="M700 1000 L700 600 L750 600 L750 550 L725 500 L775 500 L750 550 L750 600 L800 600 L800 1000 Z" opacity="0.5" />
          </svg>
        </div>
      )}

      {/* Daruma Watermark for Day 7 */}
      {isDay7 && (
        <div className="fixed inset-0 pointer-events-none opacity-[0.08] overflow-hidden z-0 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full max-w-lg text-white fill-current">
            <circle cx="100" cy="110" r="80" />
            <circle cx="100" cy="60" r="40" />
            <circle cx="80" cy="55" r="10" fill="black" />
            <circle cx="120" cy="55" r="10" fill="black" />
            <path d="M70 140 Q100 160 130 140" stroke="black" strokeWidth="5" fill="none" />
          </svg>
        </div>
      )}
      
      {/* Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-xl px-6 py-4 flex items-center justify-between border-b border-white/5 ${
        isKyoto || isDay7 ? 'bg-black/20' : 'bg-forest/80'
      }`}>
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors text-bronze">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-bronze">第 {day.id} 天 ({day.weekday})</p>
          <h2 className="font-bold text-white tracking-tight">{day.date} {day.title}</h2>
        </div>
        <div className="w-10" />
      </div>

      {/* Top Warning Banner */}
      {day.topWarning && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-[#8B0000] to-[#B8860B] px-6 py-3 flex items-start gap-3 shadow-lg relative z-40"
        >
          <AlertCircle size={18} className="text-white mt-0.5 flex-shrink-0" />
          <p className="text-[11px] font-black text-white leading-relaxed tracking-wide">
            {day.topWarning}
          </p>
        </motion.div>
      )}

      <div className="max-w-md mx-auto px-6 py-8 relative z-10">
        {/* Hiking Progress Bar */}
        {isHiking && (
          <div className="mb-8 px-2">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-bronze uppercase tracking-widest">朝聖進度</span>
              <span className="text-[10px] font-bold text-white/40">{day.id === 1 ? '35%' : day.id === 2 ? '75%' : '100%'}</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: day.id === 1 ? '35%' : day.id === 2 ? '75%' : '100%' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-bronze shadow-[0_0_10px_rgba(168,139,74,0.5)]"
              />
            </div>
          </div>
        )}

        {/* Stamp Progress Bar */}
        {day.stamps && <StampProgressBar stamps={day.stamps} />}

        {/* Special Certification Card */}
        {day.specialCard && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-bronze/20 to-gold-pale/10 border border-bronze/30 shadow-xl shadow-bronze/5 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-bronze/10 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 mb-4 text-bronze">
              <Award size={20} />
              <h3 className="font-black text-sm uppercase tracking-widest">{day.specialCard.title}</h3>
            </div>
            <ul className="space-y-3 mb-4">
              {day.specialCard.items.map((li, i) => {
                const isChecked = li.startsWith('[x]');
                const cleanLi = li.replace(/^\[[ x]\]/, '').trim();
                return (
                  <li key={i} className="flex items-start gap-3 text-xs font-bold text-white/90">
                    <div className="mt-0.5 w-4 h-4 rounded border border-bronze/50 flex items-center justify-center flex-shrink-0">
                      {isChecked && <CheckCircle2 size={10} className="text-bronze" />}
                    </div>
                    <span>{cleanLi}</span>
                  </li>
                );
              })}
            </ul>
            {day.specialCard.tips && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-medium text-white/60 italic">
                💡 {day.specialCard.tips}
              </div>
            )}
          </motion.div>
        )}

        {/* Accommodation Section */}
        {day.accommodation && (
          <div className="mb-8 p-6 glass-card flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1 text-bronze">
                <Bed size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">住宿資訊</span>
              </div>
              <h3 className="text-lg font-bold text-white">{day.accommodation.name}</h3>
              {day.accommodation.price && (
                <p className="text-xs text-gold-pale font-bold mt-1">{day.accommodation.price}</p>
              )}
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(day.accommodation?.mapUrl, '_blank')}
              className="bg-bronze text-forest px-6 py-2 rounded-2xl transition-all flex items-center gap-2 text-xs font-black shadow-lg shadow-bronze/20"
            >
              <MapIcon size={16} />
              查看地圖
            </motion.button>
          </div>
        )}

        {/* Timeline Table Header */}
        <div className="grid grid-cols-12 gap-2 mb-4 px-2 text-[10px] font-black uppercase tracking-widest text-white/40">
          <div className="col-span-3">時間</div>
          <div className="col-span-6">交通 / 項目</div>
          <div className="col-span-3 text-right">費用 (JPY)</div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-4 mb-10">
          {day.timeline.map((item, idx) => (
            <div key={idx} className="group">
              <div className={`grid grid-cols-12 gap-2 p-4 glass-card relative overflow-hidden ${
                item.isGlory ? 'bg-gradient-to-br from-bronze/30 to-gold-pale/10 border-bronze/50 shadow-lg shadow-bronze/20' : ''
              }`}>
                {item.isGlory && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-bronze/20 blur-3xl -mr-10 -mt-10" />
                )}
                {item.label && (
                  <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-black rounded-bl-xl ${
                    item.label.color === 'red' ? 'bg-rust text-white' : 'bg-morandi text-white'
                  }`}>
                    {item.label.text}
                  </div>
                )}
                <div className="col-span-3 flex flex-col items-center pt-1">
                  <Clock size={12} className="text-bronze mb-1" />
                  <span className="font-mono text-[10px] font-bold text-bronze text-center leading-tight">{item.time}</span>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-2 mb-1">
                    {item.isGlory ? <Music size={14} className="text-bronze animate-pulse" /> :
                     item.label?.text === '海景段' ? <Waves size={14} className="text-blue-400" /> :
                     item.label?.text === '未來御守' ? <Sparkles size={14} className="text-gold-pale" /> :
                     item.label?.text === '文創老屋' ? <Home size={14} className="text-bronze" /> :
                     item.detail.includes('下午茶') ? <Coffee size={14} className="text-bronze" /> :
                     item.type === 'transport' ? <Bus size={14} className="text-bronze" /> : 
                     item.type === 'food' ? <Utensils size={14} className="text-bronze" /> : 
                     item.type === 'task' ? <CheckCircle2 size={14} className="text-bronze" /> :
                     <MapPin size={14} className="text-bronze" />}
                    <h4 className={`font-black text-sm ${item.isGlory ? 'text-bronze' : 'text-white'}`}>{item.title}</h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${item.isGlory ? 'text-white/80 font-medium' : 'text-white/60'}`}>{item.detail}</p>
                  
                  {item.payment && (
                    <div className="mt-2 text-[10px] font-bold text-gold-pale/80 flex items-center gap-1">
                      <Wallet size={10} />
                      {item.payment}
                    </div>
                  )}

                  {item.timerLabel && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="px-2 py-1 rounded-md bg-rust/20 border border-rust/30 flex items-center gap-1.5 animate-pulse">
                        <Clock size={10} className="text-rust" />
                        <span className="text-[9px] font-black text-rust uppercase tracking-tighter">{item.timerLabel}</span>
                      </div>
                    </div>
                  )}

                  {item.hasCoupon && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-bronze to-gold-pale text-forest text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-bronze/20"
                    >
                      <ExternalLink size={12} />
                      點擊出示優惠券 (退稅 10% + 7%)
                    </motion.button>
                  )}

                  {item.sop && (
                    <div className="mt-3 space-y-2">
                      {item.sop.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-[10px] font-medium bg-morandi/30 p-2 rounded-lg text-white">
                          <div className="mt-1"><Info size={10} className="text-bronze" /></div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="col-span-3 text-right">
                  {item.amount !== undefined && (
                    <span className="font-mono text-xs font-black text-gold-pale">¥{item.amount.toLocaleString()}</span>
                  )}
                </div>
              </div>
              {idx < day.timeline.length - 1 && item.type === 'transport' && (
                <div className="flex justify-center py-1 opacity-20">
                  <ChevronRight className="rotate-90 text-bronze" size={16} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Survival Notes */}
        {day.survivalNotes && (
          <div className="grid grid-cols-1 gap-6">
            {day.survivalNotes.map((note, nIdx) => {
              const isWarning = note.type === 'sop' || note.title.includes('警告') || note.title.includes('生存提醒');
              const isEvening = note.type === 'evening' || note.title.includes('任務');
              
              return (
                <motion.div 
                  key={nIdx} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`glass-card p-8 relative overflow-hidden ${
                    isWarning ? 'bg-rust/40 border-rust/30' : 
                    isEvening ? 'bg-morandi/40 border-morandi/30' : ''
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    isWarning ? 'bg-rust' : 
                    isEvening ? 'bg-morandi' : 'bg-bronze'
                  }`} />
                  <div className={`flex items-center gap-3 mb-6 ${
                    isWarning ? 'text-white' : 
                    isEvening ? 'text-white' : 'text-bronze'
                  }`}>
                    {isWarning ? <AlertCircle size={20} className="text-bronze" /> : 
                     isEvening ? <ShoppingBag size={20} className="text-bronze" /> : 
                     <Info size={20} className="text-bronze" />}
                    <h4 className="font-black text-sm uppercase tracking-[0.2em]">{note.title}</h4>
                  </div>
                  <ul className="space-y-5">
                    {note.items.map((li, liIdx) => {
                      const isCheckbox = li.startsWith('[ ]') || li.startsWith('[x]');
                      const isChecked = li.startsWith('[x]');
                      const cleanLi = isCheckbox ? li.substring(3).trim() : li;
                      
                      const urlRegex = /(https?:\/\/[^\s)]+)/g;
                      const urls = cleanLi.match(urlRegex);
                      const textWithoutUrls = cleanLi.replace(urlRegex, '').trim();
                      
                      return (
                        <li key={liIdx} className="flex flex-col gap-3">
                          <div className="flex items-start gap-4 text-sm font-bold text-white/90">
                            {isCheckbox ? (
                              <div className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                                isChecked ? 'bg-bronze border-bronze' : 'border-white/20 hover:border-bronze/50'
                              }`}>
                                {isChecked && <CheckCircle2 size={12} className="text-forest" />}
                              </div>
                            ) : (
                              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-bronze flex-shrink-0" />
                            )}
                            <span className={`flex-1 leading-relaxed tracking-wide ${isChecked ? 'opacity-40 line-through' : ''}`}>
                              {textWithoutUrls}
                            </span>
                          </div>
                          {urls && urls.map((url, i) => (
                            <motion.button
                              key={i}
                              whileHover={{ x: 5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => window.open(url, '_blank')}
                              className="ml-9 self-start bg-bronze text-forest px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black shadow-lg shadow-bronze/10"
                            >
                              <MapIcon size={14} />
                              開啟地圖導航
                            </motion.button>
                          ))}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Journey Completion Visual */}
        {isDay7 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <div className="inline-block p-8 rounded-full bg-gradient-to-br from-bronze to-gold-pale shadow-2xl shadow-bronze/40 mb-6">
              <Trophy size={48} className="text-forest" />
            </div>
            <h3 className="text-2xl font-black text-gold-pale mb-2 tracking-widest">旅程圓滿達成</h3>
            <p className="text-white/40 text-sm font-medium">熊野古道朝聖之旅 2026</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'overview' | 'detail'>('overview');
  const [selectedDayId, setSelectedDayId] = useState(0);

  const selectedDay = ITINERARY_DATA[selectedDayId];

  return (
    <div className="min-h-screen bg-ink font-sans selection:bg-bronze/30 text-white/90 relative overflow-x-hidden">
      <div className="mountain-bg" />
      
      <AnimatePresence mode="wait">
        {view === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md mx-auto pt-20 px-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-1 bg-bronze rounded-full" />
                <span className="text-xs font-black text-bronze uppercase tracking-[0.5em]">朝聖者儀表板</span>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter mb-16 leading-[1.1]">
                熊野古道<br/>
                <span className="text-bronze italic font-serif">朝聖之旅 2026</span>
              </h1>
            </div>
            <OverviewPage onSelectDay={(id) => {
              setSelectedDayId(id);
              setView('detail');
            }} />
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <DetailPage 
              day={selectedDay} 
              onBack={() => setView('overview')} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
