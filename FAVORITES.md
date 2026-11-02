# 家庭雲端我的最愛

點歌本每首歌的「♡ 收藏」可選擇具名清單，或新建清單並收藏。「♡ 我的最愛」可改名、移除歌曲、上下調整順序、刪除清單與全部點歌。

- 清單存於 ktvdata-da16f 的 (default) Firestore favoriteLists。所有已授權的家人裝置可讀取、選用及編輯；清單名稱可用暱稱區分家人，不需要額外登入 Google。
- onSnapshot 即時同步；交易處理修改，避免兩台裝置同時收藏時互相覆蓋。每份清單上限 100 首。
- 全部點歌依清單順序，跳過目前播放、已待唱、重複影片、已從歌本移除或沒有影片的歌曲。單機由本機播放，手機包廂模式送到電視待唱，手機不播放。
- 新建、改名、收藏及刪除須連線並取得伺服器回覆，不將離線暫存誤報為已同步。
- 舊版 localStorage 清單保留；有舊資料時顯示「匯入這台裝置的舊清單」。匯入使用固定識別碼，可安全重試，原資料不刪除；超過 100 首時提示拆分。
- 清單引用雲端歌曲 ID，影片及歌名採最新歌本設定；刪除收藏不會更動 songs、裝置授權或目前待唱。

## 啟用

先發布本分支的完整 firestore.rules，再發布 index.html、favorites.js、favorites-cloud.js。沒有發布新規則時，雲端收藏會顯示尚未啟用，不會回退成本機儲存冒充同步。

## 權限規則

沿用既有管理者與已核准家人裝置授權；未核准、停用及其他未授權身分無法讀寫清單。限制欄位、型別與清單大小，建立者與建立時間不可變更。

favoriteLists/{id} 欄位：name (1..40 字)、songIds (以換行分隔的 0..100 個歌曲 document ID，每項 1..512 字且不能含斜線或換行)、deleted (bool)、createdBy/createdAt (不可變)、updatedBy/updatedAt (當次授權身分與伺服器時間)。使用有界字串序列避免未逐項驗證的任意陣列；不存 Google 姓名、Email、照片或權限角色。

查詢只有 where(deleted == false)，不需要複合索引。刪除採 deleted=true，舊裝置的並行更新不能將它復活。

## 驗證

- node --test tests/favorites.test.cjs
- node tests/favorites-ui.integration.cjs（jsdom）
- node tests/room-ui.integration.cjs（jsdom）
- Firestore emulator: node tests/favorites-rules.emulator.cjs（firebase、@firebase/rules-unit-testing）

模擬器測試包含兩個不同授權身分的實際雲端 adapter，覆蓋新增、同步、改名、排序、移除、刪除、同時加入及重複匯入；規則測試覆蓋未登入、未核准、停用、非管理 Google 帳號、冒用作者、修改建立時間、遺漏/多餘欄位、型別、長度、超過 100 首、無效 ID 及刪除後修改。測試僅使用 demo-family-ktv，沒有新增正式歌本或最愛資料。

本次模擬器結果：既有裝置授權 36 項、包廂同步 31 項、最愛規則 28 項皆通過；真實 CloudStore adapter 兩裝置 CRUD、並行加入、重複匯入皆通過。上述同步與權限測試使用模擬器；2026-11-02 已透過 Firebase CLI 成功發布正式 (default) Firestore 規則。未建立正式測試歌曲或最愛清單。
