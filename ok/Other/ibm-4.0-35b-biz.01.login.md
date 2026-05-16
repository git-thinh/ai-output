# Feature Name:

- Đăng nhập tài khoản

# Description:

- Cho phép người dùng nhập thông tin tài khoản (email/username và mật khẩu) rồi xác minh thông tin đó trên hệ thống để xác nhận danh tính và cung cấp quyền truy cập vào ứng dụng.

# Actors:

- Primary: Người dùng (User)
- Secondary: Hệ thống quản lý tài khoản (Authentication System)

# Business Goal:

- Giúp người dùng truy cập vào các tính năng cá nhân hóa, quản lý thông tin cá nhân và thực hiện hành động liên quan đến tài khoản của mình.
- Đảm bảo an ninh thông tin bằng cách yêu cầu xác minh trước khi cho phép truy cập.

# Functional Requirements:

- Màn hình đăng nhập hiển thị các trường:
  - Email hoặc Username
  - Mật khẩu
- Nút "Đăng nhập" để gửi thông tin đăng nhập đến hệ thống.
- Hệ thống kiểm tra thông tin đăng nhập:
  - So sánh mật khẩu với giá trị đã lưu trong cơ sở dữ liệu.
  - Trả về kết quả thành công hoặc lỗi (email chưa tồn tại, mật khẩu sai).
- Sau khi đăng nhập thành công:
  - Tạo phiên làm việc (session) hoặc token xác thực.
  - Chuyển hướng người dùng đến trang chủ hoặc trang cá nhân.
- Nếu đăng nhập thất bại:
  - Hiển thị thông báo lỗi rõ ràng cho người dùng.
  - Giữ lại thông tin đã nhập để người dùng không phải nhập lại.

# Critical Considerations:

1. Security:
   - Mật khẩu phải được lưu trữ dưới dạng băm (hash) an toàn, không lưu dưới dạng văn bản rõ ràng.
   - Sử dụng HTTPS để bảo vệ thông tin truyền tải giữa trình duyệt và máy chủ.
   - Thực hiện giới hạn số lần đăng nhập thất bại để ngăn chặn tấn công brute-force.
   - Triển khai CAPTCHA hoặc kiểm tra reCAPTCHA để ngăn chặn tấn công tự động.
2. Data Integrity:
   - Kiểm tra định dạng email/username để đảm bảo dữ liệu hợp lệ trước khi gửi yêu cầu đăng nhập.
   - Xử lý trường hợp người dùng nhập thông tin không hợp lệ hoặc không đúng định dạng.
3. Performance:
   - Thực hiện xác minh thông tin đăng nhập nhanh chóng để cung cấp trải nghiệm người dùng mượt mà.
   - Sử dụng cache hoặc kỹ thuật tối ưu truy vấn cơ sở dữ liệu để giảm thời gian xử lý.
4. UX:
   - Hiển thị thông báo lỗi rõ ràng và dễ hiểu khi đăng nhập thất bại.
   - Giữ lại thông tin đã nhập (email/username) sau khi người dùng nhập lại mật khẩu.
   - Cung cấp liên kết "Quên mật khẩu" để hỗ trợ người dùng lấy lại mật khẩu.
5. Edge Cases:
   - Xử lý trường hợp người dùng chưa xác nhận email sau khi đăng ký tài khoản.
   - Xử lý trường hợp tài khoản bị khóa hoặc bị xóa.

# Risks:

- Rủi ro bảo mật: Nếu thông tin mật khẩu không được bảo vệ đúng cách, có thể dẫn đến lộ thông tin và tấn công vào tài khoản của người dùng.
- Rủi ro trải nghiệm người dùng: Nếu quá trình đăng nhập không mượt mà hoặc xuất hiện lỗi không rõ ràng, có thể làm giảm sự hài lòng của người dùng.
- Rủi ro tính toàn vẹn dữ liệu: Nếu thông tin đăng nhập không được kiểm tra đúng đắn, có thể dẫn đến việc truy cập không chính xác hoặc lỗi hệ thống.

# Non-functional Requirements:

- Security: Sử dụng kỹ thuật băm mật khẩu an toàn (ví dụ: bcrypt), triển khai HTTPS, giới hạn số lần đăng nhập thất bại.
- Performance: Thời gian phản hồi đăng nhập không quá 2 giây, tối ưu truy vấn cơ sở dữ liệu.
- Scalability: Hệ thống có thể xử lý lượng lớn yêu cầu đăng nhập mà không gây ảnh hưởng đến hiệu suất.
- Usability: Giao diện đơn giản, dễ sử dụng, hỗ trợ nhập thông tin dễ dàng.
- Compatibility: Hỗ trợ trên các trình duyệt phổ biến và thiết bị di động.

# Open Questions:

- Cần tích hợp với hệ thống quản lý tài khoản hiện có hay tạo mới?
- Có cần hỗ trợ đăng nhập bằng các phương thức khác (Google, Facebook, ...) không?
- Thời gian tồn tại của phiên làm việc sau khi đăng nhập là bao lâu?
- Cần lưu lại thông tin đăng nhập (email/username) giữa các phiên làm việc không?
- Có cần tích hợp với chức năng "Quên mật khẩu" và "Đổi mật khẩu" không?