# Task 1 – Kế hoạch làm (GUI Checklist, 30 điểm)

Tên bước theo bảng 12 bước trong plan.md. Bước 2 đã xong (`checklist_ai.md`).
Thiết lập: `cd eshop-sut/backend && node server.js` (3000), `cd eshop-sut/frontend-web && npm run dev` (5173). Tài khoản: `test@eshop.com / Test1234!`.

## Bước 1 – Setup và khám phá (~45 phút) · commit `chore: setup SUT and explore`
1. Chạy backend và frontend, mở `localhost:5173` bằng Chrome.
2. Đi qua cả 4 màn: `/register`, `/login`, `/forgot-password`, `/profile`. Với mỗi màn, thử luồng đúng, rồi thử cố tình sai.
3. Mở DevTools (F12): Console (lỗi đỏ), Network (request và response).
4. Ghi vào `explore_notes.md`: thấy gì lạ, màn nào đã xem, lỗi console.
5. Đối chiếu với bảng B01–B31 trong plan.md: bug nào đã thấy thật trên UI.
- **Xong khi:** `explore_notes.md` có ghi chú cho đủ 4 màn.

## Bước 2 – Checklist AI (đã làm) · commit `docs: AI-generated checklist`
- Việc của bạn: đọc `checklist_ai.md`, kiểm tra nhật ký prompt đúng với những gì đã yêu cầu. Giữ file này nguyên vẹn làm bằng chứng cho AI Audit Report.

## Bước 3 – Rà soát và bổ sung (~2 giờ) · commit `docs: reviewed checklist`
1. Tạo `checklist.xlsx` với cột: ID, IA, Màn, Việc kiểm tra, Kết quả mong đợi, Nguồn (AI / Tuệ), Lý do AI bỏ sót, Kết quả (Pass/Fail), Notes, Ảnh.
2. Chuyển 61 mục AI vào. Với mỗi mục: đọc, sửa câu chữ, xóa mục trùng (ví dụ IA01-04 và IA01-05 có thể gộp), sửa mục sai so với spec.
3. Tự thêm mục AI chưa có. Gợi ý ở mục 4 của `checklist_ai.md`. Mỗi mục thêm phải ghi **lý do AI bỏ sót**, đây là điểm bị chấm. Lý do hợp lệ: prompt chưa nhắc đến, model hay bỏ qua, hoặc đặc thù giao diện này.
4. Mục tiêu: hơn 40 mục, nên đạt khoảng 60, phủ đủ IA-01 đến IA-04 và 4 màn hình.
- **Xong khi:** có `Nguồn` và `Lý do AI bỏ sót` cho mọi mục tự thêm.

## Bước 4 – Chạy checklist (~2.5 giờ) · commit `test: execute checklist`
1. Reset DB trước khi chạy: `node database.js`.
2. Chạy từng mục trên Chrome. Ghi Pass hoặc Fail, và Notes (lý do fail, viết cụ thể).
3. Chỉ chụp ảnh các mục **Fail**. Lưu `screenshots/IA02-06.png` (tên theo ID mục). Ảnh nên thấy rõ lỗi, và thanh URL.
4. Các mục nghi lỗi API: kiểm tra trong Network hoặc dùng Postman/curl, chụp lại response.
5. Cảnh báo: bug khóa tài khoản (+2 mỗi lần, khóa 180 giây) tốn thời gian chờ. Gom các mục login lockout lại làm một lượt.
- **Xong khi:** mọi mục có Pass/Fail, mọi Fail có Notes và ảnh.

## Bước 5 – Bug report (~1.5 giờ) · commit `docs: bug report`
1. Gom các mục Fail thành bug. Mỗi bug: ID, tiêu đề, màn hình, các bước tái hiện, kết quả thực tế, kết quả mong đợi, mức độ (Cao/TB/Thấp), ảnh. Một bug có thể ứng với nhiều mục checklist.
2. Ghi vào `bug_report.md`.
3. Mở GitHub Issues ở `tue29092005a/eshop-sut`, **mỗi bug một issue**, kèm ảnh (kéo thả vào ô nhập). Ghi số issue ngược lại vào `bug_report.md`.
4. Nên mở issue cho bug nặng trước: lộ mật khẩu plaintext (B14), leo thang đặc quyền qua `role` (B28), XSS (B29).
- **Xong khi:** mỗi bug trong `bug_report.md` có link issue tương ứng.

## Lưu ý chung
- Mỗi bước một commit, tên như trên (đề yêu cầu có git log).
- Mỗi lần dùng AI trong bước 3 đến 5, lưu lại prompt và kết quả để dán vào AI Audit Report.
- Bug đánh dấu [Code] trong plan.md chưa xác minh. Phải thấy trên UI hoặc API thật rồi mới ghi là bug.
- Bug B25 và B26 (enumeration, OTP không hết hạn) thuộc mục kiểm tra bảo mật, cân nhắc giữ vào checklist dưới dạng mục AI bỏ sót.
