# 家庭包廂：手機點歌，電視播放

## 保留的功能

預設仍是「這台點歌・這台播放」，原本單機待唱、自動接歌、切歌確認、歌本燈箱、筆畫排序、雲端歌本、裝置授權及新增的 OST 分類皆保留。未使用包廂時，不會建立或訂閱包廂資料。

切換播放模式會清除此裝置目前的單機待唱與播放器，操作前會詢問。包廂的共用歌單不會因手機離開而刪除。

## 第一次啟用

原有 Google 管理登入及匿名裝置授權設定不用重做。只須將本儲存庫最新的 `firestore.rules` 完整貼到 Firebase 專案 `ktvdata-da16f` → Firestore Database → 規則，再按「發布」。此檔案同時包含原本的歌本、管理者、裝置規則及新增的 rooms 規則，不要只貼 rooms 片段。

GitHub Pages 發布只更新網頁，不會自動將規則發布到 Firebase；未發布規則時，單機點歌仍可使用，但建立包廂會被資料庫拒絕。本次沒有可用的正式專案管理登入，因此正式規則需由管理者發布。

## 平常怎麼使用

1. 電視瀏覽器開啟網站並通過既有裝置授權，按「建立電視包廂」。
2. 電視按「開始電視播放」；需要時再按「電視全螢幕」。若瀏覽器阻擋有聲播放，使用遙控器按「繼續播放」。
3. 已授權手機掃描電視上的 QR Code。也可開啟網站 →「加入包廂」→ 輸入 8 碼包廂代碼 →「手機點歌」。
4. 手機按「＋點歌」，只加入電視的共用待唱，不在手機播放。分類整批加入依目前排序送出。手機可查看正在播放與待唱，並送出暫停／播放、重唱、切換版本、下一首、優先及移除操作。
5. 電視是唯一推進播放的裝置；手機鎖屏或關閉網頁，不影響電視。電視需保持網站開啟、連網及有音訊播放權。
6. 要恢復原本使用方式，按「這台點歌・這台播放」。手機離開包廂不會停止電視。

## 電視斷線、重新整理或換裝置

- 播放權每 15 秒續約，有效 45 秒。裝置失去播放權或偵測到到期時，會停止本機播放，轉為遙控端，避免兩台電視同時接歌。
- 原電視已離開包廂，另一台可輸入原代碼並選「接手電視播放」。直接關閉原網頁時，可能需等約 45 秒讓播放權到期。
- 新電視或重新整理後接手，需再次按「開始電視播放」，目前歌曲會從開頭播放，不會還原影片秒數。
- 若原電視只是沒網路但仍在播放 YouTube 緩衝，瀏覽器背景計時或網路故障可能延遲停播。系統不宣稱能在斷線時保證精準同步。
- 若整台電視的瀏覽器不支援 YouTube IFrame API、Firebase SDK 或有聲播放，需換用支援的 Browser App；仍需在實際電視上驗證。手機送指令不能繞過瀏覽器自動播放限制。
- 網頁播放器內直接暫停不會回報到雲端；遙控端顯示的是最後收到的包廂播放／暫停指令。建議用本網站按鈕控制。

## 權限及資料

- 沿用管理者或已核准匿名裝置資格；已停用或未授權者不能讀寫包廂。
- 包廂代碼與 QR Code 只用來選擇包廂，不會授予權限。這是單一家人的共用空間：任何已核准家人取得代碼後均可加入、點歌及控制，不是每個包廂另設成員名單。
- rooms 文件只記錄播放裝置 UID、隨機頁面識別碼、播放權有效時間、建立時間、歌曲版本、目前待唱紀錄及播放設定。
- queue 文件只記錄雲端歌曲文件 ID、加入者 UID、加入時間、批次順序、狀態及優先標記；commands 只記錄動作、目標歌曲版本、加入者 UID、時間及已處理狀態。沒有 Google 姓名、Email、頭像或硬體識別資料。
- 排隊及控制指令以個別文件加入，避免同時點歌互相覆蓋。切歌以歌曲版本及交易比對，重複或過期指令只標記處理，不會跳掉下一首。
- 待唱讀取只監聽 waiting／playing，指令只監聽尚未處理的資料，不會每次下載全部歷史。已完成紀錄仍保留在資料庫，沒有自動清除歷史。
- 介面限制待唱約 100 首；多人同時加入可能略超過此數。這是操作限制，不宣稱是防止惡意寫入或費用的後端配額。規則則限制每個文件的欄位、型別與大小。
- 批量點歌每 5 首一個交易，以符合 Firestore 規則的跨文件存取上限。中途失敗會顯示已加入幾首，不宣稱整批全數成功。
- 規則允許活躍播放端對終態文件做完全相同的無變更寫入，讓同時切歌交易能正常處理衝突／重試；不允許改寫已完成紀錄的內容。

## 原型規則與驗證

I've set up prototype Security Rules to keep the data in Firestore safe. They are designed to be secure for family room playback by requiring approved devices, limiting TV lease ownership, validating exact room/queue/command schemas, and preventing clients from advancing the queue as a remote. However, you should review and verify them before broadly sharing your app. If you'd like, I can help you harden these rules.

- Firestore 模擬器：31 項包廂整合／權限檢查，包括真實 SDK 多裝置同時點歌、批量順序、重複切歌、重唱、暫停／播放、切換版本、接手、播放權到期及停用裝置。
- 原本裝置規則也以擴充後完整規則重新測試。
- 單元測試 25 項，加上 DOM 整合測試驗證原本單機操作、手機不載入影片、回單機、電視按開始後才播放、QR Code、心跳不重播及撤銷權限後清空。
- 尚未替使用者的實際手機與電視完成正式端對端實播；正式規則需發布後才可測試。

### 重現測試

```sh
npm install --no-save firebase @firebase/rules-unit-testing jsdom firebase-tools@14.22.0
node --test tests/*.test.cjs
node tests/room-ui.integration.cjs
npx firebase emulators:exec --project demo-family-room --only firestore "node tests/room-integration.emulator.cjs"
npx firebase emulators:exec --project demo-family-ktv --only firestore "node tests/device-rules.emulator.cjs"
```

本次以 Java 17、firebase-tools 14.22.0 進行模擬器驗證。測試使用 demo 專案，不會寫入正式資料庫。
QR Code 使用本機隨網站提供的 qrcode-generator（MIT），不將包廂網址傳給外部 QR Code 圖片服務。

### 安全檢查摘要

| 情境 | 結果 |
|---|---|
| 未登入或未核准裝置讀取包廂、孤立子集合 | 拒絕 |
| 列出所有包廂 | 拒絕，僅能讀取已知代碼 |
| 一般成員搶走未到期的電視播放權 | 拒絕 |
| 偽造他人加入者、無效歌曲、直接寫 playing 狀態 | 拒絕 |
| 寫入 Email 等額外欄位、錯誤順序數值 | 拒絕 |
| 偽造已處理控制指令、未知動作、超前歌曲版本 | 拒絕 |
| 超長播放權租期 | 拒絕 |
| 重寫待唱歌曲參照、由手機將播放中歌曲寫成完成 | 拒絕 |
| 已停用裝置繼續查詢待唱或送指令 | 拒絕 |
| 目前電視續約、過期後接手、優先／移除等待中歌曲 | 依規則允許 |
| 原本 admins、devices、songs 的不可變欄位及管理權限 | 原有規則保留；舊裝置測試重新執行 |
