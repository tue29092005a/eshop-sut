# AI Audit Report – HW03 (Võ Thành Minh Tuệ – 23120398)

**Tuyên bố:** I use AI tools for the following tasks: phân tích đề, khám phá SUT, sinh checklist theo từng IA, chạy checklist tự động, dựng bug report, soạn công cụ usability, viết Agent Skill, soạn nháp tài liệu.

| Công cụ | Model | Môi trường | Thời gian dùng |
|---|---|---|---|
| Claude Code | `claude-sonnet-5-5` (10/11/2026), `claude-opus-5-5` (11/11/2026) | VS Code extension, Windows 11 | 10–11/11/2026 |
| Playwright 1.65 (do AI viết script) | — | Chromium 156 headless | 10–11/11/2026 |

> Log nguyên văn từng lượt (prompt + output) nằm ở [ai_log_full.md](ai_log_full.md), sinh bằng skill `ai-audit-log` (`tools/extract_ai_log.py`) từ transcript Claude Code. **Tuệ cần tự chạy lệnh dưới đây rồi đọc lại, xóa token/mật khẩu thật nếu có trước khi nộp** (AI không được phép tự sao chép transcript vào repo):
>
> ```
> python tools/extract_ai_log.py "%USERPROFILE%/.claude/projects/d--CNTT-2026-2027-KTPM-hw03" ai_log/ai_log_full.md
> ```

## Tóm tắt các lượt chính

Cột "Rà soát của Tuệ" phải do Tuệ tự viết: đã kiểm tra gì, sửa gì, giữ/loại gì.

| # | Thời gian | Prompt (tóm tắt) | Output AI | Rà soát của Tuệ |
|---|---|---|---|---|
| 1 | 10/11 ~10:50 | "Dựa trên yêu cầu hãy đưa ra phần việc cần làm cho Tuệ…" | Phân tích `requirement.md`, đề xuất phạm vi FR-01–04, danh sách việc theo Task 1–3 | Giữ lại hết |
| 2 | 10/11 ~11:05 | Chọn flow Đăng ký → Đăng nhập → Hồ sơ → Quên MK; chạy kiểm tra SUT; viết `plan.md` | Đọc mã 4 trang + `server.js`, gọi API thật, ghi 31 lỗi sơ bộ (6 [API], 25 [Code]) | Chỉ giữ 6 lỗi [API]. 25 lỗi [Code] tôi tự thử lại trên UI rồi mới ghi thành bug. Loại B17 vì FR-02 yêu cầu không lộ nguyên nhân. |
| 3 | 10/11 ~11:40 | "Làm tiếp theo plan" | Script Playwright `probe.js`, `probe2.js`; checklist 64 mục, 34 bug (`build_checklist.py`) | Thứ tự Tab thao tác thật thấy Sign In đứng cuối, khác với kết quả đo của AI, nên đã ghi chú cả hai. |
| 4 | 10/11 | Sinh checklist **4 lượt riêng theo IA-01…IA-04** (prompt nguyên văn trong `checklist_ai.md`) | 61 mục AI (15 + 20 + 12 + 14) | Giữ 61 mục AI và tự thêm 16 mục ADD (a11y, dark mode, RTL, XSS, payload API), mỗi mục có ghi lý do AI bỏ sót. |
| 5 | 10/11 ~17:10 | "Hiện tôi chưa thể đăng ký tài khoản eshop với mật khẩu 123@aA123" | Giải thích regex mật khẩu sai (đòi khoảng trắng, cấm ký tự đặc biệt), khớp BUG-01 | Tự thử lại đăng ký trên UI: Abc@1234 bị từ chối, còn Abc 1234 lại được nhận |
| 6 | 10/11 chiều | Rà soát + bổ sung 16 mục ADD, thực thi 77 mục (`run_checklist.js`), điền `checklist.xlsx`, chụp ảnh Fail | 77 mục: 16 Pass, 61 Fail; ảnh `screenshots/` | Giữ lại hết |
| 7 | 11/11 ~07:00 | "Tôi hiện vẫn chưa thể bổ sung thêm người quay task 2 nên bạn hãy hoàn thành các mục còn lại cho tôi" | Ảnh bằng chứng API BUG-03/04/23; bug report 45 bug khớp ID checklist mới; công cụ + mẫu Task 2; hướng dẫn + overlay + Excel Task 3; 3 Agent Skill; nháp AI audit, critique, báo cáo, README | Xem lại bug report 45 bug và ảnh BUG-23. Sửa critique và audit. Phần Task 2 và 3 tôi tự làm. |

## Những gì AI KHÔNG làm (ràng buộc chống gian lận)

- Không tạo danh sách người tham gia, câu trả lời SUS, ghi chú quan sát hay trích dẫn của người dùng (Task 2 để trống chờ dữ liệu thật).
- Không tạo ảnh cross-platform (Task 3); chỉ chuẩn bị script overlay hiển thị email/MSSV/trình duyệt đọc từ userAgent thật.
- Không tự mở GitHub Issues hay push khi chưa được Tuệ đồng ý.

## Lỗi AI đã mắc và đã được sửa

| Lỗi của AI | Phát hiện bởi | Sửa |
|---|---|---|
| Coi thông báo đăng nhập chung chung là lỗi (B17), trong khi FR-02 yêu cầu "không để lộ chi tiết nguyên nhân" | Đối chiếu spec | Chuyển thành Passed |
| Ghi "Tab đầu tiên nhảy vào Sign In", Tuệ quan sát thấy Sign In đứng **cuối** | Tuệ thao tác thật | Ghi chú cả hai: kết quả phụ thuộc điểm bắt đầu (từ đầu trang vs. sau khi bấm vào ô) |
| Bản plan coi 25 lỗi [Code] là bug khi chưa thấy trên UI | Quy tắc tự đặt trong `task1_plan.md` | Chỉ ghi bug sau khi tái hiện trên UI/API; B17 bị loại |
| Bug report bản đầu trỏ ID checklist cũ (TC-xx) và ảnh `_probe`, không khớp `checklist.xlsx` 77 mục | AI tự kiểm tra chéo ngày 11/11 | Dựng lại bằng `build_bug_report.py`, có kiểm tra tự động: mọi mục Fail đều thuộc một bug, mọi ảnh tồn tại |
| Ảnh "bản ghi API/DOM" do script dựng có thể bị hiểu nhầm là ảnh chụp giao diện | Rà soát | Ghi rõ trong sheet "Ghi chú chạy" của `checklist.xlsx` |
