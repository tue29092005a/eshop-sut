---
name: gui-checklist
description: Thiết kế, rà soát và thực thi checklist kiểm thử GUI cho một hoặc nhiều màn hình web theo 4 khía cạnh giao diện (IA-01 UI chung, IA-02 Form, IA-03 Điều hướng, IA-04 Phản hồi/Trạng thái), rồi gom mục Fail thành bug report. Dùng khi người dùng muốn "làm checklist GUI", "kiểm thử giao diện màn X", hoặc lặp lại HW03 trên màn/SUT khác.
---

# GUI Checklist

Kỹ thuật làm theo đúng trình tự bài giảng: sinh từng IA một → con người rà soát → bổ sung mục AI bỏ sót kèm lý do → thực thi → bug report. **Không** sinh cả checklist bằng một prompt chung.

## Đầu vào cần hỏi nếu chưa có
- SUT + URL chạy local, cách reset dữ liệu, tài khoản test.
- Danh sách màn hình trong phạm vi (đường dẫn) và FR/spec liên quan (đọc README/spec của SUT).
- Thư mục đầu ra (mặc định `hw03/`).

## Bước 1 – Khám phá (con người làm, AI hỗ trợ)
1. Đọc mã nguồn các màn trong phạm vi và spec FR tương ứng. Ghi giả thuyết lỗi, gắn nhãn **[Code]** (chưa xác minh) hoặc **[API]/[UI]** (đã thấy thật).
2. Người dùng tự đi qua từng màn, ghi `explore_notes.md`. Chỉ giả thuyết đã thấy thật mới được thành bug.

## Bước 2 – Sinh checklist theo từng IA (4 lượt riêng)
Ngữ cảnh chung đặt đầu mỗi lượt: vai trò kỹ sư kiểm thử GUI, SUT, các màn, tóm tắt FR, định dạng mục (ID, màn, việc kiểm tra, kết quả mong đợi), yêu cầu "viết theo hành vi đúng, không giả định hệ thống có lỗi, kiểm chứng được, không trùng".
| Lượt | Phạm vi thêm vào prompt |
|---|---|
| IA-01 | ngôn ngữ, tiêu đề, nhãn, màu, tương phản, bố cục, responsive, nhất quán |
| IA-02 | nhãn, trường bắt buộc, kiểu input, validate client + server, quy tắc mật khẩu, lỗi tại ô, giữ dữ liệu, Enter, double submit |
| IA-03 | liên kết, chuyển hướng sau hành động, trạng thái đăng nhập, Back, reload, Tab |
| IA-04 | thông báo thành công/lỗi, loading, trạng thái rỗng, khóa, xác nhận hành động nguy hiểm, lỗi mạng |
Lưu prompt nguyên văn + số mục vào `checklist_ai.md` (bằng chứng cho AI Audit).

## Bước 3 – Rà soát và bổ sung (bắt buộc có con người)
- Gộp/xóa mục trùng, sửa mục sai so với spec (ví dụ spec yêu cầu thông báo khóa "không lộ nguyên nhân" thì không được kỳ vọng thông báo chi tiết).
- Thêm mục AI bỏ sót, mỗi mục ghi **Nguồn = người** và **Lý do AI bỏ sót**, chọn 1 trong: (a) prompt không nhắc, (b) giới hạn model (không đo được màu, không bấm phím thật, không thấy payload), (c) đặc thù giao diện (lỗi chỉ hiện sau thao tác thật).
- Danh sách nhắc các vùng AI hay bỏ sót: nhãn gắn ô (for/id), `lang`, `<title>`, `<h1>`, tương phản WCAG đo bằng công cụ, focus ring, tabIndex dương, autocomplete, aria-live, dark mode, RTL, 404, XSS qua dữ liệu người dùng, payload API lộ dữ liệu, validate phía server, trạng thái sau cập nhật (header/cache).
- Mục tiêu > 40 mục, phủ đủ 4 IA và mọi màn. Xuất `checklist.xlsx` với cột: ID, IA, Màn, Việc kiểm tra, Kết quả mong đợi, Nguồn, Lý do AI bỏ sót, Kết quả (Pass/Fail), Notes, Ảnh.

## Bước 4 – Thực thi
- Reset dữ liệu trước mỗi lượt. Chạy trên trình duyệt thật (thủ công hoặc Playwright); mục cần đo (tương phản, Tab order, payload) thì đo bằng công cụ, ghi số liệu vào Notes.
- Pass/Fail cho mọi mục; Notes ghi **lý do cụ thể** cho mỗi Fail; ảnh **chỉ cho mục Fail**, tên `<ID>.png`.
- Ảnh do script dựng (bản ghi API/DOM) phải ghi rõ là bản ghi, không giả làm ảnh chụp giao diện.
- Gom các lỗi tốn thời gian chờ (ví dụ khóa tài khoản) vào một lượt.

## Bước 5 – Bug report
- Gom mục Fail thành bug (1 bug ↔ nhiều mục). Mỗi bug: ID, tiêu đề `[Màn] mô tả`, mức (Rất cao/Cao/TB/Thấp), mục checklist, bước tái hiện, kỳ vọng (dẫn FR), thực tế, ảnh.
- Kiểm tra: **mọi mục Fail phải thuộc ít nhất một bug**, mọi đường dẫn ảnh phải tồn tại.
- GitHub Issues: chỉ tạo sau khi người dùng đồng ý (việc công khai). Ảnh phải nằm trong repo đã push để nhúng được.

## Ràng buộc
- Không đánh Fail dựa trên đọc mã mà chưa thấy trên UI/API thật.
- Không tự điền thay phần "Human review"; đánh dấu rõ chỗ người dùng phải xác nhận.
- Mỗi bước một commit (`docs: AI-generated checklist`, `docs: reviewed checklist`, `test: execute checklist`, `docs: bug report`).
