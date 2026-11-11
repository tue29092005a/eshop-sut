---
name: usability-eval
description: Lập kế hoạch, điều phối và phân tích một đánh giá khả dụng có điều phối (moderated, think-aloud) cho một flow end-to-end với 5–8 người dùng thật, đo bằng SUS/SEQ và câu hỏi thăm dò. Dùng khi người dùng muốn "làm usability test", "đánh giá khả dụng flow X", "tính điểm SUS", hoặc lặp lại Task 2 HW03 cho flow khác.
---

# Usability Evaluation

Ba phase theo bài giảng. AI soạn công cụ và phân tích; **AI không bao giờ tạo người tham gia, câu trả lời SUS, ghi chú quan sát hay trích dẫn**. Thiếu dữ liệu thật thì để trống và báo người dùng.

## Phase 1 – Lập kế hoạch (`usability_plan.md`)
1. **Mục tiêu:** 4–6 câu hỏi cần trả lời, mỗi câu có cách đo (tỷ lệ hoàn thành, thời gian, SEQ, quan sát, SUS).
2. **Giả thuyết** từ checklist/bug report (H1…Hn, gắn BUG-xx). Không nói với người tham gia.
3. **Kịch bản:** chia flow thành 3–6 task, mỗi task là **mục tiêu**, không có bước, không lộ tên nút. Chuẩn bị thẻ thông tin giả (email riêng mỗi người); để người tham gia tự chọn dữ liệu nếu muốn kiểm giả thuyết về validate.
4. **Công cụ đo:** SUS 10 câu (hoặc UEQ-S, phải giải thích nếu chọn thang khác), SEQ 1–7 sau mỗi task, câu hỏi thăm dò tối thiểu 4 nhóm: rõ ràng, khắc phục lỗi, tốc độ, tin cậy.
5. **Giao thức hỗ trợ:** câu trung tính; bế tắc 3 phút thì ghi Thất bại rồi cho đi tiếp bằng dữ liệu dự phòng; mọi can thiệp đều ghi lại.
6. **Người tham gia:** hồ sơ mục tiêu + điều kiện loại trừ; bảng do người dùng tự điền (liên hệ che 4 số giữa).
7. **Pilot** với 1 người ngoài mẫu; ghi vấn đề và chỉnh sửa trước buổi chính.

## Phase 2 – Mỗi buổi
Chuẩn bị: reset dữ liệu, cửa sổ ẩn danh, quay màn hình (sau khi đồng ý). Mở đầu: "chúng ta thử website, không thử bạn", hướng dẫn think-aloud. Ghi `sessions/Pn/observation.md` (kết quả, thời gian, lỗi, SEQ, mm:ss video, trích dẫn nguyên văn). Kết thúc: SUS rồi câu hỏi thăm dò. Chép dữ liệu vào `data/sus.csv`, `data/tasks.csv`. Một commit mỗi buổi.

## Phase 3 – Phân tích
1. Chạy `python scripts/analyze_usability.py <ra.md>` (bản trong HW03: `hw03/tools/analyze_usability.py`):
   - SUS: câu lẻ = đáp án − 1, câu chẵn = 5 − đáp án, tổng × 2,5; trung bình, trung vị, độ lệch chuẩn, khoảng tin cậy 95% (t); so mốc 68.
   - Task: tỷ lệ hoàn thành (không hỗ trợ), thời gian, số lỗi, SEQ trung bình.
2. **Gom pain point** (affinity): nhóm quan sát giống nhau vào `data/issues.csv`; ≥ 3/7 người hoặc do thiết kế = vấn đề hệ thống, còn lại = lỗi đơn lẻ.
3. **Mức độ:** 4 Blocker · 3 Major · 2 Minor · 1 Cosmetic. Sắp theo mức × số người gặp.
4. Đối chiếu từng giả thuyết: xác nhận / bác bỏ / không rõ, kèm bằng chứng (P, mm:ss).
5. Bug thật mới → bug report + GitHub Issue có ảnh (hỏi người dùng trước khi tạo issue).
6. Nêu hạn chế (cỡ mẫu, môi trường, task thất bại do bug hệ thống).

## Ràng buộc
- Không suy diễn điểm SUS hay hành vi khi chưa có dữ liệu; báo cáo ghi rõ "chờ dữ liệu".
- Không ghi mật khẩu thật của người tham gia; chỉ ghi dạng mật khẩu.
