# Feature Name:

- Hệ thống Phê duyệt Nghỉ phép (Leave Request Approval System)

# Description:

- Hệ thống quản lý quy trình phê duyệt đơn xin nghỉ phép của nhân viên, bao gồm gửi đơn, phê duyệt/từ chối bởi quản lý trực tiếp, cơ chế tự động đẩy lên cấp cao hơn sau 48h không phản hồi, và thông báo qua email + ứng dụng.

# Actors:

- Primary: Nhân viên (Employee)
- Secondary: Quản lý trực tiếp (Direct Manager), Quản lý cấp cao (Higher-level Manager), HR/Admin
- System: Email Service, Push Notification Service, Escalation Engine

# Business Goal:

- Tự động hóa quy trình phê duyệt nghỉ phép
- Giảm thời gian chờ xử lý đơn xin nghỉ
- Đảm bảo không có đơn nào bị bỏ sót do quản lý không phản hồi
- Tăng tính minh bạch và khả năng theo dõi trạng thái đơn

# Functional Requirements:

- Nhân viên tạo đơn xin nghỉ phép với các trường: loại nghỉ, ngày bắt đầu, ngày kết thúc, lý do
- Hệ thống gửi đơn đến quản lý trực tiếp của nhân viên
- Quản lý trực tiếp có thể Duyệt hoặc Từ chối đơn
- Nếu quản lý không phản hồi trong 48h → tự động chuyển đơn lên cấp cao hơn (quản lý cấp cao hoặc HR)
- Cấp cao hơn có quyền Duyệt hoặc Từ chối
- Gửi thông báo qua Email và Push Notification đến người liên quan ở mỗi bước
- Hiển thị trạng thái đơn: Đang chờ, Đã duyệt, Đã từ chối, Đang chờ phê duyệt cấp cao
- Cho phép nhân viên xem lịch sử đơn và trạng thái hiện tại
- Hỗ trợ chỉnh sửa đơn trước khi gửi (nếu chưa được phê duyệt)

# Critical Considerations:

1. Security:
  - Xác thực người dùng trước khi tạo/xem đơn
  - Chỉ cho phép nhân viên xem đơn của chính mình
  - Quản lý chỉ xem đơn của nhân viên thuộc quyền quản lý
  - Audit log ghi lại mọi hành động phê duyệt/từ chối

2. Data Integrity:
  - Không cho phép chỉnh sửa sau khi đã gửi đơn
  - Đảm bảo ngày bắt đầu <= ngày kết thúc
  - Kiểm tra trùng lặp khoảng thời gian nghỉ (không được nghỉ chồng lên nhau)

3. Performance:
  - Escalation engine chạy định kỳ (cron job) để kiểm tra đơn quá hạn
  - Notification phải gửi trong vòng vài giây sau khi có sự kiện

4. UX:
  - Hiển thị countdown còn bao nhiêu giờ nữa sẽ tự động đẩy lên cấp cao
  - Trạng thái rõ ràng cho từng bước phê duyệt
  - Thông báo push/email phải có link trực tiếp đến đơn

5. Edge Cases:
  - Quản lý trực tiếp cũng đang nghỉ phép → cần cơ chế chỉ định người thay thế
  - Đơn được tạo vào cuối tuần/cuối ngày lễ → tính 48h theo giờ làm việc hay giờ thực tế?
  - Cấp cao hơn cũng không phản hồi trong 48h → xử lý thế nào? (tự động duyệt/từ chối/bỏ qua)
  - Nhân viên hủy đơn đang chờ phê duyệt → có được không?

# Risks:

- Escalation không chính xác nếu quản lý bị nghỉ → đơn bị bỏ sót
- Nhân viên lợi dụng việc tự động đẩy lên cấp cao để ép buộc duyệt
- Thông báo email bị spam hoặc rơi vào folder spam
- Quản lý cấp cao không có thời gian xử lý → đơn bị trì hoãn lâu hơn
- Không có cơ chế resubmit sau khi từ chối

# Non-functional Requirements:

- Response time cho tạo đơn < 2s
- Escalation check chạy mỗi 15 phút (hoặc cron job hàng giờ)
- Notification delivery < 30s sau khi sự kiện xảy ra
- Audit log lưu trữ tối thiểu 2 năm
- Hỗ trợ multi-language cho thông báo
- Mobile responsive cho ứng dụng push notification

# Open Questions:

1. Cấp cao hơn là ai? (Quản lý cấp phòng? HR? Giám đốc?)
2. Nếu cấp cao hơn cũng không phản hồi trong 48h → xử lý thế nào? (tự động duyệt, tự động từ chối, hay bỏ qua?)
3. Có bao nhiêu lần escalate tối đa cho một đơn?
4. Tính 48h theo giờ thực tế hay giờ làm việc (business hours)?
5. Quản lý trực tiếp có thể chỉ định người thay thế khi nghỉ phép không?
6. Có cần hỗ trợ nhiều loại nghỉ phép khác nhau (phép năm, phép ốm, phép sự vụ...) với quy tắc phê duyệt khác nhau?
7. Nhân viên có được hủy đơn đang chờ phê duyệt không?
8. Có cần tích hợp với hệ thống chấm công hiện có không?
9. Thông báo push notification gửi đến thiết bị nào? (mobile app, desktop app?)
10. Có cần hỗ trợ partial approval (ví dụ: duyệt 2 ngày trong 5 ngày xin nghỉ)?