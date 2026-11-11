# Task 2 – Usability: thư mục làm việc

Kế hoạch đầy đủ (mục tiêu, kịch bản, SUS, câu hỏi thăm dò, giao thức): [../usability_plan.md](../usability_plan.md).

## Trạng thái

| Hạng mục | Trạng thái |
|---|---|
| Phase 1: mục tiêu, kịch bản, SUS + SEQ, câu hỏi thăm dò | Xong (`usability_plan.md`) |
| Danh sách 7 người tham gia | **Chưa có**: Tuệ tự điền `data/participants.csv` |
| Pilot (P0) | **Chưa chạy** |
| 7 buổi P1–P7 | **Chưa chạy** |
| Phase 3: phân tích | Script sẵn sàng (`../tools/analyze_usability.py`); viết nhận định sau khi có dữ liệu |

## Quy trình mỗi buổi (khoảng 30 phút gồm cả chuẩn bị)

1. Reset DB: `cd eshop-sut/backend && node database.js`, chạy `node server.js` và `cd ../frontend-web && npm run dev`.
2. Mở cửa sổ ẩn danh tại `http://localhost:5173/`, bật quay màn hình sau khi người tham gia đồng ý.
3. Đọc lời mở đầu và giao 5 task theo `usability_plan.md` §2. Không gợi ý; nếu bế tắc thì làm theo giao thức §5.3.
4. Ghi `sessions/Pn/observation.md` trong lúc làm, hỏi SEQ sau mỗi task.
5. Cho điền SUS, hỏi các câu thăm dò.
6. Chép dữ liệu vào CSV (mỗi người 1 dòng SUS, 5 dòng task):
   - `data/sus.csv`: `P1,4,2,4,1,...`
   - `data/tasks.csv`: `P1,T1,That-bai,240,4,2` (result: `HT`, `HT-ho-tro`, `That-bai`)
7. Commit: `git add hw03/usability && git commit -m "test: usability session P1"`.

## Sau 7 buổi (Phase 3)

1. Gom pain point vào `data/issues.csv`: `U1,Mật khẩu có @ bị từ chối,P1;P2;P4;P6,4,,BUG-01`
   (để trống `type` thì script tự xếp: ≥ 3/7 người = vấn đề hệ thống, ít hơn = lỗi đơn lẻ).
2. Chạy `python tools/analyze_usability.py usability/analysis.md` (từ thư mục `hw03/`).
3. Viết phần nhận định trong `../usability_report.md`: đối chiếu giả thuyết H1–H7, ưu tiên theo mức độ, đề xuất sửa.
4. Bug mới (chưa có trong `bug_report.md`) → thêm vào bug report và GitHub Issues kèm ảnh.
5. Commit: `docs: usability analysis`.

> Không nhập dữ liệu giả. TA có thể gọi 2 người để xác minh; mạo danh = 0 điểm Task 2.
