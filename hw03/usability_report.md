# Báo cáo đánh giá khả dụng (Task 2) – EShop

**Sinh viên:** Võ Thành Minh Tuệ – 23120398
**Flow:** Đăng ký → Đăng nhập → Cập nhật hồ sơ → Quên mật khẩu (đặt lại) → Đăng nhập lại
**Phương pháp:** moderated, think-aloud, 7 người + 1 pilot; SUS sau buổi, SEQ sau mỗi task; câu hỏi thăm dò về rõ ràng, khắc phục lỗi, tốc độ, tin cậy.

> **Trạng thái: CHƯA CÓ DỮ LIỆU.** Các phần đánh dấu _(chờ dữ liệu)_ chỉ được điền sau khi chạy buổi thật. Kế hoạch: [usability_plan.md](usability_plan.md). Hướng dẫn nhập liệu: [usability/README.md](usability/README.md).

## 1. Người tham gia

Xem `usability/data/participants.csv` (họ tên, liên hệ che 4 số giữa, hồ sơ, ngày giờ buổi). _(chờ dữ liệu)_

| ID | Họ tên | Liên hệ | Tuổi | Nghề nghiệp | Quen mua online | Ngày giờ | Video |
|---|---|---|---|---|---|---|---|
| P1–P7 | | | | | | | |

## 2. Pilot và điều chỉnh

| Vấn đề phát hiện ở pilot | Điều chỉnh |
|---|---|
| _(chờ dữ liệu)_ | |

## 3. Kết quả định lượng

Chép từ `usability/analysis.md` (sinh bằng `python tools/analyze_usability.py usability/analysis.md`).

### 3.1 SUS
_(chờ dữ liệu)_

### 3.2 Theo task
_(chờ dữ liệu)_

## 4. Tổng hợp pain point

Nhóm các quan sát giống nhau. **Vấn đề hệ thống** = ≥ 3/7 người gặp hoặc do thiết kế; **lỗi đơn lẻ** = 1–2 người gặp.
Mức độ: 4 Blocker (không hoàn thành được) · 3 Major (phải thử nhiều lần / cần hỗ trợ) · 2 Minor (chậm, tự vượt qua) · 1 Cosmetic.

| ID | Pain point | Số người | Phân loại | Mức | Bằng chứng (P, mm:ss) | Bug liên quan |
|---|---|---|---|---|---|---|
| _(chờ dữ liệu)_ | | | | | | |

## 5. Đối chiếu giả thuyết

| Giả thuyết (usability_plan.md §1) | Xác nhận / Bác bỏ / Không rõ | Bằng chứng |
|---|---|---|
| H1 Mật khẩu mạnh có ký tự đặc biệt bị từ chối, bế tắc ở T1 (BUG-01) | | |
| H2 Không có ô xác nhận mật khẩu, gõ nhầm không phát hiện (BUG-02) | | |
| H3 SĐT bắt đầu bằng 0 bị báo sai (BUG-22) | | |
| H4 Sai 2 lần đã bị khóa, không báo rõ (BUG-09, 10) | | |
| H5 Tiêu đề "Đăng Ký", nhãn "Username", nút "Sign In" gây hoang mang (BUG-06, 07) | | |
| H6 Mật khẩu hiện rõ ở trang Đăng nhập làm mất tin tưởng (BUG-08) | | |
| H7 Quên MK: không biết bước, alert(), mật khẩu mới bị từ chối (BUG-14–20) | | |

## 6. Ưu tiên khắc phục và đề xuất

_(chờ dữ liệu: sắp theo mức độ × số người gặp)_

## 7. Bug mới phát hiện qua usability

| Bug | Mô tả | GitHub Issue |
|---|---|---|
| _(chờ dữ liệu)_ | | |

## 8. Hạn chế

- Mẫu 7 người: phù hợp tìm vấn đề, không đủ để kết luận thống kê (khoảng tin cậy SUS rộng).
- SUT chạy localhost trên máy điều phối; người tham gia dùng máy của Tuệ, có thể lạ bàn phím/trình duyệt.
- Do BUG-01/BUG-20, một số task có thể thất bại do lỗi hệ thống, không phản ánh năng lực người dùng; đã áp dụng giao thức hỗ trợ (plan §5.3) để vẫn thu được dữ liệu các task sau.
