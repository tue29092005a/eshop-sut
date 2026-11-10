/profile
- ở phần này thì số điện thoại thì bắt đầu bằng 0 ví dụ như 0123456789 thì tính là lỗi không đủ kí tự
- khi đổi tên username, và số điện thoại thì sau khi logout thì login vô mới cập nhật

/register
- khi đăng kí mật khẩu bằng "Abc@1234" thì bị lỗi do regex không nhận chữ @ là kí tự đặc biệt, nhưng với "Abc 1234" thì được

/login
- Tiêu đề trang có ghi "Đăng Ký" thay vì Đăng nhập
- nút sign in tiếnh anh
- nhãn username thực ra phải điền email
- không có giới hạn số lần đăng nhập
- không ẩn mật khẩu khi điền giống đăng ký
- khi bấm tab thì nhảy vào đăng ký ngay thay vì nút signin trước
- thứ tự Tab thực tế: Email → Mật khẩu → Link Đăng ký → Sign In (đúng ra Sign In phải đứng ngay sau Mật khẩu)
- Network (F12): request `login` (POST) → tab Preview/Response có `password: "Test1234!"` dạng plaintext, kèm `role: "user"` và token JWT. Đã xác minh trên UI (B14). Ảnh chụp DevTools lúc test, trang chạy ở localhost:5174.
- Request `me` (GET /api/users/me) cũng trả về toàn bộ bản ghi user: `password: "Test1234!"`, `reset_token`, `login_attempts`, `locked_until`, `role`. Đã xác minh trên UI (B14, cả 2 endpoint).

/forgot-password
- otp 4 số hiện trên màn hình
- không có báo cac bước
- không có ô xác nhận mật khẩu mới
- lỗi khi sai sẽ hiện trong popup
- 