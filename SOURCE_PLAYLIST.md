# 14 首懷念老歌：獨立伴唱影片

原始曲目清單：https://www.youtube.com/watch?v=21f7PU0eQgk

2026-10-27 改為每首獨立影片，全長播放，不再使用合輯章節切歌。下表依影片標題標示版本；未標示歌手的版本使用「經典老歌伴唱」，不將上傳者誤當成歌手。

| 歌曲 | 版本 | 獨立影片 | 發布頻道 | 長度 |
|---|---|---|---|---|
| 再會吧！心上人 | 經典老歌伴唱 | https://www.youtube.com/watch?v=Vxy_5Rc6hw0 | 自得其樂戀歌 | 3:23 |
| 一縷相思情 | 高勝美 | https://www.youtube.com/watch?v=xiNKN7jx1D4 | jckaraok | 3:24 |
| 梨花淚 | 于櫻櫻 | https://www.youtube.com/watch?v=Cz--B-m6Qq4 | KaraOK4Ever | 3:15 |
| 我在你左右 | 經典老歌伴唱 | https://www.youtube.com/watch?v=xU6Td7WqQa8 | 曲韻會知音 songs for appreciative listeners - Grace 邱素蓉 | 2:57 |
| 含淚的分手 | 于櫻櫻 | https://www.youtube.com/watch?v=Oo0x6ddu1Ls | 陸伯 Louis Tang | 3:14 |
| 遙遠寄相思 | 潘秀瓊 | https://www.youtube.com/watch?v=ON2INsQ-jvQ | jckaraok | 3:49 |
| 寒雨曲 | 尤雅 | https://www.youtube.com/watch?v=WURewUV2BBg | KaraOK4Ever | 2:49 |
| 相逢夕陽下 | 經典老歌伴唱 | https://www.youtube.com/watch?v=td4a9yaOtHs | 影音娛樂台Fujit Music | 3:35 |
| 萍水相逢的人 | 高勝美 | https://www.youtube.com/watch?v=eci0V6m6JtE | 蔡亞蘭 | 3:14 |
| 意難忘 | 經典老歌伴唱 | https://www.youtube.com/watch?v=SZXsMxfcUHg | TC Karaoke | 4:07 |
| 秋詞 | 高勝美 | https://www.youtube.com/watch?v=s7rH5sL7YyI | 樂庭聲視 L&T Music & Video | 3:08 |
| 不了情 | 蔡琴 | https://www.youtube.com/watch?v=PoNphIxQTcU | li li | 3:16 |
| 愛在夕陽下 | 高勝美 | https://www.youtube.com/watch?v=YnhV3CvFE2s | KaraOK4Ever | 3:15 |
| 除了你 | 韓寶儀 | https://www.youtube.com/watch?v=1RPYlsQpty8 | Des Chai | 3:17 |

## 驗證與維護

- 14 個不同影片 ID，均經公開 YouTube 播放頁 metadata 確認狀態 OK、允許內嵌；這不是各裝置完整實播或無廣告保證。YouTube 仍可能依其設定插入廣告。
- 沿用舊有 `chapter_21f7PU0eQgk_起始秒數` 文件 ID，只作為穩定歌曲 ID，已無章節播放意義。
- 未登入的觀眾也會立即將舊合輯連結解析成獨立影片。管理者登入後，自動以交易更新既有文件或新增缺少的文件；重試不重複新增。
- 只替換仍指向舊合輯的影片；保留已手動更換的獨立連結、歌名、原唱、排序、建立人及時間。歌手欄只有舊值為「豪聲唱片合輯」時才會改成版本標示。
- Firestore 欄位及安全規則不變；原唱若尚未設定仍留空。
