# 周蕙歷年專輯 KTV 收錄進度

最後更新：2026-10-31（Asia/Taipei）。本檔記錄 GitHub 曲目與驗證進度，**不是** Firestore 實際匯入的證明。

## 已完成（本次 GitHub 更新）

- 將專輯資料由 **8 張、76 首** 擴充為 **14 張專輯／EP、129 首不同曲目**；依歌名去重，保留既有資料及其他歌手／陸劇 OST 分類。
- 新增 2001《今宵多珍重》《我要你的愛》、2003《蕙兒絕版》、2007《綻放》、2009《周蕙》、2020《豁然律》的專輯曲目（2003 精選重複曲目不重複建歌）。
- 完成 2013《我看見的世界》10 首、2018《不被遺忘的時光》10 首、2022《不被遺忘的時光2》11 首的缺漏補齊。〈喜歡你〉（2022）是粵語，現歸「其他」語言。
- YouTube **官方 MV／官方卡拉 OK 候選**由 14 部增至 **17 部**：新增〈今宵多珍重〉、〈我要你的愛〉、〈分岔路口〉。
- 為〈我看見的世界〉、〈被遺忘的時光〉、〈感性生物〉補齊串流平台歌曲長度基準；目前 17 部候選皆有參考曲長。
- 網站管理者的候選驗證範圍包括來源標示 `official_channel` 或 `official_title` 的影片；**未取得歌曲長度基準的影片不得標記 verified**。更新前端快取版本。

## 嚴格區分的狀態

| 項目 | 數量／狀態 |
|---|---|
| 已整理專輯／EP | 14 |
| 已整理不重複曲目 | 129 |
| 已找到 YouTube 候選影片 | 17 |
| 在此 GitHub 版本中標記 verified | 0 |
| 本輪由此任務直接寫入 Firestore | 0 |
| Firestore 現有周蕙歌曲實際數量 | **未知**，管理者先前曾回報「同步完成」，不能憑程式檔推斷 |

所有候選影片仍為 `embedding: pending`，未經正式網站 YouTube IFrame API 試播與長度確認，不會因新增 GitHub 曲目而自動進入雲端。管理者若已匯入，網站會以 Firestore 即時歌單顯示，請勿重複覆寫。

## 本輪來源與候選影片

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

## 下次處理

1. 為其餘 **112 首**（129−17）尚無獨立 YouTube 候選影片的歌曲尋找官方完整 MV、歌詞影片或卡拉 OK；不要把串燒影片當成單首。
2. 逐首查核來源頻道、字幕、完整時長、正式網站嵌入；公開 YouTube 網址並不代表允許嵌入。
3. 通過驗證者再由 Google 管理者登入的網站執行安全匯入；確認 Firestore 伺服器同步及實際新增數量，不覆蓋既有歌曲。
4. 2026 新單曲與戲劇 OST 另行整理，不混入原專輯曲目。
5. 全部可核實工作完成後才通知使用者完成報告；遇到必須使用者授權的阻礙，說明具體操作。
