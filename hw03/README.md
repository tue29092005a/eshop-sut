# HW03 – GUI & Usability · Võ Thành Minh Tuệ – 23120398

Báo cáo chính: [report.md](report.md) · Bug: [bug_report.md](bug_report.md) · Checklist: [checklist.xlsx](checklist.xlsx) / [checklist.md](checklist.md)

## Bảng tự đánh giá

> Điểm tự chấm do Tuệ quyết định; cột dưới đây là gợi ý theo trạng thái hiện tại và phải cập nhật khi xong Task 2, 3.

| # | Tiêu chí | Điểm tối đa | Tự chấm | Bằng chứng |
|---|---|---|---|---|
| 1 | Task 1 – GUI Checklist (thiết kế + thực thi + bug report) | 30 | _(Tuệ điền)_ | 77 mục, 4 IA, 16 mục bổ sung có lý do, 61 Fail có Notes + ảnh, 45 bug |
| 2 | Task 2 – Usability (kịch bản + 7 buổi + phân tích) | 40 | _(Tuệ điền)_ | Kế hoạch xong; 7 buổi **chưa chạy** |
| 3 | Task 3 – Cross-browser / Cross-platform (≥ 3 nền tảng) | 20 | _(Tuệ điền)_ | Chrome, Firefox, Edge: 77 mục, kết quả giống hệt nhau (16 Pass / 58 Fail / 3 API); ảnh BrowserStack cần bổ sung |
| 4 | Agent Skills | 10 | _(Tuệ điền)_ | 3 skill; video demo **chưa có** |
| | **Tổng** | **100** | | |

## Test summary

| Chỉ số | Giá trị |
|---|---|
| Màn hình kiểm thử (Task 1) | 4: Đăng ký, Đăng nhập, Quên mật khẩu (2 bước), Hồ sơ |
| Flow usability (Task 2) | 1: Đăng ký → Đăng nhập → Cập nhật hồ sơ → Quên MK → Đăng nhập lại |
| Mục checklist thiết kế | 77 (61 AI sinh + 16 Tuệ bổ sung) |
| Mục đã thực thi | 77 |
| Passed / Failed | 16 / 61 |
| Bug | 45 (Rất cao 2 · Cao 14 · Trung bình 13 · Thấp 16) |
| GitHub Issues | 0 / 45 (chưa tạo) |
| Người tham gia usability | 0 / 7 (chưa chạy) |
| Nền tảng cross-browser | 3 / 3: Chrome, Firefox, Edge (Windows 11, BrowserStack); không có khác biệt giữa các trình duyệt |
| Video demo skill | chưa có |

## Cấu trúc thư mục

```
hw03/
  README.md                 tự chấm + test summary (file này)
  report.md                 báo cáo chính
  plan.md, task1_plan.md    kế hoạch
  explore_notes.md          ghi chú khám phá thủ công
  checklist_ai.md           checklist AI sinh theo từng IA (kèm prompt)
  checklist.xlsx / .md      checklist sau rà soát + kết quả thực thi
  bug_report.md             45 bug, ảnh nhúng
  screenshots/              ảnh mục Fail + ảnh bằng chứng API
  usability_plan.md         Task 2 Phase 1
  usability/                phiếu quan sát P0–P7, dữ liệu CSV
  usability_report.md       Task 2 Phase 3
  cross_platform/           Task 3: hướng dẫn, overlay, bảng kết quả
  skills/                   3 Agent Skill
  ai_log/                   AI Audit Report, AI Critique, log đầy đủ
  tools/                    script đã dùng (Playwright, Python)
  git_log.txt               git log
```

## Việc còn lại (Tuệ làm)

1. **Task 2:** tuyển 7 người + 1 pilot → chạy buổi theo [usability/README.md](usability/README.md) → điền CSV → chạy script phân tích → viết nhận định trong `usability_report.md`.
2. **Task 3:** bổ sung ảnh BrowserStack có overlay vào `cross_platform/<nền tảng>/` (đã có kết quả, xem [cross_platform/README.md](cross_platform/README.md)).
3. **GitHub Issues:** push repo (để ảnh có URL) rồi tạo 45 issue, ghi số issue vào `bug_report.md`.
4. **Rà soát nội dung AI:** cột "Rà soát của Tuệ" trong `ai_log/ai_audit.md`, đọc lại `ai_critique.md`, xác nhận các mục bổ sung và Notes trong `checklist.xlsx`.
5. Chạy `tools/extract_ai_log.py` để có `ai_log/ai_log_full.md`.
6. Quay video demo skill, xuất PDF cho `report.md` và `ai_log/*.md`, cập nhật `git_log.txt`, nén zip `23120398_HW03_AI_GUIUsability_<điểm>.zip`.
