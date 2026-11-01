# 周蕙歷年專輯 KTV 收錄進度

最後更新：2026-11-01（Asia/Taipei）。此處統計 **GitHub 歌曲資料及候選影片**，不代表 Firestore 已匯入，也不代表 YouTube 影片已通過 KTV 內嵌播放。

## 2026-11-01 本輪完成

- 讀取最新 `index.html`、`chou-hui-song-pack.js`、`chou-hui-verify.js`、`cloud.js` 和本進度檔；保留 Firestore 雲端歌單、其他歌手與 OST 原有邏輯。
- 新增 2024 年 20 首曲目的《25（精選雙彩膠）》；補上 2011《自己的房間》漏收的〈髮〉、2020《豁然律》漏收的〈千千萬萬個你〉。與既有歌曲按歌名去重，專輯／EP 資料從 **14 張、129 首** 擴充為 **15 張、133 首不重複歌曲**。
- 查核 Spotify、Amazon Music、Apple Music、誠品、Sony Music 等專輯曲目與時長；目前 **132 首有歌曲長度基準**，僅〈當歸〉精確長度來源仍待進一步交叉驗證（Apple Music 顯示約 4 分鐘，次級網站稱 4:13，暫不作為自動驗證基準）。
- 官方 YouTube 候選從 **17 部增加至 33 部**（包含官方 MV、官方卡拉 OK 與官方音源）。其中 **32 部具曲長基準，可進入正式網站驗證流程**；〈當歸〉已有華研官方影片，但暫缺足夠可靠的精確曲長基準。
- 加強 `chou-hui-verify.js`：必須 **影片 ID 精確相符、上傳頻道吻合、影片標題包含歌名、影片長度在保守容差內，且播放位置實際前進至少 2.5 秒**，才會標記可匯入。單純出現 PLAYING 狀態不再算通過。
- `index.html` 已將官方音源候選納入可檢查清單，並區分 MV／卡拉 OK／音源；`chou-hui-song-pack.js` 的匯入去重改為比對正規化歌名與周蕙演唱者，避免空格／標點差異造成重複。
- JavaScript 語法與資料一致性已檢查：**15 張專輯曲目都有對應的歌曲紀錄、133 首歌名不重複、33 個影片 ID 不重複**。未在使用者的電視或瀏覽器完成實播測試，**全部仍為 `embedding: pending`、`contentVerified: false`**。

### 本輪新增的 16 部官方候選

**福茂唱片官方 MV**
- 〈不哭〉 https://www.youtube.com/watch?v=Aq0I12Pc4Uk
- 〈愛過不傷心〉 https://www.youtube.com/watch?v=A5EGkhg2WMM
- 〈相思河畔〉 https://www.youtube.com/watch?v=D1rlRjQ8W0w

**金曲年代官方卡拉 OK**
- 〈最愛〉 https://www.youtube.com/watch?v=GynOhuau7_A
- 〈向日葵〉 https://www.youtube.com/watch?v=KDj-0eYXK8A
- 〈該忘了你對不對〉 https://www.youtube.com/watch?v=Dt-mbyKjO-I

**華研國際官方 MV**
- 〈釀月光〉 https://www.youtube.com/watch?v=iR206jo8-Ac
- 〈當歸〉 https://www.youtube.com/watch?v=tj3KvUvX3Jk （尚缺可靠精確曲長）

**周蕙官方藝人頻道 MV**
- 〈過客〉 https://www.youtube.com/watch?v=SULMcR-wKeo
- 〈走〉 https://www.youtube.com/watch?v=Kz2GB-8Vz3k

**官方藝人頻道音源（非 MV，優先尋找有字幕替代版本）**
- 〈相遇太早〉 https://www.youtube.com/watch?v=QF-NOl_apCY
- 〈為自己而自己〉 https://www.youtube.com/watch?v=91R1MeF8DgQ
- 〈誤解歌〉 https://www.youtube.com/watch?v=Eg6Tr4Wz3IQ
- 〈對戲〉 https://www.youtube.com/watch?v=MU9y9E44KhU
- 〈過節〉 https://www.youtube.com/watch?v=q1tfSYhFo2Q
- 〈愛情無關是非〉 https://www.youtube.com/watch?v=z0drtnZTTp0

### 核對來源

- 《25》20 首： https://www.eslite.com/product/10032122222682568945009
- 2011《自己的房間》10 首： https://music.apple.com/us/album/%E8%87%AA%E5%B7%B1%E7%9A%84%E6%88%BF%E9%96%93/1527235004
- 2020《豁然律》6 首與曲長： https://open.spotify.com/album/5aS6NOSqWcO7B21rpNGwfa
- 2007《綻放》10 首與曲長： https://open.spotify.com/album/6rTFjeyhQ9odABh6253KsQ
- 2022《不被遺忘的時光2》11 首與曲長： https://open.spotify.com/album/6PF3wmjh6qbY0L6HhxUTWh
- 2003《蕙兒絕版》新歌與曲長： https://music.amazon.com.au/tracks/B0BJ4Y8STC
- 2025《Where X 走》10 首與曲長： https://music.amazon.in/albums/B0G6Z8VBNH
- 2015〈為自己而自己〉曲長 3:36： https://open.spotify.com/album/4SGHLO5wlHfvb2DreKBV1I

### 現況與下一步

| 項目 | 數量／狀態 |
|---|---|
| 已整理專輯／EP／精選 | **15** |
| 已整理不重複歌曲 | **133** |
| 具曲長基準 | **132** |
| YouTube 官方候選 | **33** |
| 具曲長可進入 IFrame 驗證 | **32** |
| 尚無獨立官方影片候選 | **100** |
| 本輪通過正式網站 IFrame 驗證 | **0** |
| 本輪由此任務直接匯入 Firestore | **0** |
| Firestore 現有周蕙歌曲數量 | **未知**；不能用 GitHub 程式檔推定 |

下一輪：優先尋找剩餘 100 首的官方完整 MV／卡拉 OK／歌詞影片，音源僅作備案；優先補齊〈當歸〉的精確曲長及所有候選的字幕查核。正式網站的內嵌播放必須由瀏覽器 YouTube IFrame API 實測；即使網頁可在 YouTube 觀看，也不等於可嵌入 KTV。Firestore 寫入需要使用者 Google 管理者身分；若無管理者工作階段，不得聲稱已同步或覆蓋雲端。**只有全部可驗證工作完成，或有必須使用者介入的實際阻礙時才通知。**

---

## 2026-10-31 歷史紀錄（當時統計）

### 當時已完成

- 將專輯資料由 **8 張、76 首** 擴充為 **14 張專輯／EP、129 首不同曲目**；依歌名去重，保留既有資料及其他歌手／陸劇 OST 分類。
- 新增 2001《今宵多珍重》《我要你的愛》、2003《蕙兒絕版》、2007《綻放》、2009《周蕙》、2020《豁然律》的專輯曲目（2003 精選重複曲目不重複建歌）。
- 完成 2013《我看見的世界》10 首、2018《不被遺忘的時光》10 首、2022《不被遺忘的時光2》11 首的缺漏補齊。〈喜歡你〉（2022）是粵語，現歸「其他」語言。
- YouTube **官方 MV／官方卡拉 OK 候選**由 14 部增至 **17 部**：新增〈今宵多珍重〉、〈我要你的愛〉、〈分岔路口〉。
- 為〈我看見的世界〉、〈被遺忘的時光〉、〈感性生物〉補齊串流平台歌曲長度基準；目前 17 部候選皆有參考曲長。
- 網站管理者的候選驗證範圍包括來源標示 `official_channel` 或 `official_title` 的影片；**未取得歌曲長度基準的影片不得標記 verified**。更新前端快取版本。

### 當時狀態

| 項目 | 數量／狀態 |
|---|---|
| 已整理專輯／EP | 14 |
| 已整理不重複曲目 | 129 |
| 已找到 YouTube 候選影片 | 17 |
| 在此 GitHub 版本中標記 verified | 0 |
| 本輪由此任務直接寫入 Firestore | 0 |
| Firestore 現有周蕙歌曲實際數量 | **未知**，管理者先前曾回報「同步完成」，不能憑程式檔推斷 |

所有候選影片仍為 `embedding: pending`，未經正式網站 YouTube IFrame API 試播與長度確認，不會因新增 GitHub 曲目而自動進入雲端。管理者若已匯入，網站會以 Firestore 即時歌單顯示，請勿重複覆寫。

### 當時來源

- 福茂唱片官方 MV：〈今宵多珍重〉 https://www.youtube.com/watch?v=Poe_poxjuAQ；〈我要你的愛〉 https://www.youtube.com/watch?v=wksJDRxPYcg
- 金曲年代官方卡拉 OK：〈分岔路口〉 https://www.youtube.com/watch?v=YYosiZDUmC0
- 2001《今宵多珍重》 https://music-tw.line.me/album/1000457
- 2001《我要你的愛》 https://music.apple.com/us/album/%E6%88%91%E8%A6%81%E4%BD%A0%E7%9A%84%E6%84%9B/536091029
- 2003《蕙兒絕版》 https://www.ccr.com.tw/m/goods/79969
- 2007《綻放》 https://open.spotify.com/album/6rTFjeyhQ9odABh6253KsQ
- 2009《周蕙》 https://open.spotify.com/intl-id/track/4dGKG67UQ8f7CkpOQ871r2
- 2013《我看見的世界》 https://open.spotify.com/track/6dIKGCUabXK98GQWyMMcHW
- 2018《不被遺忘的時光》 https://open.spotify.com/intl-it/track/4x2qiUHdhNvfLJelbGuvlU
- 2020《豁然律》 https://music-tw.line.me/album/3457237
- 2022《不被遺忘的時光2》官方曲目 https://www.youtube.com/watch?v=VbDPfN-_U-8
- 2025《Where X 走》 https://www.hitfm.com.tw/newweb/20306album

### 當時待辦（後續已有進展）

1. 為其餘 **112 首**（129−17）尚無獨立 YouTube 候選影片的歌曲尋找官方完整 MV、歌詞影片或卡拉 OK；不要把串燒影片當成單首。
2. 逐首查核來源頻道、字幕、完整時長、正式網站嵌入；公開 YouTube 網址並不代表允許嵌入。
3. 通過驗證者再由 Google 管理者登入的網站執行安全匯入；確認 Firestore 伺服器同步及實際新增數量，不覆蓋既有歌曲。
4. 2026 新單曲與戲劇 OST 另行整理，不混入原專輯曲目。
5. 全部可核實工作完成後才通知使用者完成報告；遇到必須使用者授權的阻礙，說明具體操作。
