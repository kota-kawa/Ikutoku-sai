// static/js/eventsData.js

// ❶ カテゴリごとのイベント定義
const eventData = {
  gourmet: [
    { building: "K1号館", name: "カフェAlpha",       description: "焙煎珈琲とケーキのお店",       venue: "K1号館 1F 大ホール横",             contact: "046-123-4567" },
    { building: "K1号館", name: "パン屋Beta",         description: "焼きたてパン各種",             venue: "K1号館 正面入口前",               contact: "046-987-6543" },
    { building: "K2号館", name: "ラーメンGamma",      description: "あっさり醤油ラーメン",         venue: "K2号館 東側",                     contact: "046-555-1212" },
    // ★K1号館にあと５つ追加★
    { building: "K1号館", name: "和菓子屋Delta",      description: "季節の和菓子と抹茶セット",     venue: "K1号館 2F ロビー横",              contact: "046-111-0001" },
    { building: "K1号館", name: "アイスEpsilon",      description: "手作りアイスクリーム各種",     venue: "K1号館 1F 中央ホール",            contact: "046-111-0002" },
    { building: "K1号館", name: "居酒屋Zeta",         description: "地元食材を使ったおつまみ",     venue: "K1号館 3F イベントホール入口",    contact: "046-111-0003" },
    { building: "K1号館", name: "カレーEta",          description: "スパイシーチキンカレー",       venue: "K1号館 B1F フードコート",          contact: "046-111-0004" },
    { building: "K1号館", name: "寿司Theta",          description: "新鮮な地魚を使った寿司",       venue: "K1号館 4F テラス",                contact: "046-111-0005" }
  ],
  lab: [
    { building: "K1号館",     name: "AI研究室見学",      description: "最先端AI技術の展示",         venue: "K1号館 1F 情報棟",                contact: "046-222-0001" },
    { building: "K2号館",     name: "ロボ研公開",        description: "自律移動ロボットのデモ",       venue: "K2号館 2F 実験室",                contact: "046-222-0002" }
  ],
  circle: [
    { building: "K3号館",     name: "バスケ部トライアウト", description: "初心者歓迎！",               venue: "K3号館 体育館",                  contact: "046-333-0001" },
    { building: "K4号館",     name: "吹奏楽部演奏会",     description: "クラシック&ポップス演奏",     venue: "K4号館 ロビー",                  contact: "046-333-0002" }
  ],
  performance: [
    { building: "KAITアリーナ", name: "演劇部公演『青春劇場』", description: "若き日の物語を演じます",   venue: "KAITアリーナ メインステージ",    contact: "046-444-0001" },
    { building: "広場",          name: "軽音楽部ライブ",       description: "バンド演奏ライブ",         venue: "広場 ステージ",                  contact: "046-444-0002" }
  ]
};

// ❷ spots 配列にマージ
Object.entries(eventData).forEach(([category, arr]) => {
  arr.forEach(evt => {
    const spot = spots.find(s => s.name === evt.building);
    if (!spot) {
      console.warn(`イベントの紐付け先が見つかりません: ${evt.building}`);
      return;
    }
    if (!spot.events)             spot.events = {};
    if (!spot.events[category])   spot.events[category] = [];
    spot.events[category].push({
      name:        evt.name,
      description: evt.description,
      venue:       evt.venue,
      contact:     evt.contact
    });
  });
});
