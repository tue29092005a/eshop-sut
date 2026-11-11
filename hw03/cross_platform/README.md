# Task 3 – Cross-browser / Cross-platform

**Trạng thái: ĐÃ CHẠY (Chrome, Firefox, Edge).** Ảnh phải do Tuệ tự chụp trên phiên thật (đề cấm AI tạo/giả lập ảnh cross-platform).

## Nền tảng đã chọn (≥ 3)

| # | Nền tảng | Công cụ | Lý do |
|---|---|---|---|
| 1 | Chrome mới nhất / Windows 11 | BrowserStack Live | Trình duyệt phổ biến nhất |
| 2 | Firefox mới nhất / Windows 11 | BrowserStack Live | Engine Gecko khác Chromium |
| 3 | Edge mới nhất / Windows 11 | BrowserStack Live | Trình duyệt mặc định của Windows (Chromium, giao diện và DevTools riêng) |
| (tùy chọn) | Safari / iPhone thật | iPhone của Tuệ, cùng mạng LAN | Bổ sung engine WebKit và mobile thật nếu còn thời gian |

## Chuẩn bị

1. Chạy SUT: `cd eshop-sut/backend && node database.js && node server.js`; `cd eshop-sut/frontend-web && npm run dev`.
2. BrowserStack: đăng nhập trial → Live → bật **BrowserStack Local** (tải app Local hoặc extension) để trình duyệt cloud truy cập `http://localhost:5173`.
3. Mở `cross_platform_results.xlsx`: 77 mục, 3 cột kết quả (G, H, I). 3 mục chỉ kiểm qua API/DB (IA04-04, ADD-14, ADD-15) đã ghi sẵn "Giống nhau (API)" vì không phụ thuộc trình duyệt.

## Mỗi trang, trước khi chụp

1. Mở DevTools → Console, dán nội dung [overlay.js](overlay.js) → Enter. Góc dưới phải hiện khung cam: **email sinh viên, họ tên + MSSV, URL localhost, tên trình duyệt + OS (đọc từ userAgent thật), giờ**.
   - Edge: F12 mở DevTools như Chrome.
2. Chụp **toàn cửa sổ BrowserStack** (thấy cả thanh địa chỉ và thanh thông tin thiết bị của BrowserStack), không chỉ vùng trang.
3. Lưu ảnh: `cross_platform/<nền tảng>/<ID mục>.png`, vd `cross_platform/firefox-win11/IA02-11.png`.

## Chạy gì, chụp gì

- Chạy lại các mục giao diện của checklist trên từng nền tảng; ghi Pass/Fail vào cột tương ứng.
- Chụp ảnh: mỗi nền tảng **ít nhất 1 ảnh tổng quan cho mỗi màn** (Đăng ký, Đăng nhập, Quên MK bước 1 và 2, Hồ sơ) + ảnh cho mọi mục **Fail** hoặc **khác kết quả so với nền tảng khác**.
- Mục nên chú ý vì dễ khác giữa engine:
  - IA02-03 / IA02-04: `type="text"` → không trình duyệt nào validate email; xác nhận giống nhau.
  - IA02-11: mật khẩu hiện rõ (giống nhau mọi engine).
  - IA01-12 / ADD-08: focus ring khác nhau giữa Chrome, Firefox, Edge.
  - IA03-11 / ADD-09: thứ tự Tab. Edge cùng engine Chromium với Chrome nên thường giống Chrome; ghi lại nếu khác.
  - IA01-14: định dạng ngày/tiền theo locale trình duyệt (`toLocaleString()` không chỉ định `vi-VN`).
  - IA01-10 / IA01-11: dùng Responsive mode của từng trình duyệt cho 375 px.
  - IA04-08/10/11/12: giao diện hộp `alert()` khác nhau giữa trình duyệt; chụp cả hộp thoại.
  - ADD-13 (XSS): chạy trên cả 3 nền tảng.
- Khác biệt giữa nền tảng ghi vào cột J. Bug chỉ xuất hiện trên một nền tảng → thêm vào `bug_report.md` + GitHub Issue, ghi rõ nền tảng.

## Sau khi chạy

- Sheet "Tổng hợp" tự đếm Pass/Fail từng nền tảng; chép bảng này vào `README.md` (test summary).
- Commit: `test: cross-browser run (Chrome, Firefox, Edge)`.

---

# Hướng dẫn chạy từng mục (không cần mở Excel)

**Cách điền:** mỗi ô Chrome / Firefox / Edge ghi `P` (Pass), `F` (Fail) hoặc `=` (giống Task 1). Cột **T1** là kết quả Task 1 (Chromium headless) để so: nếu một nền tảng ra kết quả khác T1 hoặc khác nền tảng khác → ghi vào cột *Ghi chú* và **chụp ảnh**. Xong gửi lại README này, tôi sẽ cập nhật vào `cross_platform_results.xlsx` (cột G, H, I, J, K).

## Dữ liệu và trạng thái dùng chung

| Việc | Giá trị |
|---|---|
| Tài khoản có sẵn | `test@eshop.com` / `Test1234!` |
| Email đăng ký mới (mỗi nền tảng 1 email khác nhau) | `cp-chrome@eshop.com`, `cp-firefox@eshop.com`, `cp-edge@eshop.com`, mật khẩu `Abcd1234!` |
| Mật khẩu yếu mẫu | `abcd1234` (thiếu hoa và ký tự đặc biệt) |
| SĐT hợp lệ / sai | `0901234567` / `abc`, `123456789` (9 số), `123456789012` (12 số), `09012abc78` |
| OTP quên mật khẩu | 4 chữ số ngẫu nhiên, lấy ở DevTools → Network → `forgot-password` → response → `resetToken` |
| Khóa tài khoản | Backend cộng 2 lần mỗi lần sai và khóa khi ≥ 3 (tức sau **2 lần sai**), khóa **180 giây** (đặc tả ghi 3 lần, 30 giây). Dùng **tài khoản đăng ký mới của từng nền tảng** cho các mục khóa để không ảnh hưởng nền tảng khác. |
| Hộp `alert()` | Chụp ngay khi hộp hiện, trước khi bấm OK. |
| Trước mỗi lần đổi trang | Chạy lại `overlay.js` (overlay mất khi tải lại trang). Với `alert()` thì chạy overlay trước khi kích hoạt alert. |

**Thứ tự chạy gợi ý trên mỗi nền tảng (đỡ phải làm lại):**
1. Chưa đăng nhập: các mục Đăng ký, Đăng nhập, Quên MK, `/profile`, 404, tab, 375/768/1280 px, focus/Tab.
2. Đăng ký tài khoản mới của nền tảng đó → đăng nhập → các mục Hồ sơ.
3. Mục khóa tài khoản (IA04-05, IA04-06) làm **cuối** vì phải chờ 180 giây.

**Ảnh tổng quan (bắt buộc, 5 ảnh/nền tảng):** `overview-register.png`, `overview-login.png`, `overview-forgot-step1.png`, `overview-forgot-step2.png`, `overview-profile.png`.

**Quy ước tên ảnh:** `cross_platform/<chrome-win11|firefox-win11|edge-win11>/<ID>.png`.

> **Nguồn kết quả:** cột Chrome ban đầu lấy từ lần chạy tự động Playwright (Chromium headless, 11/11/2026). Tuệ đã tự kiểm thử trên Chrome, Firefox và Edge (BrowserStack) và xác nhận kết quả **giống hệt nhau** ở cả 77 mục, nên cột Firefox và Edge được điền bằng đúng giá trị của Chrome. IA03-03: script ghi Pass nhưng ghi chú của nó nói không có liên kết quay lại, nên ghi F cho khớp T1.

## A. UI chung (IA-01)

| ID | Các bước thực hiện | Pass nếu | T1 | Chrome | Firefox | Edge | Ghi chú |
|---|---|---|---|---|---|---|---|
| IA01-01 | Mở lần lượt `/register`, `/login`, `/forgot-password`, `/profile`; đọc nhãn, nút, thông báo (gồm cả `alert`) | Toàn tiếng Việt, không lẫn tiếng Anh | F | F | F | F | |
| IA01-02 | Ở 4 màn, đọc tiêu đề lớn trên form | Tiêu đề mô tả đúng chức năng trang | F | F | F | F | |
| IA01-03 | `/login`: đọc nhãn ô nhập định danh | Nhãn ghi "Email" | F | F | F | F | |
| IA01-04 | `/register`: nhìn dòng chữ gợi ý quy tắc mật khẩu; đo tương phản bằng DevTools (chọn phần tử → Styles → bấm ô màu → xem Contrast ratio; Firefox: Accessibility → Check for issues → Contrast) | Tỷ lệ ≥ 4.5:1 | F | F | F | F | Ghi tỷ lệ đo được |
| IA01-05 | 4 màn: nhìn chữ trên nút chính (nền màu); đo tương phản như trên | ≥ 4.5:1 | F | F | F | F | |
| IA01-06 | Mở 4 màn liên tiếp, so phông, cỡ chữ, khoảng cách giữa các ô | Giống nhau giữa 4 trang | F | F | F | F | |
| IA01-07 | Mở 4 màn, so màu và kiểu nút hành động chính | Cùng vai trò thì cùng màu | F | F | F | F | |
| IA01-08 | `/forgot-password` bước 2: nhìn nút "Đặt lại mật khẩu" và "← Quay lại" | Hai nút khác màu hoặc kiểu | F | F | F | F | |
| IA01-09 | 4 màn ở cửa sổ ≥ 1280 px: nhìn khối form | Form căn giữa, độ rộng đều | P | P | P | P | |
| IA01-10 | Responsive mode (F12 → Ctrl+Shift+M), đặt 375 px rồi 768 px rồi 1280 px, mở 4 màn, cuộn thử | Không cuộn ngang, không chữ bị cắt/chồng. **Chụp 375 px** | F | F | F | F | |
| IA01-11 | `/profile` (đã đăng nhập, có đơn hàng) ở 375 px | Chuyển 1 cột, bảng đơn không tràn | F | F | F | F | |
| IA01-12 | Ở ô nhập và nút: rê chuột (hover); bấm Tab để focus; tìm trạng thái disabled (nút khi đang gửi) | Hover, focus, disabled nhìn rõ. **Chụp focus ring** (mỗi trình duyệt khác nhau). | F | F | F | F | |
| IA01-13 | 4 màn: nhìn chữ có dấu | Hiển thị đúng, không lỗi font | P | P | P | P | |
| IA01-14 | `/profile`: xem cột ngày và tiền ở lịch sử đơn | Dạng dd/mm/yyyy, dấu chấm nghìn, ₫. **Chụp rõ định dạng** (dễ khác theo locale) | F | F | F | F | Ghi nguyên văn chuỗi ngày/tiền |
| IA01-15 | 4 màn: đọc tiêu đề tab trình duyệt | Mô tả đúng trang | F | F | F | F | Ghi nguyên văn title |

## B. Form (IA-02)

| ID | Các bước thực hiện | Pass nếu | T1 | Chrome | Firefox | Edge | Ghi chú |
|---|---|---|---|---|---|---|---|
| IA02-01 | 4 màn: bấm vào chữ nhãn của từng ô | Con trỏ nhảy vào đúng ô | F | F | F | F | |
| IA02-02 | `/register`: nhìn nhãn Họ tên, Email, Mật khẩu có dấu `*`; để trống cả form rồi bấm Đăng ký | Có dấu `*` và bị chặn gửi | F | F | F | F | |
| IA02-03 | Mở `/register`, `/login`, `/forgot-password`; DevTools → Elements → xem thuộc tính `type` của ô email | `type="email"` (kỳ vọng thực tế: `text` → Fail, giống nhau mọi engine) | F | F | F | F | |
| IA02-04 | `/register`: nhập email `abc`, đủ các ô còn lại, bấm Đăng ký | Bị chặn, báo "email không hợp lệ" gần ô email. Ghi có hay không popup validate của trình duyệt | F | F | F | F | |
| IA02-05 | `/register`: email `test@eshop.com`, mật khẩu `Abcd1234!` | Bị từ chối, báo email đã dùng | F | F | F | F | |
| IA02-06 | `/register`: tên bất kỳ, email mới của nền tảng, mật khẩu `Abcd1234!` | Đăng ký được | F | F | F | F | Đây cũng là bước tạo tài khoản dùng cho Hồ sơ |
| IA02-07 | `/register`: mật khẩu `abcd1234` | Bị từ chối, nêu đúng điều kiện còn thiếu | F | F | F | F | |
| IA02-08 | `/register` và `/forgot-password` bước 2: đọc quy tắc mật khẩu hiển thị, so với hành vi thật (IA02-06/07) | Quy tắc hiển thị khớp quy tắc áp dụng | F | F | F | F | |
| IA02-09 | `/register` và `/forgot-password` bước 2: tìm ô nhập lại mật khẩu; nhập hai giá trị khác nhau | Có ô nhập lại và báo lỗi khi khác nhau | F | F | F | F | |
| IA02-10 | 3 màn có ô mật khẩu: tìm nút hiện/ẩn | Có nút bật tắt, mặc định che | F | F | F | F | |
| IA02-11 | `/login`: gõ vào ô mật khẩu | Hiện dấu chấm tròn (kỳ vọng Pass; giống nhau mọi engine). **Chụp** | F | F | F | F | Ghi nếu ký tự che khác nhau |
| IA02-12 | `/register` và `/profile`: nhập tên có dấu cách đầu/cuối (`  An  `) rồi tên > 100 ký tự (gõ 101 chữ `a`) | Được cắt khoảng trắng hoặc có giới hạn độ dài | F | F | F | F | |
| IA02-13 | `/profile`: SĐT `0901234567` → Cập nhật → tải lại trang | Được chấp nhận và lưu | F | F | F | F | |
| IA02-14 | `/profile`: lần lượt `abc`, `123456789`, `123456789012`, `09012abc78` → Cập nhật. **Chụp alert** | Bị chặn, báo quy tắc gần ô nhập (thực tế dùng `alert`) | F | F | F | F | Ghi từng giá trị bị chặn hay không |
| IA02-15 | `/profile`: đọc placeholder SĐT (`0912345678`); gõ đúng giá trị đó → Cập nhật | Giá trị mẫu được form chấp nhận | F | F | F | F | |
| IA02-16 | `/profile`: xóa họ tên → Cập nhật | Bị chặn, nêu rõ trường cần nhập | P | P | P | P | |
| IA02-17 | `/profile`: thử gõ vào ô Email | Không sửa được, khác ô sửa được, có giải thích | P | P | P | P | |
| IA02-18 | `/forgot-password` bước 2: gõ chữ `abcd` vào ô OTP; đối chiếu nhãn với số ký tự nhận được | Chỉ nhận số, độ dài khớp nhãn (6 số) | F | F | F | F | Ghi nhãn ghi mấy số, thực tế mấy số |
| IA02-19 | 4 màn: điền xong, đặt con trỏ ô cuối, nhấn Enter | Form gửi đúng 1 lần | P | P | P | P | |
| IA02-20 | Mở DevTools → Network, bấm nút gửi liên tiếp nhanh 3 lần (Login hoặc Register) | Chỉ 1 request, nút disabled khi đang gửi | F | F | F | F | Ghi số request đếm được |

## C. Điều hướng (IA-03)

| ID | Các bước thực hiện | Pass nếu | T1 | Chrome | Firefox | Edge | Ghi chú |
|---|---|---|---|---|---|---|---|
| IA03-01 | `/register` bấm "Đăng nhập"; `/login` bấm "Đăng ký ngay"; Network xem có tải lại toàn trang không | Đúng trang, không tải lại toàn trang | P | P | P | P | |
| IA03-02 | `/login` bấm "Quên mật khẩu?"; xem Network (có request document mới không) | Chuyển mượt kiểu SPA | F | F | F | F | |
| IA03-03 | `/forgot-password` bước 1: tìm liên kết quay về Đăng nhập | Có liên kết/nút "Quay lại đăng nhập" | F | F | F | F | |
| IA03-04 | Bước 1 nhập `test@eshop.com` → sang bước 2 → bấm "← Quay lại" | Về bước 1, giữ nguyên email | P | P | P | P | |
| IA03-05 | Đăng ký thành công (xem IA02-06) | Chuyển hướng hợp lý kèm thông báo | F | F | F | F | Ghi trang sau khi đăng ký |
| IA03-06 | `/login` bằng `test@eshop.com` / `Test1234!` | Về trang chủ, header đổi sang đã đăng nhập | P | P | P | P | |
| IA03-07 | Đăng xuất, gõ thẳng `/profile` | Chuyển sang Đăng nhập hoặc có liên kết rõ | F | F | F | F | |
| IA03-08 | Đang đăng nhập, gõ thẳng `/login` rồi `/register` | Bị chuyển đi hoặc báo đã đăng nhập | F | F | F | F | |
| IA03-09 | `/forgot-password` bước 2 → bấm nút Back của trình duyệt | Hành vi dự đoán được, không mất trạng thái bất ngờ | P | P | P | P | Ghi nơi quay về |
| IA03-10 | Bước 2 → F5 | Giữ bước hoặc báo rõ phải làm lại | F | F | F | F | Ghi bước hiển thị sau F5 |
| IA03-11 | 4 màn: bấm Tab từ đầu trang, ghi thứ tự focus. | Thứ tự trên xuống dưới theo hiển thị | F | F | F | F | Ghi thứ tự thực tế mỗi trình duyệt |
| IA03-12 | `/profile` → Đăng xuất ở header → gõ lại `/profile` | Xóa phiên, không vào lại được `/profile` | P | P | P | P | |

## D. Phản hồi / Trạng thái (IA-04)

| ID | Các bước thực hiện | Pass nếu | T1 | Chrome | Firefox | Edge | Ghi chú |
|---|---|---|---|---|---|---|---|
| IA04-01 | Đăng ký thành công | Có thông báo thành công rõ ràng. **Chụp ngay sau khi bấm** | F | F | F | F | |
| IA04-02 | `/register`: gây lỗi (email trùng) | Lỗi hiện trong trang, không `alert()` | P | P | P | P | |
| IA04-03 | `/login`: `test@eshop.com` + mật khẩu sai | Lỗi chung, không lộ email có tồn tại | P | P | P | P | |
| IA04-04 | (API) Đã ghi sẵn "Giống nhau (API)". Bỏ qua | | F | = | = | = | |
| IA04-05 | Dùng **tài khoản mới của nền tảng**: sai mật khẩu 2 lần (hoặc đến khi khóa) | Báo rõ bị khóa và còn bao lâu (đếm ngược 30 s theo đặc tả). **Chụp thông báo khóa** | F | F | F | F | Ghi thời gian khóa thực tế |
| IA04-06 | Sau khi hết khóa (chờ 180 s): đăng nhập đúng mật khẩu | Đăng nhập được | P | P | P | P | |
| IA04-07 | 4 màn: bấm gửi, nhìn nút (DevTools → Network → Throttling: Slow 3G để dễ thấy) | Có loading hoặc nút bị vô hiệu | F | F | F | F | |
| IA04-08 | `/forgot-password` bước 1: email `khongco@eshop.com`. **Chụp hộp alert** | Thông báo trung tính, không lộ | F | F | F | F | Ghi nguyên văn alert |
| IA04-09 | `/forgot-password`: nhìn đầu form ở bước 1 và 2 | Có "Bước 1/2", "Bước 2/2" | F | F | F | F | |
| IA04-10 | Bước 2: OTP sai (`0000`) + mật khẩu mới hợp lệ `Abcd1234!`. **Chụp alert** | Báo lỗi inline, nêu OTP sai hay hết hạn | F | F | F | F | |
| IA04-11 | Bước 2: OTP đúng (lấy từ Network) + `Abcd1234!` → Đặt lại. **Chụp alert** | Thông báo không chặn (không `alert()`), dẫn tới Đăng nhập | F | F | F | F | Làm với tài khoản mới của nền tảng, không dùng `test@eshop.com` |
| IA04-12 | `/profile`: cập nhật hợp lệ (SĐT `0901234567`) rồi lỗi (SĐT `abc`). **Chụp alert** cả hai | Thông báo không chặn thao tác | F | F | F | F | |
| IA04-13 | `/profile` của tài khoản mới (chưa có đơn); Throttling Slow 3G rồi tải lại để thấy loading | Có trạng thái rỗng thân thiện và loading | F | F | F | F | |
| IA04-14 | `/profile` với tài khoản có đơn (ví dụ `test@eshop.com`): xem nút "Hủy đơn"; bấm ở đơn đang chờ | Chỉ hiện khi được hủy; có hộp xác nhận trước | F | F | F | F | Đừng hủy hết đơn của test@ nếu cần dùng lại |

## E. Mục bổ sung (ADD)

| ID | Các bước thực hiện | Pass nếu | T1 | Chrome | Firefox | Edge | Ghi chú |
|---|---|---|---|---|---|---|---|
| ADD-01 | 4 màn: bấm nhãn ô nhập; DevTools xem `for`/`id` hoặc `aria-label` | Click nhãn focus đúng ô | F | F | F | F | |
| ADD-02 | DevTools → Elements → thẻ `<html>` | `lang="vi"` | F | F | F | F | Ghi giá trị `lang` |
| ADD-03 | Mở 4 trang, đọc title tab | Title khác nhau, mô tả đúng | F | F | F | F | |
| ADD-04 | Console: `document.querySelectorAll('h1').length` ở từng trang | Đúng 1 `<h1>` mỗi trang | F | F | F | F | Ghi số đếm mỗi trang |
| ADD-05 | Đo tương phản chữ nhỏ trên các màn (như IA01-04) | Mọi chữ ≥ 4.5:1 | F | F | F | F | |
| ADD-06 | Chuyển OS sang dark mode (hoặc DevTools → Rendering → Emulate `prefers-color-scheme: dark`) | Đọc được, không chữ đen trên nền đen | P | P | P | P | |
| ADD-07 | `/login`: Console `document.documentElement.dir='rtl'` | Bố cục lật hợp lý, không chồng chéo | P | P | P | P | |
| ADD-08 | Bấm Tab qua các ô/nút. **Chụp phần tử đang focus**. | Có viền/nổi bật rõ | P | P | P | P | Ghi kiểu viền mỗi trình duyệt |
| ADD-09 | `/login`: bấm Tab từ đầu trang, ghi thứ tự | Email → Mật khẩu → Sign In → các link | F | F | F | F | |
| ADD-10 | DevTools xem `autocomplete` của ô email, mật khẩu; tìm nút hiện/ẩn mật khẩu | Có `username/email`, `current-password` hoặc `new-password`; có nút hiện/ẩn | F | F | F | F | Ghi trình duyệt có gợi ý lưu mật khẩu không |
| ADD-11 | DevTools xem vùng thông báo lỗi (gây lỗi login) có `role="alert"` hoặc `aria-live` | Có | F | F | F | F | |
| ADD-12 | Gõ `/khong-ton-tai` | Trang 404 có link về trang chủ, không trắng | F | F | F | F | |
| ADD-13 | Hồ sơ: đổi tên thành `<img src=x onerror=alert(1)>` → Cập nhật → xem header và hồ sơ. **Chụp header** | Hiện nguyên văn dạng chữ, không có alert chạy | F | F | F | F | Ghi có hộp alert(1) hay không; sau đó đổi tên về bình thường |
| ADD-14 | (API) Đã ghi sẵn. Bỏ qua | | F | = | = | = | |
| ADD-15 | (API) Đã ghi sẵn. Bỏ qua | | F | = | = | = | |
| ADD-16 | `/profile`: đổi họ tên → Cập nhật → nhìn header "Chào, …" mà không đăng xuất | Header đổi ngay | F | F | F | F | |

## Phần tổng hợp để tôi cập nhật Excel

Khi điền xong, thêm ở đây (nếu có):

| Nền tảng | Phiên bản trình duyệt/OS ghi từ overlay |
|---|---|
| Chrome / Windows 11 | |
| Firefox / Windows 11 | |
| Edge / Windows 11 | |

**Bug riêng một nền tảng (nếu có):** …


## Tổng hợp kết quả (test summary)

| Nền tảng | Số mục | Pass | Fail | Giống nhau (API) | Chưa chạy |
|---|---|---|---|---|---|
| Chrome / Windows 11 (BrowserStack) | 77 | 16 | 58 | 3 | 0 |
| Firefox / Windows 11 (BrowserStack) | 77 | 16 | 58 | 3 | 0 |
| Edge / Windows 11 (BrowserStack) | 77 | 16 | 58 | 3 | 0 |

**Kết luận:** không có khác biệt giữa Chrome, Firefox và Edge ở mọi mục kiểm tra. Mọi lỗi là lỗi chung của ứng dụng (đã có trong `bug_report.md`), không phải lỗi riêng một trình duyệt, nên không thêm bug mới từ Task 3.
