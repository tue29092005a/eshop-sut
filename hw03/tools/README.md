# Script hỗ trợ (bản sao để nộp)

Các script gốc chạy từ thư mục làm việc `hw03/` (ngoài repo), nên đường dẫn bên trong trỏ tới `eshop-sut/hw03/...`. Muốn chạy lại, đặt thư mục `tools/` cạnh `eshop-sut/` hoặc sửa hằng số đường dẫn ở đầu file.

| Script | Việc | Cách chạy |
|---|---|---|
| `probe.js`, `probe2.js` | Khám phá giao diện ban đầu (ảnh, DOM, tương phản) bằng Playwright | `node probe.js` |
| `build_checklist.py` | Dựng checklist ban đầu (bản 64 mục, đã thay bằng `checklist.xlsx` 77 mục) | `python build_checklist.py` |
| `run_checklist.js` | Thực thi 77 mục trên Chromium, ghi `checklist_results.json` + ảnh Fail | `node run_checklist.js` (SUT đang chạy, DB đã reset) |
| `fill_xlsx.py` | Ghi kết quả JSON vào `checklist.xlsx` | `python fill_xlsx.py` |
| `evidence_api.js` | Ảnh bằng chứng API cho BUG-03, 04, 23 | `node evidence_api.js` |
| `build_bug_report.py` | Dựng `bug_report.md` từ checklist, kiểm tra mọi mục Fail đều có bug và mọi ảnh tồn tại | `python build_bug_report.py` |
| `build_cross_platform.py` | Tạo `cross_platform/cross_platform_results.xlsx` | `python tools/build_cross_platform.py` (từ `hw03/` trong repo) |
| `analyze_usability.py` | Tính SUS, bảng task, pain point từ `usability/data/*.csv` | `python tools/analyze_usability.py usability/analysis.md` |
| `extract_ai_log.py` | Trích nhật ký AI từ transcript Claude Code | `python tools/extract_ai_log.py <thư mục transcript> ai_log/ai_log_full.md` |
