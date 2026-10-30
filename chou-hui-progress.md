# 周蕙歷年專輯 KTV 收錄進度

最後更新：2026-10-31（Asia/Taipei）。此檔案是工作追蹤，**不是**雲端 Firestore 已匯入的證明。

## 本輪已完成

- 已讀取最新 `index.html`、`cloud.js`、`chou-hui-song-pack.js`、`ost-2026.js`，保留原有 2026 陸劇 OST、家人裝置授權、Google 管理登入及 Firestore 資料結構。
- 整理 1999《周蕙精選》11 首、2000《周蕙精選2》12 首、2002《周蕙精選3》10 首、2011《自己的房間》9 首、2013《我看見的世界》8 首、2018《不被遺忘的時光》目前平台可見的 5 首（不代表完整專輯）、2022《不被遺忘的時光2》10 首、2025《Where X 走》10 首，並另保留 2018 年〈被遺忘的時光〉候選，共 **8 張專輯、76 首不同曲目**（含平台未列在該張專輯清單的單曲）。
- 目前 **14 首有 YouTube 官方 MV 候選連結**，其中 **7 首有 YouTube 搜尋結果直接顯示福茂唱片官方頻道**，其餘 7 首來源為官方 MV 標題或二手整理，仍需核對頻道。
- 修正 `index.html` 原先「周蕙」篩選器與歌本清單篩選邏輯不一致、導致分類顯示空白的問題。
- 已將 `chou-hui-song-pack.js` 載入網頁，並顯示收錄進度、候選 MV 連結與管理者匯入狀態。
- 新增 `chou-hui-verify.js`：管理者在「周蕙」分類按「驗證官方 MV 並加入雲端」，瀏覽器會對 7 首已核對官方頻道的 MV 逐首靜音試播，確認 YouTube IFrame API PLAYING、影片 ID 與參考曲長，再僅匯入通過者。失敗者不匯入；原有雲端歌曲不覆寫。
- 已對 HTML 內嵌 JS、歌單 JS、驗證 JS 做 JavaScript 語法檢查，均通過。**尚未實際在使用者裝置上跑 YouTube 播放驗證。**

## 仍未完成

- **YouTube 實際嵌入驗證：0 首完成**（此執行環境無法啟動可連網的 YouTube 瀏覽器播放器）。
- **本輪 Firestore 寫入：0 首**（Firestore 寫入要求使用者 Google 管理登入，不能用 GitHub 直接寫入）。
- **其他專輯**：2001、2003、2007、2009、2020 年作品仍待核對；2018 年專輯在目前 LINE MUSIC 頁面僅見 5 首，仍需確認完整曲目；其他已整理專輯亦需持續去重與補 MV。
- **字幕**：候選 MV 的字幕/畫面歌詞尚未逐首核對。
- 不能僅憑 YouTube 影片存在或官方標題就將 `embedding` 標記為 `passed`。

## 已核對官方頻道、可於管理者裝置一鍵試播的 7 首

| 歌名 | YouTube ID | 來源 |
|---|---|---|
| 不想讓你知道 | kXFMYK9jgFg | 福茂唱片 |
| 風鈴 | Ra3Fuc77hgU | 福茂唱片 |
| 我喜歡 | uAgQn9-W2Os | 福茂唱片 |
| 預言 | u1BSQSPPPG8 | 福茂唱片 |
| 好想好好愛你 | TUqKBTQizwA | 福茂唱片 |
| 話題 | XtX4aawnWI4 | 福茂唱片 |
| 只能做朋友 | no_FGCes5mY | 福茂唱片 |

## 參考專輯曲目

- 1999《周蕙精選》：https://music.amazon.com/albums/B0BJ9PMMZ1
- 2000《周蕙精選2》：https://music.amazon.com.au/albums/B0BJ9H141W
- 2002《周蕙精選3》：https://www.theaudiodb.com/album/2434082-%E5%91%A8%E8%95%99-%E5%91%A8%E8%95%99%E7%B2%BE%E9%81%B83%3A-%E5%AF%82%E5%AF%9E%E5%9F%8E%E5%B8%82
- 2011《自己的房間》：https://music-tw.line.me/album/1023580
- 2013《我看見的世界》：https://music-tw.line.me/album/1170271
- 2018《不被遺忘的時光》：https://music-tw.line.me/album/1487471（頁面目前僅見 5 首，待確認全碟）
- 2022《不被遺忘的時光2》：https://music-tw.line.me/album/6350789
- 2025《Where X 走》：https://music-tw.line.me/album/7840393

## 下一輪工作

1. 優先確認管理者瀏覽器一鍵試播與 Firestore 同步結果；不要聲稱未觀測到的匯入成功。
2. 繼續查核未收錄的各張專輯曲目，保留專輯名稱、年份、來源與曲長。
3. 為各曲搜尋官方完整 MV、歌詞影片，逐首核對官方來源、字幕與嵌入播放；未驗證的仍保留候選。
4. 不覆寫既有雲端歌本、裝置權限、2026 陸劇 OST 或其他歌手歌曲。
