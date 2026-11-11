---
name: ai-audit-log
description: Trích nhật ký tương tác AI (công cụ, model, thời gian, prompt nguyên văn, output AI) từ transcript Claude Code ra Markdown để làm AI Audit Report cho bài tập. Dùng khi người dùng cần "AI audit", "log prompt", "nhật ký dùng AI" sau một phiên làm việc.
---

# AI Audit Log

1. Xác định thư mục transcript của dự án: `~/.claude/projects/<đường-dẫn-dự-án-thay-dấu-bằng-gạch>/` (mỗi phiên một file `.jsonl`).
2. Chạy: `python scripts/extract_ai_log.py <thư_mục_transcript> <file_ra.md>`.
   - Lấy lượt có `origin.kind == human`, bỏ thẻ hệ thống (`system-reminder`, `ide_selection`…), bỏ lượt subagent.
   - Mỗi lượt: thời gian (giờ VN), model, prompt nguyên văn, mọi đoạn văn bản AI trả lời, tên công cụ AI đã gọi và số lần.
3. Người dùng đọc lại file, xóa dữ liệu nhạy cảm (token, mật khẩu thật) trước khi nộp.
4. Viết bảng tóm tắt trong `ai_audit.md`: mỗi lượt quan trọng 1 dòng (giờ, prompt tóm tắt, output, **người rà soát đã sửa gì**). Cột rà soát do người dùng tự viết.
5. AI Critique 200–300 từ: AI sai/thiếu/thiên lệch ở đâu, vì sao không bắt được, nguyên tắc rút ra. Đếm từ trước khi nộp.

Ràng buộc: không tự bịa lượt tương tác; lượt nào không có trong transcript (ví dụ dùng ChatGPT trên web) thì người dùng tự bổ sung thủ công.
