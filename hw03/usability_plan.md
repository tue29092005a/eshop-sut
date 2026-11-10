# Usability Evaluation – Kế hoạch (Phase 1)

**Sinh viên:** Võ Thành Minh Tuệ – 23120398 · **SUT:** EShop (frontend-web, `http://localhost:5173`)
**Flow:** Đăng ký → Đăng nhập → Cập nhật hồ sơ → Quên mật khẩu (đặt lại) → Đăng nhập lại
**Hình thức:** moderated, 7 buổi (mỗi người một buổi) + 1 buổi pilot (không tính vào 7)

---

## 1. Mục tiêu

Người dùng thật có hoàn thành được vòng đời tài khoản trên EShop mà không cần trợ giúp không? Cụ thể:

| # | Điều muốn biết | Đo bằng |
|---|---|---|
| O1 | Người dùng có **tạo được tài khoản** với mật khẩu họ tự chọn không, và họ hiểu luật mật khẩu đến đâu? | Tỷ lệ hoàn thành T1, số lần thử, lỗi |
| O2 | Họ có **hiểu thông báo lỗi** và biết cách tự khắc phục không (error recovery)? | Quan sát, câu hỏi thăm dò |
| O3 | Họ **mất bao lâu** cho từng bước, và bước nào gây chậm nhất? | Thời gian từng task |
| O4 | Họ có **tin tưởng** hệ thống khi nhập mật khẩu / SĐT / địa chỉ không? | Câu hỏi thăm dò, SUS |
| O5 | Họ thấy luồng **Quên mật khẩu 2 bước** có rõ ràng không (không có chỉ báo bước, OTP hiện trên màn hình)? | Quan sát T4, SEQ |
| O6 | Điểm khả dụng tổng thể (SUS) là bao nhiêu? | SUS |

### Giả thuyết cần kiểm chứng (từ checklist, **không nói với người tham gia**)
| Giả thuyết | Liên quan bug |
|---|---|
| H1: Mật khẩu mạnh thông thường (có ký tự đặc biệt, vd `Matkhau@123`) bị từ chối → người dùng bế tắc ở T1 | BUG-01 |
| H2: Không có ô xác nhận mật khẩu → người dùng gõ nhầm mà không phát hiện | BUG-02 |
| H3: Nhập SĐT bắt đầu bằng 0 (như thói quen) bị báo sai ở T3 | BUG-22 |
| H4: Gõ sai mật khẩu 2 lần là bị khóa mà không báo rõ | BUG-09, 10 |
| H5: Tiêu đề "Đăng Ký" trên trang Đăng nhập, nhãn "Username", nút "Sign In" gây hoang mang | BUG-06, 07 |
| H6: Mật khẩu hiện rõ khi gõ ở trang Đăng nhập làm người dùng lo lắng về bảo mật | BUG-08 |
| H7: Quên mật khẩu: không biết đang ở bước mấy, bị đẩy bằng `alert()`, mật khẩu mới mạnh lại bị từ chối | BUG-14–20 |

> Lưu ý quan trọng: do BUG-01 và BUG-20, **người tham gia có thể không hoàn thành T1 và T4 dù làm đúng**. Đây là phát hiện thật (blocker), không phải lỗi của buổi test. Xem mục 5 (giao thức hỗ trợ) để vẫn thu được dữ liệu cho các task sau.

---

## 2. Kịch bản nhiệm vụ (đưa mục tiêu, không đưa từng bước)

**Đọc cho người tham gia:**

> "Bạn muốn mua sắm trên EShop – một cửa hàng online – nhưng chưa có tài khoản. Hãy làm các việc sau, bạn có thể làm theo cách bạn thấy tự nhiên. Tôi sẽ không chỉ dẫn, vì chúng ta đang thử nghiệm website chứ không phải thử nghiệm bạn. Hãy vừa làm vừa nói to điều bạn đang nghĩ."

| Task | Mục tiêu giao cho người tham gia |
|---|---|
| **T1** | Tạo một tài khoản mới trên EShop cho riêng bạn. |
| **T2** | Đăng nhập vào tài khoản vừa tạo. |
| **T3** | Lưu số điện thoại và địa chỉ giao hàng của bạn vào tài khoản để lần sau đặt hàng nhanh hơn. |
| **T4** | Giả sử bạn đã quên mật khẩu. Hãy đặt một mật khẩu mới cho tài khoản này. |
| **T5** | Đăng nhập lại bằng mật khẩu mới. |

**Thẻ thông tin đưa cho người tham gia** (in/gửi qua chat, mỗi người một email riêng):

| Mục | Giá trị |
|---|---|
| Họ tên | Nguyễn Văn A (dùng tên giả để không thu thập thông tin cá nhân thật) |
| Email | `p1@example.com` … `p7@example.com` (P1–P7 theo thứ tự buổi) |
| Số điện thoại | `0901234567` (hợp lệ theo FR-04: bắt đầu 0, 10 số) |
| Địa chỉ | `12 Nguyễn Huệ, Quận 1, TP.HCM` |
| Mật khẩu | **Tự chọn mật khẩu bạn thường dùng cho tài khoản quan trọng**, và nhớ nó |

Lý do thiết kế:
- Dùng SĐT bắt đầu bằng 0 để kích hoạt H3 một cách tự nhiên.
- Để người tham gia **tự chọn mật khẩu** (không đưa sẵn) nhằm kiểm tra H1/H7 một cách thực tế.
- Dữ liệu giả, nên không có rủi ro về quyền riêng tư.

---

## 3. Người tham gia (7 + 1 pilot)

**Hồ sơ mục tiêu:** người dùng phổ thông đã quen mua sắm online (Shopee/Lazada/Tiki), tuổi 18–55, **ưu tiên không phải IT/tester**.
**Điều kiện:** không phải sinh viên đang học HW03; có liên hệ xác minh được (Zalo/SĐT/email).

### Bảng người tham gia – **Tuệ tự điền, không dùng AI tạo**

| ID | Họ tên | Liên hệ (che 4 số giữa) | Tuổi | Nghề nghiệp | Quen mua online | Ngày giờ buổi | Thiết bị/Trình duyệt | Đồng ý quay màn hình |
|---|---|---|---|---|---|---|---|---|
| Pilot | | | | | | | | ☐ |
| P1 | | 09xx **xxxx** xx | | | | | | ☐ |
| P2 | | | | | | | | ☐ |
| P3 | | | | | | | | ☐ |
| P4 | | | | | | | | ☐ |
| P5 | | | | | | | | ☐ |
| P6 | | | | | | | | ☐ |
| P7 | | | | | | | | ☐ |

> TA có thể gọi ngẫu nhiên 2 người để xác minh; hãy báo trước cho họ. Giả mạo người tham gia = 0 điểm Task 2.
> Pilot nên là **người thứ 8** (không tính vào 7). Có thể nhờ bạn cùng nhóm (Tuấn/Tùng) làm pilot vì pilot không phải một trong 7 người nộp.

---

## 4. Công cụ thu thập

### 4.1 Thang SUS (System Usability Scale) – điền sau buổi test
Chọn **SUS** vì chuẩn, ngắn (10 câu), có điểm chuẩn so sánh (trung bình ≈ 68).

Thang 1 = Hoàn toàn không đồng ý … 5 = Hoàn toàn đồng ý.

| # | Câu |
|---|---|
| 1 | Tôi nghĩ rằng tôi sẽ muốn sử dụng hệ thống này thường xuyên. |
| 2 | Tôi thấy hệ thống này phức tạp không cần thiết. |
| 3 | Tôi thấy hệ thống này dễ sử dụng. |
| 4 | Tôi nghĩ rằng tôi sẽ cần sự hỗ trợ của người am hiểu kỹ thuật để dùng được hệ thống này. |
| 5 | Tôi thấy các chức năng của hệ thống này được tích hợp tốt. |
| 6 | Tôi thấy hệ thống này có quá nhiều điểm không nhất quán. |
| 7 | Tôi nghĩ hầu hết mọi người sẽ học cách dùng hệ thống này rất nhanh. |
| 8 | Tôi thấy hệ thống này rất cồng kềnh, khó dùng. |
| 9 | Tôi cảm thấy rất tự tin khi sử dụng hệ thống này. |
| 10 | Tôi cần phải học rất nhiều thứ trước khi có thể bắt đầu dùng hệ thống này. |

**Cách tính:** câu lẻ (1,3,5,7,9) điểm = đáp án − 1; câu chẵn (2,4,6,8,10) điểm = 5 − đáp án. Tổng 10 câu × 2,5 = **điểm SUS (0–100)**.
Diễn giải: ≥ 80 tốt · ~68 trung bình · < 51 kém.

### 4.2 Thang SEQ sau mỗi task (Single Ease Question)
"Nhìn chung, task này dễ hay khó?" 1 = Rất khó … 7 = Rất dễ.

### 4.3 Câu hỏi thăm dò (hỏi sau SUS, đào sâu vào những gì đã quan sát)

| Nhóm | Câu hỏi |
|---|---|
| **Clarity (rõ ràng)** | 1. Lúc đầu bạn nghĩ cần làm gì để tạo tài khoản? Có chỗ nào bạn không hiểu không? 2. Thông báo nào trên màn hình bạn thấy khó hiểu nhất? 3. Màn hình Quên mật khẩu có cho bạn biết mình đang ở bước nào không? |
| **Error recovery (khắc phục lỗi)** | 4. Khi hệ thống báo lỗi, bạn có biết phải sửa gì không? Bạn đã làm gì tiếp theo? 5. Có lúc nào bạn muốn bỏ cuộc? Vì sao? 6. Bạn mong thông báo lỗi nói gì để dễ sửa hơn? |
| **Speed (tốc độ)** | 7. Bước nào bạn thấy lâu hoặc mất công nhất? 8. So với Shopee/Lazada, đăng ký ở đây nhanh hơn hay chậm hơn? |
| **Trust (tin cậy)** | 9. Bạn có yên tâm khi nhập mật khẩu và số điện thoại ở đây không? Vì sao? 10. Việc mật khẩu hiện rõ khi gõ (nếu có) khiến bạn nghĩ gì? 11. Bạn có sẵn sàng mua hàng bằng tài khoản này không? |
| **Chung** | 12. Điều bạn thích nhất / ít thích nhất? 13. Nếu được sửa 1 thứ, bạn sẽ sửa gì? |

### 4.4 Số liệu đo mỗi task
- **Kết quả:** Hoàn thành / Hoàn thành có hỗ trợ / Thất bại (blocker)
- **Thời gian** (bấm giờ từ lúc đọc xong mục tiêu đến lúc xong)
- **Số lỗi / số lần thử lại**
- **SEQ (1–7)**

---

## 5. Quy trình buổi test

### 5.1 Chuẩn bị trước **mỗi** buổi (5 phút)
1. Reset dữ liệu: `cd eshop-sut/backend && node database.js` (khởi động lại backend `node server.js` nếu cần).
2. Đảm bảo `localhost:3000` và `localhost:5173` chạy; mở **cửa sổ ẩn danh / profile sạch** (xóa token cũ).
3. Mở sẵn trang `http://localhost:5173/`.
4. Bật quay màn hình (OBS/Xbox Game Bar/Zoom) **sau khi người tham gia đồng ý**; ghi âm nếu họ đồng ý.
5. Chuẩn bị: thẻ thông tin (mục 2), phiếu quan sát (Phụ lục A), form SUS, đồng hồ bấm giờ.

### 5.2 Kịch bản (≈ 25 phút)
| Phút | Việc |
|---|---|
| 0–3 | Chào, giải thích mục đích, **"chúng ta thử nghiệm website chứ không phải thử nghiệm bạn"**, xin phép quay màn hình, nhắc nói to khi làm (think-aloud). |
| 3–5 | Câu hỏi nền: tuổi, nghề nghiệp, tần suất mua online. |
| 5–18 | Làm T1 → T5. Sau mỗi task: hỏi SEQ. Người điều phối quan sát, ghi chú, **không gợi ý**. |
| 18–21 | Điền SUS. |
| 21–25 | Câu hỏi thăm dò (mục 4.3), cảm ơn. |

### 5.3 Giao thức hỗ trợ (quan sát trung lập)
- Không giải thích giao diện, không gợi ý. Chỉ dùng câu trung tính: "Bạn đang nghĩ gì?", "Bạn mong chờ điều gì xảy ra?".
- **Bế tắc:** nếu người tham gia không tiến triển sau **3 phút** hoặc nói muốn bỏ cuộc → ghi "Thất bại (blocker)" kèm nguyên nhân, **rồi cho đi tiếp** để thu dữ liệu các task sau:
  - T1 thất bại → cho dùng tài khoản có sẵn `test@eshop.com` / `Test1234!` để làm T2–T3 (ghi rõ: "dùng tài khoản dự phòng").
  - T3 (SĐT) thất bại → ghi nhận, tiếp tục T4.
  - T4 thất bại (mật khẩu mới bị từ chối) → ghi nhận, bỏ qua T5.
- Ghi lại **mỗi lần can thiệp** vào phiếu quan sát (thời điểm, lý do). Task có can thiệp = "Hoàn thành có hỗ trợ".
- **Tuyệt đối không** tiết lộ mật khẩu nào sẽ được chấp nhận.

---

## 6. Pilot

Chạy 1 buổi với người thứ 8 (không tính vào 7), mục đích:
- [ ] Mô tả task có rõ không, người tham gia có hiểu mục tiêu?
- [ ] Thẻ thông tin có đủ không?
- [ ] Thời lượng thực tế so với 25 phút?
- [ ] Reset DB / quay màn hình có trục trặc không?
- [ ] Câu thăm dò có hiểu được không?

Ghi kết quả pilot và các chỉnh sửa vào mục **"Nhật ký pilot"** dưới đây trước khi chạy 7 buổi chính.

### Nhật ký pilot _(Tuệ điền)_
| Vấn đề phát hiện | Chỉnh sửa đã làm |
|---|---|
| | |

---

## 7. Phân tích (Phase 3 – sẽ làm sau khi có dữ liệu)

1. **SUS:** tính điểm từng người, trung bình, độ lệch chuẩn; so với 68.
2. **Task:** bảng tỷ lệ hoàn thành, thời gian trung bình, SEQ trung bình theo task.
3. **Gom pain point:** nhóm các quan sát giống nhau; phân biệt **lỗi đơn lẻ** (1 người gặp) và **vấn đề hệ thống** (≥ 3/7 người gặp).
4. **Mức độ nghiêm trọng:**

| Mức | Định nghĩa |
|---|---|
| 4 – Blocker | Không thể hoàn thành task |
| 3 – Major | Hoàn thành nhưng phải thử nhiều lần/cần hỗ trợ, gây bực bội rõ |
| 2 – Minor | Chậm hoặc hơi khó chịu, người dùng tự vượt qua |
| 1 – Cosmetic | Chỉ là nhận xét thẩm mỹ/ngôn từ |

5. Liên hệ với bug trong checklist (BUG-xx); bug thật mới phát hiện thì ghi lên GitHub Issues kèm ảnh.
6. Đối chiếu H1–H7: giả thuyết nào được xác nhận, cái nào bác bỏ.

---

## 8. Kế hoạch thời gian & đầu ra

| Việc | Đầu ra | Commit |
|---|---|---|
| Pilot | nhật ký pilot ở mục 6 | `docs: usability plan + pilot` |
| 7 buổi chính | `usability/sessions/P1…P7/` (phiếu quan sát, SUS, video, ghi chú) | `test: usability session Pn` (mỗi buổi 1 commit) |
| Phân tích | `usability_report.md` (SUS, bảng task, pain point, severity) | `docs: usability analysis` |

Cấu trúc thư mục gợi ý cho mỗi buổi:
```
usability/sessions/P1/
  observation.md   # phiếu quan sát (Phụ lục A)
  sus.md           # 10 câu trả lời + điểm
  recording.mp4    # hoặc link
```

---

## Phụ lục A – Phiếu quan sát (copy cho mỗi buổi)

```markdown
# Buổi P_ – Ngày giờ: ____  Trình duyệt/thiết bị: ____  Người điều phối: Tuệ
Đồng ý quay màn hình: ☐ có ☐ không · Ghi âm: ☐ có ☐ không
Hồ sơ: tuổi __, nghề __, tần suất mua online __

| Task | Kết quả (HT / HT có hỗ trợ / Thất bại) | Thời gian | Số lỗi/lần thử | SEQ 1–7 | Ghi chú: hesitation, lời nói to, bực bội |
|---|---|---|---|---|---|
| T1 Đăng ký | | | | | |
| T2 Đăng nhập | | | | | |
| T3 Hồ sơ | | | | | |
| T4 Quên MK | | | | | |
| T5 Đăng nhập lại | | | | | |

## Can thiệp của điều phối
| Thời điểm | Lý do | Câu nói |
|---|---|---|

## Lỗi/hiện tượng bất thường quan sát được (kèm timestamp video)
-

## Trích dẫn đáng chú ý (nguyên văn)
-

## SUS (1–5)
| Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Điểm SUS |
|---|---|---|---|---|---|---|---|---|---|---|

## Câu trả lời thăm dò (tóm tắt)
- Clarity:
- Error recovery:
- Speed:
- Trust:
```

## Phụ lục B – Bảng tổng hợp SUS (điền sau 7 buổi)

| P | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | SUS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | | | | | | | | | | | |
| P2 | | | | | | | | | | | |
| P3 | | | | | | | | | | | |
| P4 | | | | | | | | | | | |
| P5 | | | | | | | | | | | |
| P6 | | | | | | | | | | | |
| P7 | | | | | | | | | | | |
| **TB** | | | | | | | | | | | |
