# -*- coding: utf-8 -*-
"""Sinh checklist.xlsx + checklist.md + bug list tu 1 nguon du lieu duy nhat."""
import os, openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

ROOT = os.path.join(os.path.dirname(__file__), '..')
AI, TUE = 'AI', 'Bổ sung (cần Tuệ xác nhận)'
P, F = 'Passed', 'Failed'

# ---------------- BUGS: id, severity, title, steps, expected, actual, evidence, screens
BUGS = [
 ('BUG-01','Cao','[Đăng ký] Mật khẩu hợp lệ "Test1234!" bị từ chối, regex đòi khoảng trắng và cấm ký tự đặc biệt','Mở /register → nhập Họ tên, email, mật khẩu `Test1234!` → Đăng Ký','Chấp nhận (FR-01: ≥8 ký tự, hoa, thường, số, ký tự đặc biệt @$!%*?&)','Hiện lỗi "Mật khẩu quá yếu…". Mật khẩu `Test 1234` (có khoảng trắng, không ký tự đặc biệt) lại được chấp nhận','register_valid_pwd_rejected.png'),
 ('BUG-02','Cao','[Đăng ký] Thiếu trường Xác nhận mật khẩu','Mở /register','Có ô Xác nhận mật khẩu, từ chối nếu không khớp (FR-01)','Form chỉ có Họ tên, Email, Mật khẩu','register.png'),
 ('BUG-03','Cao','[Đăng ký/API] Backend không validate email và mật khẩu','`POST /api/register {"name":"x","email":"notanemail","password":"1"}`','400 + thông báo lỗi','200 "User registered successfully"','API (curl) – cần ảnh chụp terminal/Postman'),
 ('BUG-04','Cao','[Đăng ký/API] Email trùng vẫn đăng ký được','`POST /api/register` với email `test@eshop.com` đã tồn tại','Từ chối: email phải duy nhất (FR-01)','200, tạo thêm user mới (id 4)','API (curl) – cần ảnh chụp terminal/Postman'),
 ('BUG-05','Trung bình','[Đăng ký/Đăng nhập/Quên MK] Ô email dùng type="text" thay vì type="email"','Mở 3 màn, nhập `abc` vào ô email → submit','Trình duyệt chặn bằng validate HTML5 (FR-02)','Không có validate định dạng phía trình duyệt','login.png'),
 ('BUG-06','Trung bình','[Đăng nhập] Tiêu đề trang ghi "Đăng Ký" thay vì "Đăng Nhập"','Mở /login','Tiêu đề "Đăng Nhập"','Tiêu đề là "Đăng Ký"','login.png'),
 ('BUG-07','Thấp','[Đăng nhập] Nhãn "Username" và nút "Sign In" bằng tiếng Anh, sai ngữ nghĩa (hệ thống dùng email)','Mở /login','Nhãn "Email", nút "Đăng nhập" (đồng bộ tiếng Việt)','Nhãn "Username", nút "Sign In"','login.png'),
 ('BUG-08','Cao','[Đăng nhập] Ô mật khẩu hiển thị chữ rõ (type="text")','Mở /login → gõ vào ô Mật khẩu','Ký tự bị che (type="password")','Mật khẩu hiện nguyên văn','login_pwd_visible.png'),
 ('BUG-09','Cao','[Đăng nhập] Tài khoản bị khóa sau 2 lần sai thay vì 3 (bộ đếm tăng +2/lần)','Đăng nhập sai 2 lần liên tiếp với test@eshop.com rồi đăng nhập đúng','Mỗi lần sai +1; khóa từ lần sai thứ 3 (FR-02)','Sai lần 2 đã khóa (login_attempts=4); đăng nhập đúng bị 403 "Tài khoản đã bị khóa"','login_locked_ui.png + API'),
 ('BUG-10','Cao','[Đăng nhập] Thời gian khóa 180 giây thay vì 30 giây','Làm khóa tài khoản, đọc `locked_until`','Khóa 30 giây (FR-02)','Khóa 180 giây (đo được 180s)','API + mã server.js:57'),
 ('BUG-11','Rất cao','[Đăng nhập/API] Phản hồi trả về mật khẩu plaintext của user','`POST /api/login` đúng thông tin, hoặc `GET /api/users/me`','Không trả trường password','Body chứa `"password":"Test1234!"`','API (curl) – cần ảnh chụp'),
 ('BUG-12','Trung bình','[Đăng nhập] Thứ tự Tab sai do tabIndex=1 trên nút Sign In','Mở /login, nhấn Tab','Tab đi theo thứ tự hiển thị (email → mật khẩu → quên MK → nút)','Tab đầu tiên nhảy vào nút "Sign In", rồi tới logo/menu','(ảnh có focus ring trên nút Sign In)'),
 ('BUG-13','Thấp','[Đăng nhập] Link "Quên mật khẩu?" tải lại cả trang','Mở /login → bấm "Quên mật khẩu?"','Điều hướng SPA (không reload)','Reload toàn trang (dùng <a href>)','(ghi hình hoặc dùng DevTools Network)'),
 ('BUG-14','Cao','[Quên MK] OTP chỉ 4 chữ số thay vì 6','Bước 1 nhập test@eshop.com → Lấy mã OTP','OTP 6 chữ số (FR-03)','OTP 4 chữ số (vd 9750), nhãn "Mã OTP (4 số)"','forgot_step2.png'),
 ('BUG-15','Trung bình','[Quên MK] Không có chỉ báo bước (Bước 1/2)','Mở /forgot-password','Hiện "Bước 1 / 2" (FR-03)','Không có chỉ báo','forgot_step1.png'),
 ('BUG-16','Trung bình','[Quên MK] Không có nút Quay lại đăng nhập','Mở /forgot-password (bước 1 và 2)','Có nút "Quay lại đăng nhập" (FR-03)','Bước 1 không có; bước 2 chỉ có "← Quay lại" về bước 1','forgot_step1.png'),
 ('BUG-17','Cao','[Quên MK] Bước 2 thiếu ô Xác nhận mật khẩu mới','Qua bước 2','Có ô Xác nhận mật khẩu mới (FR-03)','Chỉ có OTP + Mật khẩu mới','forgot_step2.png'),
 ('BUG-18','Trung bình','[Quên MK/Hồ sơ] Dùng alert() cho lỗi/thành công, không hiển thị inline','Nhập email không tồn tại ở bước 1; cập nhật hồ sơ','Thông báo inline, có thể đọc lại, gắn với ô nhập','Hộp thoại alert() chặn thao tác ("Lỗi: User not found", "Cập nhật thành công!")','forgot_step1.png (chụp lúc alert hiện)'),
 ('BUG-19','Thấp','[Quên MK] Nút "← Quay lại" cùng màu xanh lá với nút "Đặt lại mật khẩu"','Qua bước 2','Nút phụ khác kiểu nút chính','Hai nút giống hệt, dễ bấm nhầm','forgot_step2.png'),
 ('BUG-20','Cao','[Quên MK] Mật khẩu mới hợp lệ bị từ chối (cùng regex lỗi BUG-01) và backend chấp nhận mật khẩu yếu','FE: nhập `Test1234!`. API: `POST /api/reset-password` newPassword `1`','FE chấp nhận mật khẩu mạnh; BE từ chối mật khẩu yếu (FR-03)','FE từ chối `Test1234!`; BE trả "Password reset successfully" với `1`','forgot_step2.png + API'),
 ('BUG-21','Trung bình','[Quên MK/API] Lộ việc email có tồn tại (user enumeration)','Bước 1 nhập email không đăng ký','Phản hồi trung tính','404 "User not found"','forgot_step1.png'),
 ('BUG-22','Cao','[Hồ sơ] Số điện thoại 0912345678 bị từ chối (regex sai)','Đăng nhập → /profile → SĐT `0912345678` → Cập nhật','Chấp nhận: bắt đầu 0, 10–11 số (FR-04)','Alert "Vui lòng nhập đúng 9-10 chữ số"; `912345678` (không có 0) lại được chấp nhận','profile.png'),
 ('BUG-23','Rất cao','[Hồ sơ/API] User tự nâng quyền role=admin','`PUT /api/users/me` kèm `"role":"admin"` với token user thường','Bỏ qua/Từ chối trường role (FR-04)','200 "Profile updated"; `GET /api/users/me` trả role=admin','API (curl) – cần ảnh chụp'),
 ('BUG-24','Cao','[Header/Hồ sơ] XSS qua Họ tên (dangerouslySetInnerHTML)','Đổi Họ tên thành `<img src=x onerror=alert("xss")>` → Cập nhật → tải lại','Hiển thị chữ nguyên văn, không chạy script','Script chạy (alert "xss" hiện ra)','profile_xss.png'),
 ('BUG-25','Thấp','[Hồ sơ] Chưa đăng nhập: chỉ hiện chữ "Vui lòng đăng nhập", không chuyển hướng/không có link','Mở /profile khi chưa đăng nhập','Chuyển hướng /login hoặc có liên kết đăng nhập','Chỉ có dòng chữ','profile_anon.png'),
 ('BUG-26','Trung bình','[Tất cả form] Không có trạng thái loading, nút không bị vô hiệu khi gửi','Làm chậm API login 1.5s → bấm Sign In','Nút disabled/hiển thị đang xử lý, chống bấm đúp','Nút vẫn bấm được (disabled=false)','(ghi hình)'),
 ('BUG-27','Cao','[Tất cả form] Nhãn không gắn với ô nhập (không có for/id/aria-label)','Dùng DevTools/Accessibility tree trên 4 màn','Nhãn liên kết với input; bấm nhãn focus vào ô','label=null trên toàn bộ input','(ảnh Accessibility tree)'),
 ('BUG-28','Trung bình','[Toàn site] <html lang="en">, title chung "frontend-web", không có <h1> ở các màn','Xem DOM các màn','lang="vi"; title riêng từng trang; 1 h1 mỗi trang','lang=en; title=frontend-web trên mọi trang; h1=0','(ảnh tab trình duyệt + DevTools)'),
 ('BUG-29','Trung bình','[Tất cả form] Lỗi không được thông báo cho trình đọc màn hình (không có aria-live/role=alert)','Kiểm tra DOM khối lỗi đỏ/xanh','Vùng lỗi có role="alert" hoặc aria-live','Không có vùng aria-live nào','(ảnh DevTools)'),
 ('BUG-30','Trung bình','[Toàn site] Tương phản màu không đạt WCAG AA (hint 2.54:1, link xanh 3.68:1, nút đỏ 3.76:1, nút xanh lá 3.3:1)','Đo bằng DevTools/axe','≥ 4.5:1 cho chữ thường','Dưới 4.5:1','register.png, forgot_step2.png'),
 ('BUG-31','Trung bình','[Toàn site] Đường dẫn không tồn tại hiển thị trang trắng, không có 404','Mở /khong-ton-tai','Trang 404 có link về trang chủ','Vùng nội dung trống','route404.png'),
 ('BUG-32','Thấp','[Giao diện] Nút chính không nhất quán: Đăng ký màu đỏ, các màn khác màu xanh dương/xanh lá','So sánh 4 màn','Một kiểu nút chính xuyên suốt','Register #ef4444, Login/Forgot-1 #2563eb, Forgot-2 #16a34a','register.png, login.png'),
 ('BUG-33','Thấp','[Đăng ký] Đăng ký xong chuyển thẳng /login, không có thông báo thành công','Đăng ký với `Test 1234` (mật khẩu vượt được regex lỗi)','Hiện thông báo thành công','Không có phản hồi nào','(ghi hình)'),
 ('BUG-34','Thấp','[Form] Thiếu thuộc tính autocomplete (email, current-password, new-password) và không có nút hiện/ẩn mật khẩu','Kiểm tra DOM các ô nhập','autocomplete phù hợp; có nút hiện/ẩn mật khẩu','autocomplete rỗng; không có toggle','register.png'),
]

# ---------------- CHECKLIST: (ia, screen, item, source, why_missed, result, notes, bug, method)
IA1, IA2, IA3, IA4 = 'IA-01 UI chung', 'IA-02 Form', 'IA-03 Điều hướng', 'IA-04 Phản hồi/Trạng thái'
C = []
def add(*a): C.append(a)
# ---- AI-generated (generic, per IA)
add(IA1,'Đăng ký','Tiêu đề trang phản ánh đúng chức năng',AI,'',P,'','','UI')
add(IA1,'Đăng nhập','Tiêu đề trang phản ánh đúng chức năng',AI,'',F,'Tiêu đề là "Đăng Ký"','BUG-06','UI')
add(IA1,'Đăng nhập','Nhãn/nút dùng ngôn ngữ nhất quán với phần còn lại của giao diện',AI,'',F,'"Username", "Sign In" bằng tiếng Anh','BUG-07','UI')
add(IA1,'Cả 4 màn','Bố cục card căn giữa, khoảng cách nhất quán',AI,'',P,'','','UI')
add(IA1,'Cả 4 màn','Kiểu nút chính nhất quán giữa các màn',AI,'',F,'Đăng ký đỏ, Đăng nhập xanh dương, Quên MK bước 2 xanh lá','BUG-32','UI')
add(IA1,'Quên mật khẩu','Nút phụ (Quay lại) phân biệt với nút chính',AI,'',F,'Cùng màu xanh lá','BUG-19','UI')
add(IA1,'Cả 4 màn','Font và cỡ chữ nhất quán',AI,'',P,'','','UI')
add(IA1,'Cả 4 màn','Không tràn/cắt nội dung ở 1280px',AI,'',P,'','','UI')
add(IA1,'Cả 4 màn','Không cuộn ngang ở viewport 375px (mobile)',AI,'',P,'scrollWidth = clientWidth = 375','','UI')
add(IA1,'Cả 4 màn','Không cuộn ngang ở viewport 768px (tablet)',AI,'',P,'','','UI')
add(IA1,'Cả 4 màn','Header và footer hiển thị nhất quán',AI,'',P,'','','UI')
add(IA1,'Cả 4 màn','Màu trạng thái lỗi (đỏ) và thành công (xanh) dễ phân biệt',AI,'',P,'','','UI')
add(IA2,'Đăng ký','Trường Họ tên là bắt buộc',AI,'',P,'','','UI')
add(IA2,'Đăng ký','Ô email dùng type="email"',AI,'',F,'type="text"','BUG-05','UI')
add(IA2,'Đăng ký','Có ô Xác nhận mật khẩu',AI,'',F,'Không có','BUG-02','UI')
add(IA2,'Đăng ký','Mật khẩu hợp lệ Test1234! được chấp nhận',AI,'',F,'Bị báo "quá yếu"','BUG-01','UI')
add(IA2,'Đăng ký','Mật khẩu yếu (vd "1") bị chặn ở giao diện',AI,'',P,'','','UI')
add(IA2,'Đăng ký','Email đã tồn tại bị từ chối',AI,'',F,'API trả 200, tạo user trùng','BUG-04','API')
add(IA2,'Đăng ký','Server kiểm tra lại dữ liệu (email sai định dạng, mật khẩu yếu)',AI,'',F,'API chấp nhận email "notanemail", mật khẩu "1"','BUG-03','API')
add(IA2,'Đăng nhập','Ô email dùng type="email"',AI,'',F,'type="text"','BUG-05','UI')
add(IA2,'Đăng nhập','Ô mật khẩu che ký tự',AI,'',F,'type="text", hiện rõ','BUG-08','UI')
add(IA2,'Đăng nhập','Khóa tài khoản sau đúng 3 lần sai liên tiếp',AI,'',F,'Khóa sau 2 lần (bộ đếm +2)','BUG-09','UI+API')
add(IA2,'Đăng nhập','Thời gian khóa 30 giây',AI,'',F,'Đo được 180 giây','BUG-10','API')
add(IA2,'Quên mật khẩu','Ô email dùng type="email"',AI,'',F,'type="text"','BUG-05','UI')
add(IA2,'Quên mật khẩu','OTP gồm 6 chữ số',AI,'',F,'OTP 4 chữ số','BUG-14','UI')
add(IA2,'Quên mật khẩu','Có ô Xác nhận mật khẩu mới',AI,'',F,'Không có','BUG-17','UI')
add(IA2,'Quên mật khẩu','Mật khẩu mới hợp lệ được chấp nhận, yếu bị chặn',AI,'',F,'FE từ chối Test1234!; BE nhận "1"','BUG-20','UI+API')
add(IA2,'Quên mật khẩu','OTP không dùng được cho email khác',AI,'',P,'API trả 400 "Invalid token or email"','','API')
add(IA2,'Hồ sơ','Email ở chế độ chỉ đọc',AI,'',P,'','','UI')
add(IA2,'Hồ sơ','SĐT 0912345678 (bắt đầu 0, 10 số) được chấp nhận',AI,'',F,'Bị từ chối; "912345678" lại được nhận','BUG-22','UI')
add(IA2,'Hồ sơ','Không cho người dùng tự đổi role',AI,'',F,'API nhận role=admin','BUG-23','API')
add(IA2,'Hồ sơ','Họ tên là bắt buộc',AI,'',P,'','','UI')
add(IA3,'Đăng ký','Có liên kết sang Đăng nhập',AI,'',P,'','','UI')
add(IA3,'Đăng nhập','Có liên kết sang Đăng ký',AI,'',P,'','','UI')
add(IA3,'Đăng nhập','Liên kết Quên mật khẩu điều hướng SPA (không reload)',AI,'',F,'Reload toàn trang','BUG-13','UI')
add(IA3,'Quên mật khẩu','Có nút Quay lại đăng nhập',AI,'',F,'Không có','BUG-16','UI')
add(IA3,'Quên mật khẩu','Có chỉ báo bước (Bước 1/2)',AI,'',F,'Không có','BUG-15','UI')
add(IA3,'Đăng ký','Đăng ký thành công chuyển tới Đăng nhập',AI,'',P,'Kiểm bằng mật khẩu "Test 1234"','','UI')
add(IA3,'Hồ sơ','Chưa đăng nhập: được chuyển hướng/hướng dẫn đăng nhập',AI,'',F,'Chỉ có dòng chữ','BUG-25','UI')
add(IA3,'Cả 4 màn','Logo EShop dẫn về trang chủ',AI,'',P,'','','UI')
add(IA4,'Đăng ký','Hiện lỗi rõ khi mật khẩu yếu',AI,'',P,'','','UI')
add(IA4,'Đăng ký','Có thông báo thành công sau đăng ký',AI,'',F,'Chuyển trang im lặng','BUG-33','UI')
add(IA4,'Đăng nhập','Hiện lỗi khi sai thông tin, không lộ chi tiết nguyên nhân',AI,'',P,'Thông báo chung "Đăng nhập thất bại…" (đúng FR-02)','','UI')
add(IA4,'Quên mật khẩu','Lỗi hiển thị inline, không dùng alert()',AI,'',F,'Dùng alert()','BUG-18','UI')
add(IA4,'Quên mật khẩu','Đặt lại thành công có phản hồi và chuyển về Đăng nhập',AI,'',P,'','','UI')
add(IA4,'Quên mật khẩu','Email không tồn tại cho phản hồi trung tính',AI,'',F,'404 "User not found"','BUG-21','UI')
add(IA4,'Hồ sơ','Cập nhật thành công có phản hồi',AI,'',P,'','','UI')
add(IA4,'Hồ sơ','Lỗi hiển thị inline, không dùng alert()',AI,'',F,'Dùng alert()','BUG-18','UI')
add(IA4,'Cả form','Có trạng thái loading / vô hiệu nút khi đang gửi',AI,'',F,'Nút vẫn bấm được trong lúc chờ','BUG-26','UI')
# ---- Bo sung (AI hay bo sot) - Tue can xac nhan ly do
add(IA1,'Cả 4 màn','Nhãn gắn với ô nhập (for/id hoặc aria-label)',TUE,'Prompt tập trung vào giao diện nhìn thấy; AI không kiểm tra DOM/accessibility tree','F','Mọi input có label=null','BUG-27','UI')
add(IA1,'Toàn site','Thuộc tính lang đúng (vi)',TUE,'Hạn chế mô hình: không đọc index.html, chỉ nhìn ảnh/ mô tả màn hình','F','lang="en"','BUG-28','UI')
add(IA1,'Toàn site','Mỗi trang có title riêng',TUE,'Prompt không nhắc tab trình duyệt; AI chỉ nhìn vùng nội dung','F','Mọi trang là "frontend-web"','BUG-28','UI')
add(IA1,'Toàn site','Mỗi trang có đúng một <h1>',TUE,'Đặc thù SUT: dùng <h2> thay <h1>, AI thấy tiêu đề lớn nên coi là đạt','F','h1 = 0 trên 4 màn','BUG-28','UI')
add(IA1,'Toàn site','Tương phản chữ ≥ 4.5:1 (WCAG AA)',TUE,'AI không đo được tỷ lệ màu từ mô tả; cần công cụ','F','Hint 2.54:1, link 3.68:1, nút đỏ 3.76:1, nút xanh lá 3.3:1','BUG-30','UI')
add(IA1,'Toàn site','Dark mode: giao diện không hỏng khi hệ điều hành ở chế độ tối',TUE,'AI thường chỉ liệt kê checklist chung, ít nhắc dark mode','P','Ứng dụng không hỗ trợ dark mode, vẫn giữ nền sáng, đọc được (không phải lỗi)','','UI')
add(IA1,'Đăng nhập','RTL: bố cục lật đúng khi dir="rtl"',TUE,'AI hiếm nhắc RTL cho ứng dụng tiếng Việt (LTR)','P','Bố cục lật đúng; dấu "?" của "Quên mật khẩu?" bị đảo vị trí do bidi, mức nhẹ','','UI')
add(IA1,'Toàn site','Focus indicator nhìn thấy khi điều hướng bàn phím',TUE,'AI không kiểm tra bằng bàn phím','P','Outline mặc định của trình duyệt hiển thị','','UI')
add(IA2,'Đăng nhập','Thứ tự Tab theo thứ tự hiển thị (không có tabIndex dương)',TUE,'Lỗi nằm trong mã (tabIndex=1), AI không thấy được từ giao diện','F','Tab đầu nhảy vào nút Sign In','BUG-12','UI')
add(IA2,'Cả form','Có thuộc tính autocomplete phù hợp và nút hiện/ẩn mật khẩu',TUE,'Chi tiết kỹ thuật nhỏ, không có trong prompt','F','autocomplete rỗng, không có nút hiện/ẩn','BUG-34','UI')
add(IA2,'Cả form','Vùng thông báo lỗi có role="alert"/aria-live',TUE,'AI không kiểm tra hỗ trợ trình đọc màn hình','F','Không có aria-live/role nào','BUG-29','UI')
add(IA3,'Toàn site','Đường dẫn không tồn tại hiển thị trang 404',TUE,'Prompt chỉ liệt kê màn đã chọn, không có đường dẫn sai','F','Vùng nội dung trống','BUG-31','UI')
add(IA4,'Header/Hồ sơ','Họ tên hiển thị an toàn, không render HTML (chống XSS)',TUE,'Ngoài phạm vi "giao diện" theo prompt; cần đọc mã/thử payload','F','Script trong tên chạy được','BUG-24','UI')
add(IA4,'Đăng nhập','Phản hồi đăng nhập không lộ mật khẩu',TUE,'AI chỉ xét giao diện, không xét payload API','F','Body chứa password plaintext','BUG-11','API')
add(IA4,'Quên mật khẩu','Mật khẩu yếu bị server từ chối khi đặt lại',TUE,'Cần thử trực tiếp API; ngoài tầm nhìn của AI','F','API chấp nhận "1"','BUG-20','API')

def norm(r): return 'Passed' if r in ('P', P) else 'Failed'
rows = []
for i, (ia, sc, it, src, why, res, note, bug, method) in enumerate(C, 1):
    rows.append(dict(id=f'TC-{i:02d}', ia=ia, sc=sc, it=it, src=src, why=why, res=norm(res), note=note, bug=bug, method=method))

if __name__ == '__main__':
    total = len(rows); passed = sum(r['res'] == 'Passed' for r in rows); failed = total - passed
    ai_n = sum(r['src'] == AI for r in rows)
    shots = {b[0]: b[6] for b in BUGS}
    # ---- XLSX
    wb = openpyxl.Workbook(); ws = wb.active; ws.title = 'Checklist'
    hdr = ['ID','Interface Aspect','Màn hình','Hạng mục kiểm tra','Nguồn','Lý do AI bỏ sót (cho mục bổ sung)','Kết quả','Notes (lý do Failed)','Bug','Cách kiểm','Ảnh minh chứng (Failed)']
    ws.append(hdr)
    for r in rows:
        ev = shots.get(r['bug'], '') if r['res'] == 'Failed' else ''
        ws.append([r['id'], r['ia'], r['sc'], r['it'], r['src'], r['why'], r['res'], r['note'], r['bug'], r['method'], ev])
    thin = Side(style='thin', color='BBBBBB')
    for c in ws[1]:
        c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='2563EB')
    for row in ws.iter_rows(min_row=1):
        for c in row: c.alignment = Alignment(wrap_text=True, vertical='top'); c.border = Border(top=thin, bottom=thin, left=thin, right=thin)
    for row in ws.iter_rows(min_row=2):
        row[6].fill = PatternFill('solid', fgColor='C6EFCE' if row[6].value == 'Passed' else 'FFC7CE')
    for col, w in zip('ABCDEFGHIJK', [8,22,16,52,22,40,10,40,9,9,34]): ws.column_dimensions[col].width = w
    ws.freeze_panes = 'A2'; ws.auto_filter.ref = ws.dimensions
    wb.create_sheet('Bugs').append(['Bug','Mức độ','Tiêu đề','Bước tái hiện','Kỳ vọng','Thực tế','Ảnh/Bằng chứng'])
    for b in BUGS: wb['Bugs'].append(list(b))
    for col, w in zip('ABCDEFG', [9,11,60,45,40,45,30]): wb['Bugs'].column_dimensions[col].width = w
    for row in wb['Bugs'].iter_rows():
        for c in row: c.alignment = Alignment(wrap_text=True, vertical='top')
    for c in wb['Bugs'][1]: c.font = Font(bold=True)
    s = wb.create_sheet('Summary')
    by_ia = {}
    for r in rows:
        d = by_ia.setdefault(r['ia'], [0, 0, 0]); d[0] += 1; d[1 if r['res'] == 'Passed' else 2] += 1
    s.append(['Chỉ số','Giá trị']);
    for k, v in [('Số màn hình kiểm thử', '4 (Đăng ký, Đăng nhập, Quên mật khẩu, Hồ sơ)'),('Số hạng mục thiết kế', total),('Số hạng mục thực thi', total),('Passed', passed),('Failed', failed),('Hạng mục do AI sinh', ai_n),('Hạng mục bổ sung', total-ai_n),('Số bug', len(BUGS))]: s.append([k, v])
    s.append([]); s.append(['Interface Aspect','Tổng','Passed','Failed'])
    for k, v in by_ia.items(): s.append([k] + v)
    s.column_dimensions['A'].width = 34; s.column_dimensions['B'].width = 46
    for c in s[1]: c.font = Font(bold=True)
    wb.save(os.path.join(ROOT, 'checklist', 'checklist.xlsx'))
    # ---- MD
    md = ['# GUI Checklist – Đăng ký / Đăng nhập / Quên mật khẩu / Hồ sơ (EShop)\n',
          f'**Tổng:** {total} hạng mục · **Passed:** {passed} · **Failed:** {failed} · **Bug:** {len(BUGS)} · AI sinh: {ai_n} · Bổ sung: {total-ai_n}\n',
          '> Bản nháp để Tuệ rà soát. Cột "Cách kiểm": UI = chạy trên Chromium thật, API = gọi API trực tiếp. Mục "Bổ sung" cần Tuệ xác nhận lại lý do AI bỏ sót theo trải nghiệm thực tế của mình.\n',
          '| ID | IA | Màn hình | Hạng mục | Nguồn | Lý do AI bỏ sót | Kết quả | Notes | Bug |','|---|---|---|---|---|---|---|---|---|']
    for r in rows: md.append(f"| {r['id']} | {r['ia']} | {r['sc']} | {r['it']} | {r['src']} | {r['why']} | {'✅ Passed' if r['res']=='Passed' else '❌ Failed'} | {r['note']} | {r['bug']} |")
    md += ['\n## Theo Interface Aspect\n','| IA | Tổng | Passed | Failed |','|---|---|---|---|'] + [f'| {k} | {v[0]} | {v[1]} | {v[2]} |' for k, v in by_ia.items()]
    open(os.path.join(ROOT, 'checklist', 'checklist.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    # ---- bug report md
    bm = ['# Bug Report – EShop (Tuệ: Đăng ký / Đăng nhập / Quên MK / Hồ sơ)\n', f'Tổng: **{len(BUGS)} bug**. Mức độ: Rất cao / Cao / Trung bình / Thấp.\n',
          '| Bug | Mức | Tiêu đề | Issue GitHub |','|---|---|---|---|'] + [f'| {b[0]} | {b[1]} | {b[2]} | _(điền sau khi tạo)_ |' for b in BUGS]
    for b in BUGS: bm += [f'\n## {b[0]} – {b[2]}\n', f'- **Mức độ:** {b[1]}', f'- **Bước tái hiện:** {b[3]}', f'- **Kỳ vọng:** {b[4]}', f'- **Thực tế:** {b[5]}', f'- **Bằng chứng:** {b[6]}']
    open(os.path.join(ROOT, 'bugs', 'bug_report.md'), 'w', encoding='utf-8').write('\n'.join(bm) + '\n')
    print(total, passed, failed, ai_n, len(BUGS))
