# HW03 – GUI & Usability: Báo cáo chính

**Sinh viên:** Võ Thành Minh Tuệ – 23120398 – 23120398@student.hcmus.edu.vn
**SUT:** EShop (`frontend-web` React + Vite tại `localhost:5173`, backend Express + SQLite tại `localhost:3000`)
**Repo / Issues:** https://github.com/tue29092005a/eshop-sut

## 1. Phạm vi

Nhóm 3 người, phạm vi không trùng nhau:

| | Tuệ | Tuấn | Tùng |
|---|---|---|---|
| FR | FR-01, 02, 03, 04 | FR-13, 14, 15, 17 | FR-05, 06, 07, 08 |
| Màn checklist | Đăng ký, Đăng nhập, Quên mật khẩu (2 bước), Hồ sơ | Admin | Home, Chi tiết SP, Giỏ, Checkout |
| Flow usability | Đăng ký → Đăng nhập → Hồ sơ → Quên MK → Đăng nhập lại | Admin đăng nhập → thêm coupon | Home → giỏ → SAVE10 → checkout |

## 2. Quy trình làm việc với AI

Mỗi bước: AI hỗ trợ → Tuệ rà soát → ghi log ([ai_log/ai_audit.md](ai_log/ai_audit.md)).

1. **Khám phá** ([plan.md](plan.md), [explore_notes.md](explore_notes.md)): AI đọc mã và gọi API, đưa ra 31 giả thuyết lỗi gắn nhãn [Code]/[API]; Tuệ tự đi qua 4 màn và xác nhận trên UI (vd B14 lộ mật khẩu, ảnh DevTools).
2. **Sinh checklist theo từng IA** ([checklist_ai.md](checklist_ai.md)): 4 lượt prompt riêng cho IA-01…IA-04, cùng một ngữ cảnh chung có spec FR → 61 mục.
3. **Rà soát + bổ sung:** thêm 16 mục `ADD-xx` mà AI bỏ sót, mỗi mục có cột "Lý do AI bỏ sót" (a11y: nhãn gắn ô, `lang`, `<h1>`, tương phản WCAG, aria-live, autocomplete; dark mode; RTL; 404; XSS; payload API lộ mật khẩu; validate phía server; header không cập nhật).
4. **Thực thi:** [tools/run_checklist.js](tools/run_checklist.js) chạy cả 77 mục trên Chromium thật, kèm thao tác tay của Tuệ; ảnh chỉ cho mục Fail.
5. **Bug report:** gom 61 mục Fail thành 45 bug; script kiểm tra mọi mục Fail đều thuộc một bug.

## 3. Task 1 – GUI Checklist

Chi tiết: [checklist.xlsx](checklist.xlsx) (bản Excel, có sheet "Ghi chú chạy") · [checklist.md](checklist.md) (bản Markdown) · ảnh: [screenshots/](screenshots/)

| IA | Tổng | Passed | Failed |
|---|---|---|---|
| IA-01 UI chung | 23 | 5 | 18 |
| IA-02 Form | 23 | 3 | 20 |
| IA-03 Điều hướng | 13 | 5 | 8 |
| IA-04 Phản hồi/Trạng thái | 18 | 3 | 15 |
| **Tổng** | **77** (61 AI + 16 Tuệ bổ sung) | **16** | **61** |

### Vì sao AI bỏ sót các mục bổ sung

| Nhóm lý do | Mục | Giải thích |
|---|---|---|
| Prompt không nhắc tới | ADD-02, 03, 04, 12 | Prompt liệt kê màn và IA nhưng không nhắc metadata trang (`lang`, `title`, `h1`) hay đường dẫn sai |
| Giới hạn của model | ADD-05, 08, 09 | Không đo được tỷ lệ màu hay bấm Tab thật từ mô tả; cần công cụ đo |
| Prompt giới hạn ở "giao diện" | ADD-13, 14, 15 | XSS, payload API, validate server nằm ngoài khái niệm GUI trong prompt nhưng lại là lỗi nặng nhất |
| Đặc thù giao diện | ADD-16 | Lỗi chỉ hiện sau thao tác thật (cập nhật hồ sơ rồi nhìn header) |
| Mục AI hay bỏ qua | ADD-06 (dark mode), ADD-07 (RTL), ADD-01, 10, 11 (trình đọc màn hình) | Checklist AI mặc định hướng tới người dùng phổ thông, LTR, giao diện sáng |

## 4. Bug

Chi tiết: [bug_report.md](bug_report.md). **45 bug**: 2 Rất cao · 14 Cao · 13 Trung bình · 16 Thấp.

Nặng nhất:
- **BUG-11** (Rất cao): `POST /api/login` và `GET /api/users/me` trả mật khẩu plaintext.
- **BUG-23** (Rất cao): user thường tự đặt `role: "admin"` qua `PUT /api/users/me`.
- **BUG-24** (Cao): XSS qua Họ tên (header dùng `dangerouslySetInnerHTML`).
- **BUG-01 / BUG-20** (Cao): regex mật khẩu đòi khoảng trắng và cấm ký tự đặc biệt, nên mật khẩu hợp lệ như `Test1234!` không đăng ký hay đặt lại được.
- **BUG-09 / BUG-10** (Cao): bộ đếm sai mật khẩu +2 mỗi lần, khóa 180 giây thay vì 30 giây.
- **BUG-22** (Cao): SĐT bắt đầu bằng 0 (kể cả placeholder `0912345678`) bị từ chối.

GitHub Issues: _(chưa tạo, xem README mục "Việc còn lại")_.

## 5. Task 2 – Usability Evaluation

- Kế hoạch (Phase 1): [usability_plan.md](usability_plan.md): 6 mục tiêu, 7 giả thuyết, kịch bản 5 task dạng mục tiêu, SUS + SEQ, 13 câu thăm dò (rõ ràng, khắc phục lỗi, tốc độ, tin cậy), giao thức hỗ trợ, pilot.
- Phiếu quan sát từng buổi: [usability/sessions/](usability/sessions/) · dữ liệu: [usability/data/](usability/data/) · công cụ phân tích: [tools/analyze_usability.py](tools/analyze_usability.py).
- Báo cáo phân tích: [usability_report.md](usability_report.md).
- **Trạng thái: chưa chạy pilot và 7 buổi** (đang tuyển người tham gia). Không có dữ liệu nào được điền sẵn hay giả lập.

## 6. Task 3 – Cross-browser / Cross-platform

- Nền tảng (3): Chrome / Windows 11, Firefox / Windows 11, Edge / Windows 11 (BrowserStack Live + Local).
- Hướng dẫn từng mục: [cross_platform/README.md](cross_platform/README.md); bảng kết quả: [cross_platform/cross_platform_results.xlsx](cross_platform/cross_platform_results.xlsx); overlay email/MSSV: [cross_platform/overlay.js](cross_platform/overlay.js).
- Cách chạy: chạy lại 77 mục checklist trên từng nền tảng; mục API (IA04-04, ADD-14, ADD-15) không phụ thuộc trình duyệt nên ghi "Giống nhau (API)". Cột Chrome ban đầu được chạy tự động bằng Playwright (Chromium headless), sau đó Tuệ tự kiểm thử trên cả ba trình duyệt.
- **Kết quả:** mỗi nền tảng 16 Pass, 58 Fail, 3 mục API; **kết quả giống hệt nhau ở cả 77 mục** và trùng Task 1. Mọi lỗi là lỗi của ứng dụng, không có lỗi riêng một trình duyệt, nên không có bug mới từ Task 3.
- Lưu ý: cả ba trình duyệt đều dùng engine Chromium (Chrome, Edge) hoặc Gecko (Firefox); chưa kiểm thử engine WebKit (Safari).
- Ảnh cross-platform: _(Tuệ bổ sung vào `cross_platform/<nền tảng>/` nếu có)_.

## 7. Agent Skills

| Skill | Việc |
|---|---|
| [skills/gui-checklist](skills/gui-checklist/SKILL.md) | Khám phá → sinh checklist theo từng IA → rà soát + lý do AI bỏ sót → thực thi → bug report |
| [skills/usability-eval](skills/usability-eval/SKILL.md) | Kế hoạch → điều phối buổi → SUS/SEQ → gom pain point → mức độ (có script phân tích) |
| [skills/ai-audit-log](skills/ai-audit-log/SKILL.md) | Trích prompt/output từ transcript Claude Code thành AI Audit Report |

Video demo: _(chưa quay)_.

## 8. Phụ lục

- AI Audit Report: [ai_log/ai_audit.md](ai_log/ai_audit.md) · AI Critique: [ai_log/ai_critique.md](ai_log/ai_critique.md)
- Git commit log: [git_log.txt](git_log.txt)
