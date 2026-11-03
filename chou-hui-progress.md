# 周蕙歷年專輯 KTV 收錄進度

## 2026-11-03 一次性驗證與實際雲端匯入結果

- 使用者已在本對話確認 Google 管理者登入，並回覆已停用舊的每天三次 ChatGPT 排程；本次沒有建立任何新排程。
- 已逐張讀取周蕙官方藝人頻道發行專輯、官方唱片公司及 Golden Era 金曲年代頻道。133 首曲目已有 131 部獨立官方 MV／卡拉 OK／發行商音源；只有〈發現〉、〈等待花季〉尚未找到已確認的獨立官方影片，未採用民間翻唱、串燒或不明上傳者。
- 正式網站獨立管理頁實際 YouTube iframe 驗證：共 **130 首通過**。必須指定影片 ID、核對來源頻道與歌名、完整時長符合參考容差，且連續觀察至少 2.5 秒的實際播放前進。只開啟外部影片或看到 PLAYING 不算通過。影片字幕未在本輪逐首確認，不宣稱每首都有字幕；其中官方音源可能無歌詞畫面。
- 首批 60 部實測 37 首通過；其他來源核對及重新實播後 129 首通過。〈不愛了也是一種愛〉官方 MV 被 YouTube 錯誤150阻擋，改用已核對的官方完整音源 RW7o-TX1wnk，實測248.081秒並通過，累計130首。Topic 與官方藝人整合頻道使用明確名稱對應；Golden Era 以播放器實際頻道名稱核對，沒有放寬成任意上傳者。
- **實際成功新增 Firestore：101 首，分兩批 8 + 93，兩批皆逐首伺服器回讀確認。** 匯入前雲端周蕙29首；完成後伺服器共259首，其中周蕙130首，其他歌手129首保留。沒有更新、覆寫或刪除既有歌曲；沒有修改 Firestore 安全規則。
- 獨立管理頁 `chou-hui-admin.html` 與 `chou-hui-admin.js` 已發布並實際操作。初次 REST 查詢交易被403拒絕，未寫入；改用網站已支援的 Firebase 用戶端文件交易：每批先取得伺服器完整歌單，按正規化歌名＋周蕙演唱者、videoId、vocalId去重，交易內重讀所有已觀察既有文件及候選目標，略過已存在或衝突的目標，僅新增，再回讀確認。管理端沒有自動匯入或原唱補寫，不執行其他歌手更新。既有 `cloud.js` 通用匯入器沒有變更，不應用它直接匯入候選；此流程沒有新增跨所有不同寫入端的唯一性索引，勿同時操作其他管理匯入。
- **仍未完成的3首**：〈發現〉、〈等待花季〉缺少已確認官方來源；〈冬季到台北來看雨〉官方 MV -AJH6bDAamc 實測303.661秒，與[華研官方專輯頁](https://www.him.com.tw/albumcon.php?cid=48)列出的3:45／225秒不符，保持pending、contentVerified:false，未匯入。沒有為了通過驗證而改動曲長基準。
- 機器可讀證據：`verification/chou-hui-2026-11-03-batch1.json`、`verification/chou-hui-2026-11-03-batch2.json`、`verification/chou-hui-2026-11-03-import1.json`、`verification/chou-hui-2026-11-03-final.json`。最終報告含130首通過結果、最後一批93首交易及回讀數量，以及本次合計101首摘要。沒有帳號個資或登入憑證。
- 驗證：管理匯入測試7項通過，涵蓋既有歌名／合作演唱者、影片與原唱ID去重、目標ID碰撞、不合格候選拒絕、交易失敗不報成功、回讀確認。133個歌名、131個候選影片ID皆不重複，130首保留實播證據。
- 主點歌頁保留清爽介面，沒有重新加入周蕙驗證／進度／匯入區塊。這是**130首已驗證歌曲的雲端同步完成**，不是133首全部收錄完成。

---


## 歌本介面約定（2026-11-02，使用者要求）

- 點歌本不再顯示「周蕙・歷年專輯歌曲」驗證區塊、候選連結、進度、驗證或匯入按鈕；周蕙分類只供選歌。後續排程與歌曲更新不得將這些內容加回歌本。
- 驗證證據、候選清單、通過／失敗結果及新增數量記錄於本文件，並在對話中向管理者確認；不將家人的帳號個資、登入憑證寫入公開文件。
- 既有雲端周蕙歌曲、分類及點唱功能保留。本次只移除介面與相關事件，不更動 Firestore 歌曲或驗證標記。
- `chou-hui-verify.js` 原始工具保留，但主點歌頁不再載入、也沒有驗證入口。下方歷史紀錄提及的歌本驗證按鈕已停用；若需要管理者實機驗證，應使用另行準備的管理工作流程，不要求長輩操作，也不得因 UI 移除而跳過實播。
- Markdown 僅記錄證據，不會執行影片播放或匯入。未實播通過者仍保持 pending；不可把 GitHub 資料更新當成雲端同步完成。

最後更新：2026-11-03（Asia/Taipei）。此處統計 **GitHub 歌曲資料及候選影片**，不代表 Firestore 已匯入，也不代表 YouTube 影片已通過 KTV 內嵌播放。

## 2026-11-03 上午：兩首《自己的房間》官方候選與剩餘 73 首追蹤

- 重新讀取最新 `index.html`、`chou-hui-song-pack.js`、`cloud.js`、`chou-hui-verify.js` 及歷史進度。遵守 2026-11-02 介面約定，**不恢復點歌本上的周蕙進度、驗證或匯入區塊**。
- 逐首搜尋缺少獨立官方影片的歌曲，核對官方 YouTube 頻道、影片描述、唱片公司及專輯曲長。新增 **2 部待驗證候選**：
  - **〈冰塊〉** — [官方音源](https://www.youtube.com/watch?v=5p-GARlNEqw)，周蕙 Where Chou Official Artist Channel，2021-04-12 上架；YouTube 說明為 Walkgame／群石國際提供、2011-10-21 發行《自己的房間》曲目。**非 MV**，優先尋找字幕 MV 替代；專輯參考長度 **3:32**，影片實際長度、字幕及內嵌播放均未實測。
  - **〈不老的月亮〉** — [官方 MV](https://www.youtube.com/watch?v=-ncCvb7uB6k)，群石國際 2010-08-27 上傳，演唱者為**周蕙與新七小福對唱**，不是周蕙獨唱；[LINE MUSIC 專輯曲目](https://music-tw.line.me/track/1023580010) 亦標示 feat. 新七小福，對應《自己的房間》版本。專輯參考長度 **4:38–4:39**，影片實際長度、字幕與內嵌播放仍未實測。
- [唱片公司／發行商專輯曲目與長度](https://ffm.to/chouhuei2011) 核對兩首均在《自己的房間》。未採用非官方翻唱、合輯影片或無法確認演唱者的結果；本輪未找到其他證據足夠的獨立官方影片。
- 資料檢查：**15 張專輯／EP／精選、133 首不重複曲目、60 個不同官方影片候選、73 首仍缺獨立官方候選**；60 部候選都有歌曲曲長基準。**正式 KTV IFrame 播放通過 0、verified 0、Firestore 本輪寫入 0**。所有候選保持 `embedding: pending`、`contentVerified: false`、`durationSeconds: null`；YouTube 外部可開啟不等於能在 KTV 播放。
- 已更新 `chou-hui-song-pack.js` 與 `index.html` 快取參數，未修改 `cloud.js`、Firestore 安全規則、既有歌曲或其他歌手資料。未取得管理者 Google 登入工作階段，**無法獨立確認 Firestore 現有周蕙歌曲數量，也沒有進行雲端匯入**。既有 `importSongs` 只依文件 ID 避免覆蓋，仍需在未來管理端讀取伺服器最新歌單後按歌名＋歌手、影片 ID 雙重去重；目前沒有安全依據可將候選直接寫入雲端。
- 後續：優先查找剩餘 73 首的官方完整 MV／歌詞影片；已有官方音源的歌曲持續尋找字幕 MV；安排**獨立管理端**實際 IFrame 播放、時長、上傳者與字幕檢查。驗證及雲端匯入需要已授權管理者登入，且不得把管理驗證 UI 放回長輩點歌頁。

### 尚缺獨立官方影片的 73 首（依專輯）

- **周蕙精選（5）**：FOREVER、討厭自己、思念的翅膀、我看、了了
- **周蕙精選2－好想好好愛你（6）**：ANGEL FACE、太茫、事到如今、換季、沒有你、溫度
- **周蕙精選3－寂寞城市（5）**：Hold Me Tight、別對我太好、不管、隱形、終點
- **自己的房間（5）**：幸福的可能、雜質、故事的某段、最難得到的禮物、髮
- **我看見的世界（6）**：食物戀、誰稀罕愛上你、謝謝你騙我、多餘的寂寞、人間、給從前
- **不被遺忘的時光（8）**：夢不到你、再看我一眼、愛你在心口難開、心痛的感覺、愛的路上我和你、海誓山盟、千言萬語、今天不回家
- **不被遺忘的時光2（3）**：喜歡你、失戀陣線聯盟、心理遊戲
- **Where X 走（3）**：我一個人唱歌、無約、度菇
- **今宵多珍重（8）**：偷偷摸摸、魂縈舊夢、夢中人、打噴嚏、你真美麗、等著你回來、給我一個吻、情人的眼淚
- **我要你的愛（7）**：秋夜、心戀、叉燒包、如果沒有你、不了情、說不出的快活、今宵多珍重(下集)
- **綻放（6）**：學會、擁抱的瞬間、Darling、發現、赤裸、等待花季
- **周蕙（9）**：自己的電影、周蕙、守約、Complicated、也許你、老地方、夜動、難題、他是誰
- **豁然律（2）**：騙人，不！、還好嗎？

---

## 2026-11-02 晚間：兩部官方音源候選及剩餘曲目清單

- 重新讀取最新 `index.html`、`chou-hui-song-pack.js`、`cloud.js`、`chou-hui-verify.js` 和本進度檔；遵守管理者要求，**未恢復點歌本上的周蕙驗證／匯入／進度區塊**。
- 新增兩部經 YouTube 影片頁核對「歌曲名稱、演唱者、官方藝人頻道及發行唱片公司」的**官方自動生成音源**，均為**非 MV、無字幕確認、未實測影片長度與 IFrame**，僅列候選：
  - 〈只是少了你〉：周蕙 Where Chou 官方藝人頻道，HIMservice／華研國際，2020-12-10 上架，`amZL6g0XTl0`，https://www.youtube.com/watch?v=amZL6g0XTl0；歌曲參考曲長 4:21（261 秒），**尚未核對 YouTube 影片實長**。
  - 〈掌心的指紋〉：周蕙官方藝人頻道，Walkgame／群石國際，2025-12-30 上架，`2QZlXxgD9fQ`，https://www.youtube.com/watch?v=2QZlXxgD9fQ；歌曲參考曲長 3:58（238 秒），**尚未核對 YouTube 影片實長**。
- 搜尋時另發現〈故事的某段〉民間動態歌詞版（`_sM_oxCIejQ`），但上傳者非官方唱片公司／藝人頻道，**不納入官方候選**。官方《Where X 走》「數位專輯搶先聽」影片（`H7ZAtJdwpVg`）為多曲合輯，**不拆作單首候選**。
- 統計：**15 張專輯／EP／精選、133 首不重複歌曲、58 個互不重複官方影片候選、75 首尚無獨立官方影片候選**。58 部都有歌曲曲長參考；**正式 IFrame 實播通過 0、本輪新增 verified 0、本輪寫入 Firestore 0**。所有 58 部候選仍是 `embedding: pending`、`contentVerified: false`、`durationSeconds: null`。字幕與實際可嵌入播放仍未驗證。
- 已更新 `chou-hui-song-pack.js` 與 `index.html` 快取參數；資料解析、影片 ID 唯一性及 pending 狀態檢查通過。未修改 `cloud.js`、Firestore 規則或既有雲端歌曲。
- **雲端匯入安全限制仍在**：`cloud.js` 依文件 ID 進行 onlyMissing 交易，不能單獨防止同歌不同影片 ID 的重複；日後匯入必須先取伺服器確認的 Firestore 全清單，按正規化歌名＋歌手與影片 ID 雙重去重，並再次核對交易目標，且需要 Google 管理者授權。無管理者工作階段，本輪未嘗試匯入，也無法確認現有雲端周蕙歌曲數量。

### 尚缺獨立官方影片的 75 首（按專輯分組）

- **周蕙精選（5）**：FOREVER、討厭自己、思念的翅膀、我看、了了
- **周蕙精選2－好想好好愛你（6）**：ANGEL FACE、太茫、事到如今、換季、沒有你、溫度
- **周蕙精選3－寂寞城市（5）**：Hold Me Tight、別對我太好、不管、隱形、終點
- **自己的房間（7）**：幸福的可能、冰塊、雜質、故事的某段、最難得到的禮物、不老的月亮、髮
- **我看見的世界（6）**：食物戀、誰稀罕愛上你、謝謝你騙我、多餘的寂寞、人間、給從前
- **不被遺忘的時光（8）**：夢不到你、再看我一眼、愛你在心口難開、心痛的感覺、愛的路上我和你、海誓山盟、千言萬語、今天不回家
- **不被遺忘的時光2（3）**：喜歡你、失戀陣線聯盟、心理遊戲
- **Where X 走（3）**：我一個人唱歌、無約、度菇
- **今宵多珍重（8）**：偷偷摸摸、魂縈舊夢、夢中人、打噴嚏、你真美麗、等著你回來、給我一個吻、情人的眼淚
- **我要你的愛（7）**：秋夜、心戀、叉燒包、如果沒有你、不了情、說不出的快活、今宵多珍重(下集)
- **綻放（6）**：學會、擁抱的瞬間、Darling、發現、赤裸、等待花季
- **周蕙（9）**：自己的電影、周蕙、守約、Complicated、也許你、老地方、夜動、難題、他是誰
- **豁然律（2）**：騙人，不！、還好嗎？

**後續**：優先尋找上述 75 首的獨立官方 MV／歌詞影片，官方音源僅作備案；另逐首核對 58 部候選的影片實際時長、上傳者、字幕、正式網站 IFrame 播放與播放進度。不得以外部 YouTube 可開啟或第三方「可嵌入」聲稱完成實播。

---

## 2026-11-02 下午：四部官方影片候選及字幕來源核對

- 已重新讀取最新 `index.html`、`chou-hui-song-pack.js`、`cloud.js`、`chou-hui-verify.js` 與既有紀錄。遵守使用者 2026-11-02 指示：**點歌本不再顯示周蕙驗證區塊、候選連結、進度與匯入按鈕**，本次僅調整歌曲資料、快取版本及此管理進度檔，未恢復任何驗證 UI。
- 官方 YouTube 影片頁核對 4 部新增候選：福茂唱片〈收藏〉、〈流域〉官方 MV，福茂唱片〈空白〉官方上傳影片（頁面未足以判定 MV 類型，故僅標 `official_video`），以及周蕙 Official Artist Channel〈守護者〉自動生成官方音源（**非 MV，僅備案**）。
- 官方華研國際〈我看見的世界〉MV 影片說明明確列出**繁體中文、簡體中文及英文 CC** 選項；已註記官方說明提供字幕，但**沒有實際於 KTV IFrame 檢查字幕可用性**，不得將此視為實播驗證。
- 所有新增候選已附官方來源、影片 ID、歌曲曲長參考及待辦；**尚未實測實際 YouTube 影片時長、可嵌入性、播放進度或字幕顯示**，故全部維持 `embedding: pending`、`contentVerified: false`、`durationSeconds: null`。不能僅憑 YouTube 可開啟或串流平台歌曲長度就宣稱已通過。
- 資料一致性檢查：**15 張專輯／EP／精選、133 首不重複曲目、56 個互不重複影片 ID、56 部候選有歌曲曲長參考、77 首尚無獨立官方候選**；本輪新增 verified **0**、Firestore 匯入 **0**。無管理者登入工作階段，無法核對 Firestore 實際歌曲數量；沒有覆蓋既有歌曲、分類或 Firestore 資料。
- **匯入安全稽核提醒**：`cloud.js` 的 `importSongs(items, true)` 交易只依文件 ID（可能由 YouTube ID 產生）判斷是否已存在；同一歌名若以不同影片 ID 儲存，單靠該交易仍可能重複。現有 `chou-hui-song-pack.js` 的 `missing(remoteSongs)` 可依正規化歌名／歌手先過濾，但後續新管理匯入流程仍必須先取得 Firestore 最新完整清單、以歌名＋歌手和影片 ID 雙重去重，且不可把 `onlyMissing` 視為跨 ID 去重保證。本輪無寫入，故未觸及既有雲端歌曲。
- 下一輪優先：繼續查找 77 首缺少官方獨立影片的曲目（MV／歌詞版優先）；有音源備案的仍優先尋找字幕 MV；正式管理端需實際 IFrame 試播、時長與播放進度檢查後，才能標記 verified 並由已授權管理者執行**僅新增缺少歌曲**的雲端匯入。

### 本輪新增 4 部官方候選（未通過 IFrame 實播）

- 〈空白〉— 福茂唱片官方上傳影片（2012-02-15），https://www.youtube.com/watch?v=VD7ZGCV4TsE；影片說明列出詞曲與周蕙演唱，是否 MV／字幕待查，歌曲曲長參考 3:30。
- 〈收藏〉— 福茂唱片官方版 MV（2012-02-15），https://www.youtube.com/watch?v=kYszcUoAdso；曲長參考 4:08，字幕待查。
- 〈流域〉— 福茂唱片官方版 MV（2012-02-15），https://www.youtube.com/watch?v=DJhtdeXMuiI；曲長參考 4:27，字幕待查。
- 〈守護者〉— 周蕙 Official Artist Channel 自動生成官方音源（2021-04-13 上架，原曲 2009-06-19），https://www.youtube.com/watch?v=5-thqSG2z8w；曲長參考 4:28，非 MV，字幕待查。
- 〈我看見的世界〉**既有候選字幕來源補證**— 華研國際官方 MV（2013-10-06），https://www.youtube.com/watch?v=uSF8M1jZ-Zk；影片說明提供繁體中文／簡體中文／英文 CC，未實測 KTV 顯示。

---

## 2026-11-02 上午：官方 MV／歌詞影片增補與〈當歸〉曲長查證

- 已讀取 GitHub 最新 `index.html`、`chou-hui-song-pack.js`、`cloud.js`、`chou-hui-verify.js` 及既有進度。沒有管理者 Google 登入工作階段，**本輪未寫入 Firestore，也不能獨立查證雲端周蕙歌曲數量**。
- 以 YouTube 直接顯示的頻道與標題核對 **4 首新候選**：福茂唱片官方 MV〈瞬間〉、〈我很快樂〉；華研國際官方歌詞版 MV〈偶然〉；周蕙官方藝人頻道的〈我不是你的唯一〉（唱片公司自動生成音源，**非 MV**，僅作備案）。各候選都有獨立影片 ID，沒有採用串燒或翻唱版本。
- **未採用**華研官方〈再看我一眼 X 愛的路上我和你 X 今天不回家〉三曲合輯 MV（https://www.youtube.com/watch?v=Xgu8HXOh364）：它包含三首，不能當成任一首的獨立完整歌曲影片，避免切歌後誤播。
- 〈當歸〉於日本正式串流平台 AWA 的單曲頁列出 **4:10（250 秒）**，與 Apple Music 約 4 分鐘相容；先前次級來源另有 4:13 的差異。現暫以 AWA 的 250 秒作**候選曲長比對基準**，正式 IFrame 仍須核對影片實長、上傳者、歌名與實際播放進度，**未通過不得標記 verified**。
- 更新 `chou-hui-song-pack.js` 與 `index.html` 快取版本，讓重新整理後的網站取得新候選；沒有變更其他歌手、OST、Firestore 規則或已存在歌曲。
- 資料結構檢查：**15 張專輯／EP／精選、133 首不重複歌曲、52 個互不重複的官方影片候選、52 首有曲長基準、81 首尚無獨立官方 YouTube 候選**。全部候選仍是 `embedding: pending`、`contentVerified: false`，**本輪新增 verified：0、匯入 Firestore：0**。

### 2026-11-02 新增的 4 部官方 YouTube 候選（尚未正式 IFrame 實播）

- 〈瞬間〉— **福茂唱片官方 MV**（2012-02-15），https://www.youtube.com/watch?v=PmgDhpNfYwY；歌曲基準 4:20，字幕軌待查。
- 〈我很快樂〉— **福茂唱片官方 MV**（2012-02-15），https://www.youtube.com/watch?v=LD7s0FnKyqM；歌曲基準 3:38，字幕軌待查。
- 〈偶然〉— **華研國際官方歌詞版 MV**（2018-06-27），https://www.youtube.com/watch?v=K0xrd_YD0C0；畫面有歌詞版標示，不等於已確認 YouTube 字幕軌，歌曲基準 4:11。
- 〈我不是你的唯一〉— **周蕙官方藝人頻道自動生成音源**（2021-04-12 上架，原曲 2011-10-21），https://www.youtube.com/watch?v=LSWWAe52CBA；歌曲基準 5:18，暫作無 MV 備案。

### 2026-11-02 曲長補證

- 〈當歸〉— AWA 單曲頁 4:10：https://s.awa.fm/track/8f7a3d12acfff86ce572
- 〈當歸〉— Apple Music 2015-10-26 單曲頁（僅顯示約 4 分鐘）：https://music.apple.com/us/album/%E7%95%B6%E6%AD%B8-single/1058293493

**後續優先順序**：繼續找 81 首沒有獨立官方候選的曲目，優先官方 MV／歌詞影片，再考慮官方音源；逐首確認字幕與正式網站 IFrame 影片時長及播放進度。若要把通過驗證的歌曲寫入雲端，須由已授權的 Google 管理者登入網站操作；即使 GitHub 資料已更新，也不代表 Firestore 已同步。

---

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
