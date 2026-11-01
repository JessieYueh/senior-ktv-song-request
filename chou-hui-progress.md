# 周蕙歷年專輯 KTV 收錄進度

最後更新：2026-11-01（Asia/Taipei）。此處統計 **GitHub 歌曲資料及候選影片**，不代表 Firestore 已匯入，也不代表 YouTube 影片已通過 KTV 內嵌播放。

## 2026-11-01 晚間增補（4 部官方 MV、1 部官方歌詞影片）

- 已重新讀取最新 `index.html`、`chou-hui-song-pack.js`、`cloud.js`、`chou-hui-verify.js` 及本進度紀錄，確認管理者匯入仍透過 Firestore 交易、只新增缺少的歌曲。
- 透過 YouTube 的唱片公司官方頻道影片頁核對**5 部官方影片**（4 部 MV、1 部歌詞影片；非翻唱／串燒／音源）：〈咖啡季節〉、〈千千萬萬個你〉（漫步月光版）、〈彎彎的月光〉、〈美好生活〉及〈哪兒〉。官方說明含歌詞的影片不等於已確認 YouTube 字幕軌，故 `subtitles` 仍為「待查」。
- 本次提交只新增 `videoId`、官方頻道、來源與待驗證說明，**未**改為 `embedding: passed` 或 `contentVerified: true`；未在正式 KTV 網頁實測影片完整長度、字幕或嵌入播放，也**未**寫入 Firestore。
- 更新前端 `chou-hui-song-pack.js` 快取版本，讓管理者重新整理後可看到新增候選。檢查 JSON 歌曲資料為 **133 首、48 個不同影片 ID、85 首尚無獨立官方候選**；已知曲長基準仍為 132 首，故目前 47 部候選具備進入 IFrame 驗證的曲長基準。
- **需注意版本差異**：〈千千萬萬個你〉為「漫步月光版」，正式試播時應核對與專輯版本的時長是否相容；不符合長度不得通過。〈當歸〉曲長仍待可靠來源，不進入自動驗證。
- 雲端已有周蕙歌曲的實際數量**未知**，未取得 Google 管理者登入工作階段，不宣稱匯入完成。下一輪繼續搜尋 85 首缺少官方影片的曲目，並逐首查字幕與播放。

### 新增來源（全部待正式網站驗證）

- 〈咖啡季節〉— 群石國際官方 MV，2011-10-22：https://www.youtube.com/watch?v=rx6NlWQWEeg
- 〈千千萬萬個你〉— 華研國際官方 MV「漫步月光版」，2020-12-15：https://www.youtube.com/watch?v=cajofxl-YfA
- 〈彎彎的月光〉— 華研國際官方 MV，2020-08-19：https://www.youtube.com/watch?v=YjMaq_Ms7FE
- 〈美好生活〉— 華研國際官方 MV，2014-04-02：https://www.youtube.com/watch?v=bLmMeJYDSlU
- 〈哪兒〉— 華研國際官方歌詞影片，2020-09-15：https://www.youtube.com/watch?v=JBNUJjfr4yw

---

## 2026-11-01 下午增補（官方影片候選查證）

- 重新讀取最新 `index.html`、`chou-hui-song-pack.js`、`chou-hui-verify.js`、`cloud.js` 與本進度檔；確認 Firestore 仍採 Google 管理者身分才可寫入，且匯入僅新增缺少的文件。本次**未取得管理者工作階段，沒有寫入 Firestore**。
- 透過 YouTube 官方藝人頻道、華研國際唱片頻道與官方影片說明，新增 **10 部獨立歌曲候選**：**3 部官方 MV、7 部官方音源**。官方音源不等於附字幕 MV；全部仍是 `embedding: pending`、`contentVerified: false`，不會自動匯入。
- 其中〈天天想你〉選用官方 MV（非音源），〈拒絕再玩〉亦選用官方 MV；〈冬季到台北來看雨〉為周蕙與楊永聰（James）的官方對唱 MV。
- 再次解析 JavaScript 並檢查資料：**133 首不重複歌曲、43 個不同影片 ID、132 首具曲長基準、42 部候選可進入 IFrame 驗證**；剩下 **90 首**尚無官方獨立影片候選。未取得正式網站的 IFrame 播放與字幕結果，因此 **0 首新增 verified、0 首由本輪匯入 Firestore**。

### 本輪新增官方 MV（仍待嵌入／完整長度／字幕驗證）

- 〈天天想你〉— 周蕙官方藝人頻道（2022-03-22）：https://www.youtube.com/watch?v=gIEjW2in5r4
- 〈拒絕再玩〉— 周蕙官方藝人頻道（2022-09-14）：https://www.youtube.com/watch?v=l95xuA66nVU
- 〈冬季到台北來看雨〉— 華研國際官方頻道、周蕙 feat. 楊永聰（2013-10-20）：https://www.youtube.com/watch?v=-AJH6bDAamc

### 本輪新增官方完整音源（非 MV，字幕待查）

- 〈不愛了也是一種愛〉— 周蕙官方藝人頻道／群石國際：https://www.youtube.com/watch?v=RW7o-TX1wnk
- 〈一路上有你〉— 周蕙官方藝人頻道／HIMservice：https://www.youtube.com/watch?v=jnnHeh_EBfE
- 〈不讓我的眼淚陪我過夜〉— 周蕙官方藝人頻道／HIMservice：https://www.youtube.com/watch?v=nTB5cGo78MY
- 〈明天我要嫁給你〉— 周蕙官方藝人頻道／HIMservice：https://www.youtube.com/watch?v=tyP8KCuXXDY
- 〈Don't break my heart〉— 周蕙官方藝人頻道／HIMservice：https://www.youtube.com/watch?v=TGOnxdBQiLo
- 〈你快回來〉— 周蕙官方藝人頻道／HIMservice：https://www.youtube.com/watch?v=qJzFLsr-0EU
- 〈我們還會相遇〉— 周蕙官方藝人頻道／HIMservice：https://www.youtube.com/watch?v=yM-GIKvdwB0

**限制與後續**：YouTube 官方頁可查到上傳者及曲目資訊，但無法在此執行管理者瀏覽器的 YouTube IFrame 播放與字幕實測，不能宣稱任何影片已可唱。後續優先尋找剩餘 90 首官方 MV／歌詞影片，並核對〈當歸〉精確時長；只有實播通過且無重複的歌曲才能由已授權管理者匯入 Firestore。

---

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
| YouTube 官方候選 | **48** |
| 具曲長可進入 IFrame 驗證 | **47** |
| 尚無獨立官方影片候選 | **85** |
| 本輪通過正式網站 IFrame 驗證 | **0** |
| 本輪由此任務直接匯入 Firestore | **0** |
| Firestore 現有周蕙歌曲數量 | **未知**；不能用 GitHub 程式檔推定 |

下一輪：優先尋找剩餘 85 首的官方完整 MV／卡拉 OK／歌詞影片，音源僅作備案；優先補齊〈當歸〉的精確曲長及所有候選的字幕查核。正式網站的內嵌播放必須由瀏覽器 YouTube IFrame API 實測；即使網頁可在 YouTube 觀看，也不等於可嵌入 KTV。Firestore 寫入需要使用者 Google 管理者身分；若無管理者工作階段，不得聲稱已同步或覆蓋雲端。**只有全部可驗證工作完成，或有必須使用者介入的實際阻礙時才通知。**

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
