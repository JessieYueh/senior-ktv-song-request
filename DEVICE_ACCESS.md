# 家庭裝置授權

## 正式啟用（專案：ktvdata-da16f）

網站程式上傳 GitHub 不會替 Firebase 發布規則或啟用登入方式。必須完成下列兩步，後端限制才生效：

1. Firebase 控制台 → Authentication → Sign-in method → 啟用「匿名 Anonymous」。保留原有 Google 登入；不需新增 Email/密碼或電話登入。不啟用匿名帳號 30 天自動清理，否則長輩可能需重新配對。
2. Firestore Database → 規則 → 將本儲存庫 `firestore.rules` 完整貼上並「發布」。保留原有 `admins/{你的 UID}.enabled = true`；不要刪除既有 songs 資料。

你的 Google 帳號兩步驟驗證需本人完成：https://myaccount.google.com/signinoptions/two-step-verification
網站無法開啟、檢查或保證每次 Google 登入都會要求第二步。Google 可能使用已登入的工作階段。

## 家人怎麼用

1. 家人裝置開啟網站，填「客廳平板」等非個人暱稱，按「申請此裝置使用」。不輸入 Google 帳號、姓名或 Email。
2. 管理者使用自己的裝置登入 Google →「帳號與裝置」。與家人核對畫面上的裝置代碼及暱稱後，按「核准此裝置」。代碼是 UID 尾端 8 碼，僅用來核對，不是密碼，也不能代替登入憑證。
3. 家人畫面收到伺服器確認後自動開啟歌本。同瀏覽器保留匿名登入；清除網站資料、換瀏覽器、無痕模式或遺失登入狀態需重新申請。
4. 管理者可停用裝置；已連線裝置收到撤銷通知後清空歌曲、待唱並停止播放器。網路中斷期間無法保證即時撤銷；已下載或已知的影片 URL 無法收回，YouTube 影片本身仍公開。
5. 請勿在家人共用裝置保留 Google 管理登入。裝置遺失時停用對應授權。

## 資料與權限

`devices/{匿名 Firebase UID}` 僅保存四個欄位：label、enabled、createdAt、approvedAt。只保存非個人暱稱、狀態及時間；沒有 IP、硬體序號、定位、Google 姓名、Email、頭像、密碼或登入 Token。

- 匿名使用者可讀取自己的裝置文件，並首次建立未授權文件；不可查詢裝置名單、更新文件或自行授權。
- 既有 Google 管理者可查詢名單、核准、修改暱稱及停用；用戶端不能建立或更改 admins 名單。
- 歌曲只允許既有管理者及已核准的匿名身分讀取；寫入仍只限管理者。
- 新版網頁不再載入預設歌單、合輯或原唱補寫資料，亦不在無權限時顯示本機歌單。既有雲端歌曲不刪除。
- 儲存庫及既有歌曲來源、歷史版本仍為公開；這次不會將曾經公開的歌名或 YouTube 網址變成秘密。新的裝置文件依 Firebase 規則保護。
- 資料庫拒絕寫入任何未定義欄位，不把 Google 基本資料複製到歌曲或裝置文件。Firebase Authentication 本身仍依 Google 登入建立管理帳號紀錄。

## 原型規則與驗證

I've set up prototype Security Rules to keep the data in Firestore safe. They are designed to be secure for a family songbook by requiring administrator approval for anonymous devices, enforcing owner-only device requests, blocking self-approval, and validating exact document schemas. However, you should review and verify them before broadly sharing your app. If you'd like, I can help you harden these rules.

Firestore 模擬器編譯並通過 36 項真實 allow/deny 檢查；應用程式 24 項測試通過。這不代表正式 Firebase 已發布或已完成實際 Google／長輩裝置端對端驗證。

重現規則測試：安裝 Node.js 與 JDK（本次使用 Java 17 + firebase-tools 14.22.0），在專案執行：

```sh
npm install --no-save @firebase/rules-unit-testing firebase firebase-tools@14.22.0
npx firebase emulators:exec --project demo-family-ktv --only firestore "node tests/device-rules.emulator.cjs"
node --test tests/*.test.cjs
```

firebase.json 的模擬器設定不會變更正式 Firebase 登入方式。使用 demo-family-ktv 只會測試本機模擬器。

### 攻擊檢查結果

| 類型 | 結果 |
|---|---|
| 公開列出歌本／裝置、待授權裝置讀歌本 | 拒絕 |
| 讀取他人裝置、非管理者列出裝置名單 | 拒絕 |
| 匿名使用者寫入 enabled=true、自行更新角色 | 拒絕 |
| 非匿名 Google 使用者自行申請裝置 | 拒絕 |
| 以他人 UID 建立文件 | 拒絕 |
| 刪除後重建已停用文件、覆寫已授權文件 | 拒絕 |
| 建立／更新額外 Email 欄位、超長字串、錯誤型別、移除必填欄位 | 拒絕 |
| 修改建立時間、偽造授權時間 | 拒絕 |
| 管理者查詢、核准、停用；核准裝置讀歌本 | 允許 |
| 已停用裝置再次讀取歌本 | 拒絕 |
| 裝置修改歌曲、客戶端修改 admins、自行擴權 | 拒絕 |
| 無關集合／未定義子集合路徑 | 預設拒絕 |
| 過期／快取核准、撤銷後遲到的歌曲回應 | 應用程式測試確認不解鎖／不重填歌單 |
| 排序／計數器／交易重播 | 無新計數器；裝置建立一次；重送申請不覆寫文件 |
| 資源耗盡 | 規則限制文件欄位及大小；不宣稱防止大量匿名註冊或申請，需要另外監控配額 |

官方文件：
- https://firebase.google.com/docs/auth/web/anonymous-auth
- https://firebase.google.com/docs/firestore/security/rules-conditions
- https://support.google.com/accounts/answer/185839
