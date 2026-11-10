# HW03 – Kế hoạch của Tuệ (GUI & Usability, EShop)

> Cập nhật: 2026-11-10 · Nhóm 3 người · Làm cá nhân, nhưng không trùng màn hình chính / flow với 2 bạn còn lại.

## 0. Phạm vi đã chốt

| Mục | Tuệ | Tuấn | Tùng |
|---|---|---|---|
| FR | FR-01, 02, 03, 04 | FR-13, 14, 15, 17 | FR-05, 06, 07, 08 |
| Màn hình checklist | Đăng ký, Đăng nhập, Quên mật khẩu (2 bước), Hồ sơ | Admin | Home, Chi tiết SP, Giỏ, Checkout |
| Flow usability | **Đăng ký → Đăng nhập → Cập nhật hồ sơ → Quên mật khẩu → Đăng nhập lại** | Admin đăng nhập → thêm coupon | Home → giỏ → SAVE10 → checkout |

Không trùng nhau. Tuệ nên chia sẻ lại phạm vi này cho 2 bạn kia để xác nhận.

---

## 1. Kết quả chạy thử sơ bộ trên SUT

Đã `npm install`, `node database.js` (DB đã reset về mặc định sau khi test), đọc mã nguồn 4 trang + backend, và gọi thử API thật.
Nhãn: **[API]** = đã xác minh bằng gọi API thật. **[Code]** = thấy trong mã nguồn, **cần xác minh lại trên giao diện + chụp ảnh** trước khi ghi vào báo cáo / GitHub Issues.

### FR-01 Đăng ký ([Register.jsx](eshop-sut/frontend-web/src/pages/Register.jsx))
| # | Lỗi | Nguồn | Mức |
|---|---|---|---|
| B01 | Backend không validate: đăng ký với email `notanemail`, mật khẩu `1` vẫn thành công | **[API]** | Cao |
| B02 | Email **không duy nhất**: đăng ký trùng `test@eshop.com` vẫn thành công | **[API]** | Cao |
| B03 | Regex mật khẩu sai: bắt buộc có **khoảng trắng** (`(?=.*\s)`) và **cấm ký tự đặc biệt** (`[A-Za-z\d\s]`) → `Test1234!` bị từ chối, mật khẩu hợp lệ không đăng ký được; thông báo lại bảo "cần ký tự đặc biệt" (mâu thuẫn) | [Code] | Cao |
| B04 | Thiếu trường **Xác nhận mật khẩu** | [Code] | Cao |
| B05 | Ô email dùng `type="text"` thay vì `type="email"` | [Code] | Trung bình |
| B06 | Đăng ký xong chuyển thẳng `/login`, không có thông báo thành công | [Code] | Thấp |
| B07 | Mật khẩu không có nút hiện/ẩn, lỗi hiển thị phía trên form, không gắn với từng ô | [Code] | Thấp |

### FR-02 Đăng nhập ([Login.jsx](eshop-sut/frontend-web/src/pages/Login.jsx), [server.js:32](eshop-sut/backend/server.js#L32))
| # | Lỗi | Nguồn | Mức |
|---|---|---|---|
| B08 | Tiêu đề trang đăng nhập ghi **"Đăng Ký"** | [Code] | Trung bình |
| B09 | Ô mật khẩu `type="text"` → **hiện mật khẩu rõ** | [Code] | Cao |
| B10 | Ô email `type="text"`, nhãn **"Username"** (sai, hệ thống dùng email) | [Code] | Trung bình |
| B11 | Nút **"Sign In"** bằng tiếng Anh, trong khi UI còn lại là tiếng Việt | [Code] | Thấp |
| B12 | Bộ đếm sai tăng **+2 mỗi lần** thay vì +1 (sai 1 lần → `login_attempts = 2`) | **[API]** | Cao |
| B13 | Thời gian khóa **180 giây** thay vì 30 giây | [Code] | Cao |
| B14 | Phản hồi đăng nhập trả về **toàn bộ bản ghi user, gồm mật khẩu dạng plaintext** (`"password":"Test1234!"`); `GET /api/users/me` cũng vậy | **[API]** | Rất cao |
| B15 | `tabIndex={1}` trên nút Sign In làm **thứ tự Tab sai** (nút nhảy lên đầu) | [Code] | Trung bình |
| B16 | Link "Quên mật khẩu?" dùng `<a href>` → tải lại cả trang (mất SPA) | [Code] | Thấp |
| B17 | Thông báo lỗi chung chung, không phân biệt trạng thái bị khóa (cần kiểm tra trên UI) | [Code] | Thấp |

### FR-03 Quên mật khẩu ([ForgotPassword.jsx](eshop-sut/frontend-web/src/pages/ForgotPassword.jsx))
| # | Lỗi | Nguồn | Mức |
|---|---|---|---|
| B18 | OTP chỉ **4 chữ số** (spec: 6 chữ số), nhãn ghi "Mã OTP (4 số)" | **[API]** `resetToken:"1270"` | Cao |
| B19 | **Không có chỉ báo bước** ("Bước 1/2") | [Code] | Trung bình |
| B20 | Không có nút **Quay lại đăng nhập** ở bước 1; nút "← Quay lại" ở bước 2 chỉ về bước 1 | [Code] | Trung bình |
| B21 | Bước 2 **thiếu ô Xác nhận mật khẩu mới** | [Code] | Cao |
| B22 | Dùng `alert()` cho mọi lỗi / thành công, không hiển thị lỗi inline | [Code] | Trung bình |
| B23 | Nút "← Quay lại" **cùng màu xanh với nút Đặt lại** → dễ bấm nhầm | [Code] | Thấp |
| B24 | Regex mật khẩu mới sai giống B03 | [Code] | Cao |
| B25 | Email không tồn tại trả 404 "User not found" → lộ việc email có đăng ký hay không (user enumeration) | [Code] | Trung bình |
| B26 | Backend reset-password không kiểm tra độ mạnh mật khẩu, OTP không hết hạn | [Code] | Cao |

### FR-04 Hồ sơ ([Profile.jsx](eshop-sut/frontend-web/src/pages/Profile.jsx), [server.js:118](eshop-sut/backend/server.js#L118))
| # | Lỗi | Nguồn | Mức |
|---|---|---|---|
| B27 | Regex SĐT `^[1-9][0-9]{8,9}$`: **cấm số bắt đầu bằng 0**, chỉ 9–10 số. Spec: bắt đầu `0`, 10–11 số. Placeholder `0912345678` lại bị chính form từ chối | [Code] | Cao |
| B28 | API `PUT /api/users/me` **nhận trường `role`** → user tự nâng quyền admin (leo thang đặc quyền) | [Code] (nên PoC bằng API) | Rất cao |
| B29 | Header dùng `dangerouslySetInnerHTML` với `user.name` → **XSS** (đặt tên `<img src=x onerror=alert(1)>`) | [Code] | Cao |
| B30 | Phản hồi bằng `alert()`; chưa đăng nhập thì chỉ hiện chữ "Vui lòng đăng nhập", không chuyển hướng / không có link | [Code] | Thấp |
| B31 | Không có trạng thái loading, nút không bị vô hiệu khi đang gửi | [Code] | Thấp |

Ngoài phạm vi nhưng thấy cùng trang Hồ sơ (thuộc FR-10/11, có thể báo cho bạn phụ trách): nút **Hủy đơn** vẫn hiện khi đơn đang `shipping`, spec cấm user hủy.

**Tổng sơ bộ: 31 lỗi (6 đã xác minh bằng API, 25 cần xác minh trên UI).**

> Lưu ý: chưa chạy frontend trên trình duyệt, chưa xem accessibility / dark mode / RTL / responsive. Phần này sẽ bổ sung khi thực thi checklist.

---

## 2. Có cần tài khoản BrowserStack / LambdaTest không?

**Khuyến nghị: nên tạo (BrowserStack trial là đủ), nhưng không bắt buộc.** Lý do:

1. Task 3 chiếm **20 điểm** và yêu cầu chạy Task 1 trên **≥ 3 nền tảng** (Chrome, Firefox, và Safari *hoặc* Android Chrome *hoặc* Expo Go). Đề ghi BrowserStack/LambdaTest là lựa chọn **"strongly preferred"**.
2. **Safari** chỉ có trên macOS/iOS. Windows của Tuệ không có Safari → cloud là cách dễ nhất. Nếu không dùng Safari thì có thể thay bằng Android Chrome hoặc Expo Go.
3. Ảnh phải thấy **localhost URL + tên trình duyệt/OS + email sinh viên**. Với cloud phải bật BrowserStack Local (tunnel) để truy cập `localhost:5173`.

**Nếu không muốn tạo tài khoản**, đề cho phép thay bằng thiết bị thật, miễn ảnh thể hiện rõ trình duyệt/OS/thiết bị cùng URL localhost:
- Chrome (Windows) + Firefox (Windows) + Android Chrome hoặc Expo Go trên điện thoại thật cùng mạng LAN.
- Điểm yếu: không có Safari, và phải tự chứng minh tính xác thực của ảnh.

**Lưu ý:** trial thường giới hạn số phút / số phiên → gom việc, chuẩn bị sẵn checklist rồi mới mở phiên. Tuệ cần tự đăng ký (tôi không thể tạo tài khoản thay).

---

## 3. Kế hoạch thực hiện (theo thứ tự, mỗi bước 1 commit)

Ước lượng tổng: ~10 giờ theo đề. Mỗi bước: AI hỗ trợ → Tuệ rà soát → ghi log AI.

| Bước | Việc | Đầu ra | Commit |
|---|---|---|---|
| 1 | Chạy SUT local (backend 3000, frontend-web 5173), khám phá thủ công 4 màn | Ghi chú khám phá | `chore: setup SUT and explore` |
| 2 | Sinh checklist bằng AI **từng bước**: (a) IA-01 UI chung, (b) IA-02 Form, (c) IA-03 Navigation, (d) IA-04 Feedback/State, trên 4 màn | `checklist_ai.md` + log prompt | `docs: AI-generated checklist` |
| 3 | Rà soát, loại trùng, **thêm item AI bỏ sót** (a11y, dark mode, RTL, responsive, tab order, độ tương phản, XSS, lockout…) + ghi lý do AI bỏ sót → **> 40 item**, mục tiêu ~60 | `checklist.xlsx` | `docs: reviewed checklist` |
| 4 | Thực thi checklist: Pass/Fail + Notes, ảnh chỉ cho Fail | cột kết quả + `/screenshots` | `test: execute checklist` |
| 5 | Ghi bug (Markdown + GitHub Issues, ảnh từng issue); bắt đầu từ bảng mục 1 | `bug_report.md` + issue | `docs: bug report` |
| 6 | Usability Phase 1: mục tiêu, kịch bản (mục tiêu, không từng bước), SUS, câu hỏi thăm dò (rõ ràng / khắc phục lỗi / tốc độ / tin cậy), tuyển 7 người, **pilot 1 người** | `usability_plan.md` | `docs: usability plan + pilot` |
| 7 | Phase 2: 7 buổi (nói to khi làm, quay màn hình, ghi chú, SUS, thăm dò) — mỗi buổi 1 commit | `/sessions/P1..P7` | `test: usability session Pn` ×7 |
| 8 | Phase 3: tính SUS, gom pain point, phân loại, xếp mức độ, báo bug thật | `usability_report.md` | `docs: usability analysis` |
| 9 | Task 3: chạy lại checklist trên ≥ 3 nền tảng, ảnh có URL + trình duyệt/OS + email sinh viên | `/cross_platform` | `test: cross-browser run` |
| 10 | Agent Skill (checklist + usability) + video demo YouTube | `/skills` + link | `feat: agent skills` |
| 11 | AI Audit Report + AI Critique (200–300 từ) | `ai_audit.md` | `docs: AI audit & critique` |
| 12 | README (tự chấm + test summary), xuất `git log` ra file, đóng gói zip | `README.md`, `git_log.txt` | `docs: final submission` |

Tên file nộp: `<MSSV>_HW03_AI_GUIUsability_<điểm 3 số>.zip`

### Lưu ý về yêu cầu chống gian lận
- **Danh sách 7 người tham gia phải thật**, ngoài lớp, có SĐT/Zalo che 4 số giữa; TA có thể gọi ngẫu nhiên 2 người. Không thể dùng AI tạo.
- Ảnh cross-platform phải thể hiện đúng họ tên + MSSV/email của Tuệ.
- Nội dung AI phải được Tuệ rà soát, không nộp nguyên bản thô.

---

## 4. Việc cần Tuệ cung cấp / quyết định

- [ ] MSSV 23120398, họ tên Võ Thành Minh Tuệ, email sinh viên 23120398@student.hcmus.edu.vn(để đặt tên file, chèn lên ảnh).
- [ ] Chọn: dùng BrowserStack/LambdaTest hay thiết bị thật (xem mục 2). Có điện thoại Android / iPhone không?. Chọn browserStack, có điện thoại iphone
- [ ] 7 người tham gia: đã có ai chưa? Cần danh sách (tên + liên hệ) từ Tuệ. Hiện đã có 7 người.
- [ ] Hạn nộp trên Moodle. 1h chiều ngày 12/10
- [ ] Repo GitHub để mở Issues (tên repo + quyền truy cập).
- repo https://github.com/tue29092005a/eshop-sut

- [ ] Có muốn đưa thêm màn **Mobile (Expo Go)** vào Task 3 để thay Safari không? không
- [ ] Xác nhận với Tuấn/Tùng: flow và màn hình không trùng (đặc biệt Tùng có Checkout dùng chung header/đăng nhập).
ok đã không trùng, hãy kiểm tra lại

## 5. Cách chạy SUT (đã cài xong dependencies)

```bash
# Terminal 1
cd eshop-sut/backend && node server.js        # http://localhost:3000
# Terminal 2
cd eshop-sut/frontend-web && npm run dev      # http://localhost:5173
# Reset DB khi cần: cd eshop-sut/backend && node database.js
```
Tài khoản: `admin@eshop.com / Admin123!`, `test@eshop.com / Test1234!`.
