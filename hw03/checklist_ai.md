# Checklist do AI sinh (bước 2) – EShop frontend-web

## Nhật ký prompt (cho AI Audit Report)

Mỗi lượt sinh riêng một IA, đều đưa cùng ngữ cảnh. AI được cho đọc mã nguồn 4 trang trước khi sinh.

**Ngữ cảnh chung (dán vào đầu mỗi lượt):**
> Bạn là kỹ sư kiểm thử GUI. SUT: EShop (React + Tailwind, `localhost:5173`), UI tiếng Việt. Phạm vi 4 màn hình: Đăng ký (`/register`), Đăng nhập (`/login`), Quên mật khẩu 2 bước (`/forgot-password`), Hồ sơ (`/profile`). Yêu cầu nghiệp vụ: FR-01 đăng ký, FR-02 đăng nhập + khóa tài khoản, FR-03 quên mật khẩu 2 bước, FR-04 hồ sơ (SĐT bắt đầu bằng 0, 10–11 số). Hãy viết các mục checklist kiểm thử, mỗi mục: ID, màn hình, việc cần kiểm tra, kết quả mong đợi. Mục phải kiểm chứng được bằng thao tác cụ thể, viết theo hành vi **đúng** (không giả định hệ thống có lỗi), không trùng nhau.

| Lượt | Prompt thêm vào sau ngữ cảnh chung | Kết quả |
|---|---|---|
| 1 | "Chỉ sinh mục thuộc **IA-01 General UI standards**: ngôn ngữ, tiêu đề, nhãn, màu sắc, tương phản, bố cục, responsive, thẩm mỹ nhất quán." | 15 mục (mục 3.1) |
| 2 | "Chỉ sinh mục thuộc **IA-02 Forms**: nhãn, trường bắt buộc, kiểu input, validate, quy tắc mật khẩu, thông báo lỗi tại ô, giữ dữ liệu, phím Enter, double submit." | 20 mục (mục 3.2) |
| 3 | "Chỉ sinh mục thuộc **IA-03 Navigation**: liên kết giữa các trang, chuyển hướng sau hành động, trạng thái đăng nhập, nút Back, tải lại trang, phím Tab." | 12 mục (mục 3.3) |
| 4 | "Chỉ sinh mục thuộc **IA-04 Feedback/State**: thông báo thành công/lỗi, loading, trạng thái rỗng, trạng thái khóa, xác nhận trước hành động nguy hiểm, lỗi mạng." | 14 mục (mục 3.4) |

Tổng AI sinh: **61 mục** (chưa loại trùng).

---

## 3.1 IA-01 General UI standards

| ID | Màn | Việc kiểm tra | Kết quả mong đợi | Kết quả | Notes |
|---|---|---|---|---|---|
| IA01-01 | R, L, F, P | Ngôn ngữ của mọi nhãn, nút, thông báo | Thống nhất một ngôn ngữ (tiếng Việt), không lẫn tiếng Anh | | |
| IA01-02 | R, L, F, P | Tiêu đề trang (h2) | Mô tả đúng chức năng của trang | | |
| IA01-03 | L | Nhãn ô nhập định danh | Nhãn phản ánh đúng dữ liệu cần nhập (email) | | |
| IA01-04 | R | Văn bản gợi ý quy tắc mật khẩu (chữ xám nhỏ) | Tương phản chữ/nền ≥ 4.5:1 | | |
| IA01-05 | R, L, F, P | Văn bản nút chính trên nền màu | Tương phản ≥ 4.5:1 | | |
| IA01-06 | R, L, F, P | Phông chữ, cỡ chữ, khoảng cách giữa các trường | Nhất quán giữa 4 trang | | |
| IA01-07 | R, L, F, P | Màu và kiểu nút hành động chính | Nhất quán giữa các trang (cùng vai trò, cùng màu) | | |
| IA01-08 | F | Nút "Đặt lại mật khẩu" và nút "← Quay lại" | Phân biệt được hành động chính / phụ bằng màu hoặc kiểu | | |
| IA01-09 | R, L, F, P | Căn lề và độ rộng khối form | Form căn giữa, độ rộng đều giữa các trang | | |
| IA01-10 | R, L, F, P | Hiển thị ở 375 px, 768 px, 1280 px | Không cuộn ngang, không chữ bị cắt hoặc chồng | | |
| IA01-11 | P | Bố cục 2 cột (hồ sơ / đơn hàng) ở màn nhỏ | Chuyển thành 1 cột, bảng đơn hàng không tràn | | |
| IA01-12 | R, L, F, P | Trạng thái hover, focus, disabled của ô nhập và nút | Nhìn thấy rõ, phân biệt được | | |
| IA01-13 | R, L, F, P | Chính tả, dấu tiếng Việt, Unicode | Hiển thị đúng, không lỗi font | | |
| IA01-14 | P | Định dạng ngày và tiền trong lịch sử đơn | Theo chuẩn Việt Nam (dd/mm/yyyy, dấu chấm phân cách nghìn, ₫) | | |
| IA01-15 | R, L, F, P | Tiêu đề tab trình duyệt (document title) | Mô tả đúng trang đang mở | | |

## 3.2 IA-02 Forms

| ID | Màn | Việc kiểm tra | Kết quả mong đợi | Kết quả | Notes |
|---|---|---|---|---|---|
| IA02-01 | R, L, F, P | Bấm vào nhãn của ô nhập | Con trỏ vào đúng ô (nhãn gắn với input) | | |
| IA02-02 | R | Chỉ báo trường bắt buộc (Họ tên, Email, Mật khẩu) | Có dấu hiệu (dấu *) và chặn gửi khi để trống | | |
| IA02-03 | R, L, F | Ô email dùng kiểu nhập phù hợp | `type=email` hoặc validate định dạng email, bàn phím di động phù hợp | | |
| IA02-04 | R | Đăng ký với email sai định dạng (`abc`) | Bị chặn, thông báo "email không hợp lệ" gần ô email | | |
| IA02-05 | R | Đăng ký với email đã tồn tại (`test@eshop.com`) | Bị từ chối, thông báo email đã được sử dụng | | |
| IA02-06 | R | Mật khẩu mạnh thông thường `Abcd1234!` | Được chấp nhận (có hoa, thường, số, ký tự đặc biệt, ≥ 8) | | |
| IA02-07 | R | Mật khẩu thiếu điều kiện (`abcd1234`) | Bị từ chối, thông báo nêu đúng điều kiện còn thiếu | | |
| IA02-08 | R, F | Quy tắc mật khẩu hiển thị trên form | Khớp với quy tắc hệ thống thực sự áp dụng, không mâu thuẫn | | |
| IA02-09 | R, F | Ô xác nhận mật khẩu | Có ô nhập lại, báo lỗi khi hai giá trị khác nhau | | |
| IA02-10 | R, L, F | Nút hiện/ẩn mật khẩu | Có nút bật tắt; mặc định mật khẩu được che | | |
| IA02-11 | L | Ô mật khẩu khi gõ | Hiển thị dạng chấm tròn, không lộ ký tự | | |
| IA02-12 | R, P | Họ tên có khoảng trắng đầu/cuối, quá dài (> 100 ký tự) | Được cắt khoảng trắng hoặc có giới hạn độ dài rõ ràng | | |
| IA02-13 | P | Số điện thoại hợp lệ `0901234567` | Được chấp nhận và lưu | | |
| IA02-14 | P | Số điện thoại sai (`abc`, 9 số, 12 số, có chữ) | Bị chặn, thông báo rõ quy tắc, đặt gần ô nhập | | |
| IA02-15 | P | Placeholder SĐT `0912345678` | Giá trị mẫu phải là giá trị form chấp nhận | | |
| IA02-16 | P | Họ tên để trống rồi cập nhật | Bị chặn, nêu rõ trường cần nhập | | |
| IA02-17 | P | Ô Email trên hồ sơ | Không sửa được, trông khác ô sửa được, có giải thích | | |
| IA02-18 | F | Ô OTP | Chỉ nhận số, độ dài khớp nhãn và khớp quy định (6 số) | | |
| IA02-19 | R, L, F, P | Nhấn Enter trong ô cuối cùng | Gửi form một lần | | |
| IA02-20 | R, L, F, P | Bấm nút gửi liên tiếp nhanh | Chỉ gửi một yêu cầu, nút bị vô hiệu khi đang gửi | | |

## 3.3 IA-03 Navigation

| ID | Màn | Việc kiểm tra | Kết quả mong đợi | Kết quả | Notes |
|---|---|---|---|---|---|
| IA03-01 | R, L | Liên kết "Đăng nhập" / "Đăng ký ngay" | Chuyển đúng trang, không tải lại toàn trang | | |
| IA03-02 | L | Liên kết "Quên mật khẩu?" | Chuyển trang mượt (SPA), không tải lại toàn trang | | |
| IA03-03 | F | Bước 1 có đường quay về Đăng nhập | Có liên kết/nút "Quay lại đăng nhập" | | |
| IA03-04 | F | Nút "← Quay lại" ở bước 2 | Về bước 1, giữ nguyên email đã nhập | | |
| IA03-05 | R | Sau khi đăng ký thành công | Chuyển hướng hợp lý (đăng nhập hoặc trang chủ) kèm thông báo | | |
| IA03-06 | L | Sau khi đăng nhập thành công | Về trang chủ hoặc trang trước đó, header đổi sang trạng thái đã đăng nhập | | |
| IA03-07 | P | Mở `/profile` khi chưa đăng nhập | Chuyển hướng sang Đăng nhập hoặc có liên kết rõ ràng | | |
| IA03-08 | R, L | Mở `/login` hoặc `/register` khi đã đăng nhập | Chuyển khỏi trang hoặc thông báo đã đăng nhập | | |
| IA03-09 | F | Nút Back của trình duyệt ở bước 2 | Hành vi dự đoán được, không mất trạng thái bất ngờ | | |
| IA03-10 | F | Tải lại trang ở bước 2 | Hệ thống xử lý hợp lý (giữ bước hoặc báo rõ phải bắt đầu lại) | | |
| IA03-11 | R, L, F, P | Thứ tự Tab giữa các ô và nút | Đi từ trên xuống dưới theo thứ tự hiển thị | | |
| IA03-12 | P | Đăng xuất từ header | Xóa phiên, về trang hợp lý, không truy cập lại được `/profile` | | |

## 3.4 IA-04 Feedback / state

| ID | Màn | Việc kiểm tra | Kết quả mong đợi | Kết quả | Notes |
|---|---|---|---|---|---|
| IA04-01 | R | Đăng ký thành công | Hiện thông báo thành công rõ ràng | | |
| IA04-02 | R | Lỗi đăng ký | Hiển thị trong trang (inline), không dùng `alert()` | | |
| IA04-03 | L | Đăng nhập sai mật khẩu | Thông báo lỗi nêu rõ nguyên nhân chung, không tiết lộ email có tồn tại | | |
| IA04-04 | L | Sai mật khẩu liên tiếp theo quy định (3 lần) | Tài khoản bị khóa đúng ngưỡng; hiển thị số lần còn lại | | |
| IA04-05 | L | Khi tài khoản bị khóa | Thông báo nói rõ bị khóa và còn bao lâu (đếm ngược 30 giây) | | |
| IA04-06 | L | Sau khi hết thời gian khóa | Đăng nhập lại được bình thường | | |
| IA04-07 | R, L, F, P | Trạng thái đang gửi yêu cầu | Có loading hoặc nút vô hiệu | | |
| IA04-08 | F | Bước 1: email không tồn tại | Thông báo trung tính, không lộ email có đăng ký hay không | | |
| IA04-09 | F | Chỉ báo bước | Có "Bước 1/2", "Bước 2/2" | | |
| IA04-10 | F | Nhập OTP sai hoặc hết hạn | Báo lỗi inline, nêu rõ OTP sai hay hết hạn | | |
| IA04-11 | F | Đặt lại mật khẩu thành công | Thông báo thành công không chặn (không `alert()`), dẫn tới Đăng nhập | | |
| IA04-12 | P | Cập nhật hồ sơ thành công / lỗi | Thông báo không chặn thao tác, đúng nội dung | | |
| IA04-13 | P | Lịch sử đơn khi chưa có đơn / đang tải | Có trạng thái rỗng thân thiện và trạng thái loading | | |
| IA04-14 | P | Nút "Hủy đơn" | Chỉ hiện khi được phép hủy; có hộp xác nhận trước khi hủy | | |

> Ghi chú: IA04-14 và các mục có "OTP", "đếm ngược" dựa trên spec nghiệp vụ; Tuệ đối chiếu lại với `requirement`/`api_specification.md` ở bước 3.

---

## 4. Phần AI **chưa** đề cập rõ (gợi ý để Tuệ cân nhắc ở bước 3)

Các lượt trên tập trung vào hành vi hiển thị và form. Một số khu vực chưa có mục nào hoặc rất ít:

- Accessibility: đọc màn hình (aria-live cho lỗi, aria-label), điều hướng chỉ bằng bàn phím, hiển thị focus, zoom 200%.
- Dark mode, RTL, ngôn ngữ khác.
- Bảo mật hiển thị: XSS trong tên hiển thị ở header, lộ dữ liệu nhạy cảm (mật khẩu) trong phản hồi mạng.
- Hiệu năng, mạng chậm/mất mạng, phản hồi sau khi backend tắt.
- Trình duyệt tự điền (autofill, trình quản lý mật khẩu), `autocomplete`.

Đây chỉ là gợi ý. Tuệ cần tự xác định mục thêm và **ghi lý do AI bỏ sót** (chất lượng prompt, giới hạn model, hay đặc thù giao diện) cho từng mục thêm, theo yêu cầu Task 1.
