# Dung lai bug_report.md: lay noi dung 34 bug cu (bugs/bug_report.md), gan lai ID checklist moi
# (eshop-sut/hw03/checklist.xlsx) va anh trong eshop-sut/hw03/screenshots, them bug moi tu lan chay checklist.
# Cach dung (tu thu muc hw03): python tools/build_bug_report.py
import re, openpyxl

SRC = 'bugs/bug_report.md'
OUT = 'eshop-sut/hw03/bug_report.md'
XLSX = 'eshop-sut/hw03/checklist.xlsx'

# bug -> (cac muc checklist, anh bang chung)
MAP = {
 'BUG-01': (['IA02-06', 'IA02-08'], ['IA02-06.png']),
 'BUG-02': (['IA02-09'], ['IA02-09.png']),
 'BUG-03': (['IA02-04'], ['IA02-04.png', 'BUG-03-api.png']),
 'BUG-04': (['IA02-05'], ['IA02-05.png', 'BUG-04-api.png']),
 'BUG-05': (['IA02-03'], ['IA02-03.png']),
 'BUG-06': (['IA01-02'], ['IA01-02.png']),
 'BUG-07': (['IA01-01', 'IA01-03'], ['IA01-03.png']),
 'BUG-08': (['IA02-11'], ['IA02-11.png']),
 'BUG-09': (['IA04-04'], ['IA04-04.png']),
 'BUG-10': (['IA04-04', 'IA04-05'], ['IA04-05.png']),
 'BUG-11': (['ADD-14'], ['B14-login-response.png', 'B14-me-response.png']),
 'BUG-12': (['IA03-11', 'ADD-09'], ['IA03-11.png']),
 'BUG-13': (['IA03-02'], ['IA03-02.png']),
 'BUG-14': (['IA02-18'], ['IA02-18.png']),
 'BUG-15': (['IA04-09'], ['IA04-09.png']),
 'BUG-16': (['IA03-03'], ['IA03-03.png']),
 'BUG-17': (['IA02-09'], ['IA02-09.png']),
 'BUG-18': (['IA04-08', 'IA04-10', 'IA04-11', 'IA04-12'], ['IA04-10.png', 'IA04-12.png']),
 'BUG-19': (['IA01-08'], ['IA01-08.png']),
 'BUG-20': (['IA02-08', 'ADD-15'], ['ADD-15.png']),
 'BUG-21': (['IA04-08'], ['IA04-08.png']),
 'BUG-22': (['IA02-13', 'IA02-14', 'IA02-15'], ['IA02-13.png', 'IA02-14.png']),
 'BUG-23': ([], ['BUG-23-api.png']),
 'BUG-24': (['ADD-13'], ['ADD-13.png']),
 'BUG-25': (['IA03-07'], ['IA03-07.png']),
 'BUG-26': (['IA02-20', 'IA04-07'], ['IA04-07.png', 'IA02-20.png']),
 'BUG-27': (['IA02-01', 'ADD-01'], ['IA02-01.png']),
 'BUG-28': (['IA01-15', 'ADD-02', 'ADD-03', 'ADD-04'], ['IA01-15.png', 'ADD-02.png', 'ADD-04.png']),
 'BUG-29': (['ADD-11'], ['ADD-11.png']),
 'BUG-30': (['IA01-04', 'IA01-05', 'ADD-05'], ['ADD-05.png', 'IA01-04.png']),
 'BUG-31': (['ADD-12'], ['ADD-12.png']),
 'BUG-32': (['IA01-07'], ['IA01-07.png']),
 'BUG-33': (['IA03-05', 'IA04-01'], ['IA04-01.png']),
 'BUG-34': (['IA02-10', 'ADD-10'], ['ADD-10.png']),
}

# Bug moi phat hien khi chay checklist (khong co trong 34 bug ban dau)
NEW = [
 ('BUG-35', 'Trung bình', '[Hồ sơ] Header không cập nhật họ tên sau khi sửa hồ sơ',
  'Đăng nhập test@eshop.com → /profile → đổi Họ tên thành "Ten Moi 123" → Cập nhật',
  'Header đổi thành "Chào, Ten Moi 123" ngay sau khi cập nhật',
  'DB đã lưu tên mới, ô Họ tên hiện tên mới nhưng header vẫn "Chào, Test User"; phải đăng xuất rồi đăng nhập lại mới thấy',
  ['ADD-16'], ['ADD-16.png']),
 ('BUG-36', 'Thấp', '[Hồ sơ] Trang Hồ sơ cuộn ngang ở màn 375px (bảng đơn hàng tràn)',
  'Mở /profile (đã đăng nhập, có đơn hàng) ở viewport 375×812',
  'Không có cuộn ngang; bảng đơn hàng co lại hoặc cuộn trong khung riêng',
  'scrollWidth 397 > 375; bảng đơn rộng 356px làm cả trang cuộn ngang',
  ['IA01-10', 'IA01-11'], ['IA01-10.png', 'IA01-11.png']),
 ('BUG-37', 'Thấp', '[Hồ sơ] Ngày và tiền trong lịch sử đơn không theo định dạng Việt Nam',
  'Mở /profile trên trình duyệt locale en-US, xem dòng đơn hàng',
  'Ngày dd/mm/yyyy, tiền dùng dấu chấm phân cách nghìn (vd 30.003.000 ₫)',
  '"11/10/2026" (m/d/yyyy), "30,003,000 ₫"; mã gọi toLocaleDateString()/toLocaleString() không chỉ định "vi-VN"',
  ['IA01-14'], ['IA01-14.png']),
 ('BUG-38', 'Thấp', '[Đăng nhập/Đăng ký] Đã đăng nhập vẫn mở được /login và /register',
  'Đăng nhập → gõ trực tiếp localhost:5173/login',
  'Chuyển về trang chủ/hồ sơ hoặc báo "Bạn đã đăng nhập"',
  'Form đăng nhập vẫn hiện bình thường',
  ['IA03-08'], ['IA03-08.png']),
 ('BUG-39', 'Thấp', '[Quên MK] Tải lại trang ở bước 2 mất trạng thái, quay về bước 1 mà không báo',
  '/forgot-password → nhập email → Lấy mã OTP → F5',
  'Giữ bước 2, hoặc báo rõ phải bắt đầu lại',
  'Về bước 1 trống, không thông báo; OTP cũ vẫn còn hiệu lực ở server',
  ['IA03-10'], ['IA03-10.png']),
 ('BUG-40', 'Cao', '[Hồ sơ] Nút "Hủy đơn" vẫn hiện với đơn đang giao và hủy không cần xác nhận',
  'Có đơn ở trạng thái "Đang giao" (shipping) → /profile → bấm Hủy đơn',
  'Đơn đang giao không hủy được (FR-10); hành động hủy có hộp xác nhận',
  'Nút Hủy đơn hiện và bấm là hủy luôn, chỉ có alert "Hủy đơn thành công!". Ghi chú: thuộc FR-10/11 (ngoài phạm vi FR-01–04), báo lại cho bạn phụ trách',
  ['IA04-14'], ['IA04-14.png']),
 ('BUG-41', 'Thấp', '[Hồ sơ] Lịch sử đơn không có trạng thái đang tải',
  'Làm chậm API /orders 1,5s → mở /profile',
  'Hiện "Đang tải…" trong lúc chờ',
  'Hiện "Bạn chưa có đơn hàng nào." ngay cả khi dữ liệu chưa về',
  ['IA04-13'], ['IA04-13.png']),
 ('BUG-42', 'Thấp', '[Đăng ký/Hồ sơ] Họ tên không cắt khoảng trắng, không giới hạn độ dài',
  'Nhập Họ tên 206 ký tự có khoảng trắng đầu/cuối → lưu',
  'Cắt khoảng trắng, có giới hạn độ dài và báo lỗi khi vượt',
  'Lưu nguyên 206 ký tự kể cả khoảng trắng',
  ['IA02-12'], ['IA02-12.png']),
 ('BUG-43', 'Thấp', '[Đăng ký] Không đánh dấu trường bắt buộc',
  'Mở /register',
  'Trường bắt buộc có dấu * hoặc chú thích "bắt buộc"',
  'Không có dấu hiệu, chỉ biết khi trình duyệt chặn lúc gửi',
  ['IA02-02'], ['IA02-02.png']),
 ('BUG-44', 'Thấp', '[Đăng ký] Thông báo lỗi mật khẩu không nêu điều kiện còn thiếu',
  '/register → mật khẩu `abcd1234` → Đăng Ký',
  'Báo cụ thể điều kiện thiếu (chữ hoa, ký tự đặc biệt), đặt cạnh ô mật khẩu',
  'Một câu chung "Mật khẩu quá yếu!…" ở đầu form',
  ['IA02-07'], ['IA02-07.png']),
 ('BUG-45', 'Thấp', '[Giao diện] Khoảng cách và trạng thái hover không nhất quán giữa các màn',
  'So sánh 4 màn: khoảng cách nhãn → ô nhập, hover nút chính',
  'Cùng khoảng cách; nút chính đều đổi màu khi hover',
  'Hồ sơ 4px, 3 màn khác 8px; nút Quên MK và Hồ sơ không đổi màu khi hover',
  ['IA01-06', 'IA01-12'], ['IA01-06.png', 'IA01-12.png']),
]

src = open(SRC, encoding='utf-8').read()
blocks = re.split(r'(?m)^## (?=BUG-\d+)', src)[1:]
old = {}
for b in blocks:
    head, body = b.split('\n', 1)
    bid, title = head.split(' – ', 1)
    f = dict(re.findall(r'- \*\*(.+?):\*\* (.*)', body))
    old[bid] = (f['Mức độ'], title.strip(), f['Bước tái hiện'], f['Kỳ vọng'], f['Thực tế'])

bugs = [(k, *old[k], *MAP[k]) for k in MAP] + NEW

# kiem tra: moi muc Fail trong checklist deu thuoc it nhat 1 bug
ws = openpyxl.load_workbook(XLSX)['Checklist']
fails = [r[0] for r in list(ws.iter_rows(values_only=True))[1:] if r[7] == 'Fail']
covered = {c for b in bugs for c in b[6]}
missing = [f for f in fails if f not in covered]
assert not missing, missing

lv = {'Rất cao': 0, 'Cao': 0, 'Trung bình': 0, 'Thấp': 0}
for b in bugs: lv[b[1]] += 1

L = ['# Bug Report – EShop (Võ Thành Minh Tuệ – 23120398)', '',
     'Phạm vi: Đăng ký (FR-01), Đăng nhập (FR-02), Quên mật khẩu (FR-03), Hồ sơ (FR-04) trên `frontend-web` (`localhost:5173`).',
     f'Nguồn: {len(fails)} mục Failed của `checklist.xlsx`, gom thành **{len(bugs)} bug** (một bug có thể ứng với nhiều mục). BUG-23 là phát hiện từ đọc mã + gọi API, không có mục checklist UI tương ứng.',
     'Môi trường: Windows 11, Chromium 156 (Playwright) và Chrome thật; DB reset bằng `node database.js` trước mỗi lượt.', '',
     '| Mức độ | Số bug |', '|---|---|'] + [f'| {k} | {v} |' for k, v in lv.items()] + ['',
     '| Bug | Mức | Tiêu đề | Mục checklist | Issue GitHub |', '|---|---|---|---|---|']
for b in bugs:
    L.append(f'| {b[0]} | {b[1]} | {b[2]} | {", ".join(b[6]) or "—"} | _(chưa tạo)_ |')
L.append('')
for b in bugs:
    L += [f'## {b[0]} – {b[2]}', '',
          f'- **Mức độ:** {b[1]}',
          f'- **Mục checklist:** {", ".join(b[6]) or "— (phát hiện qua API)"}',
          f'- **Bước tái hiện:** {b[3]}',
          f'- **Kỳ vọng:** {b[4]}',
          f'- **Thực tế:** {b[5]}',
          '- **Ảnh:** ' + ' '.join(f'![{s}](screenshots/{s})' for s in b[7]),
          '- **GitHub Issue:** _(chưa tạo)_', '']
open(OUT, 'w', encoding='utf-8').write('\n'.join(L))
print('bugs', len(bugs), lv, 'fails', len(fails))
