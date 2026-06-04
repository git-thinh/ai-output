Chào bạn, đây là một đề xuất chi tiết về phân tích yêu cầu, lên kế hoạch, chia nhỏ tác vụ (Task Breakdown & Atomic Task Breakdown) để xây dựng một ứng dụng Web quản lý thư mục/tập tin trên Cloud Online tương tự Google Drive, chỉ sử dụng các công nghệ đã cho: **HTML, Tailwind CSS v4, Nuxt 4 (Vue.js), Bootstrap Icons**.

---

## Phần 1: Phân Tích Yêu Cầu Chi Tiết (Requirement Analysis)

### 1. Mục tiêu Dự án
Xây dựng một ứng dụng web SPA (Single Page Application) hoặc SSR (Server-Side Rendering) sử dụng Nuxt 4 để quản lý cấu trúc thư mục và tệp tin trực tuyến, mô phỏng chức năng cơ bản của Google Drive (tạo thư mục, tải tệp lên, xem nội dung).

### 2. Các Tính Năng Chính (Core Features)
*   **Quản lý Người dùng:** Đăng nhập/Đăng ký (Tối thiểu hóa ở giai đoạn đầu, có thể giả lập).
*   **Quản lý Thư mục (Folder Management):**
    *   Tạo mới thư mục.
    *   Đổi tên thư mục.
    *   Xóa thư mục.
    *   Xem cây thư mục (Tree View).
*   **Quản lý Tệp tin (File Management):**
    *   Tải tệp lên (Upload files).
    *   Xem thông tin tệp (Tên, kích thước, loại).
    *   Tải xuống tệp (Download files).
    *   Xóa tệp.
*   **Giao diện người dùng (UI/UX):** Giao diện hiện đại, responsive, sử dụng Tailwind CSS v4 và Bootstrap Icons.
*   **Lưu trữ Dữ liệu (Backend Logic):** Xử lý logic CRUD (Create, Read, Update, Delete) cho cấu trúc thư mục và metadata của tệp tin.

### 3. Các Công Nghệ Bắt Buộc
*   **Frontend Framework:** Nuxt 4 (sử dụng Vue 3).
*   **Styling:** Tailwind CSS v4.
*   **Icons:** Bootstrap Icons.
*   **Ngôn ngữ Markup:** HTML (được xử lý bởi Nuxt/Vue templates).

### 4. Giả định Kiến trúc Backend (Quan trọng)
Vì yêu cầu chỉ liệt kê Frontend Stack (Nuxt, Tailwind), chúng ta cần giả định một kiến trúc backend để lưu trữ dữ liệu thực tế.
*   **Giả định:** Sẽ sử dụng một API Server (ví dụ: Node.js/Express, hoặc Nuxt Server Routes nếu muốn đơn giản hóa ban đầu) kết nối với một Database (ví dụ: PostgreSQL, MongoDB) để lưu trữ đường dẫn, tên tệp, quyền truy cập. **Trong phạm vi dự án này, chúng ta sẽ tập trung vào việc xây dựng giao diện và luồng dữ liệu.**

---

## Phần 2: Thiết Kế Cấu Trúc Dự Án (Project Architecture)

Dựa trên khuyến nghị của Nuxt 4 (App & Server structure).

### 1. Cấu trúc Thư mục Dự án (Project Structure - Nuxt 4)

```
my-cloud-drive/
├── .nuxt/                  # Generated files by Nuxt
├── node_modules/           # Dependencies
├── public/                 # Static assets (images, fonts)
├── server/                 # API Routes / Server Logic (Nếu có SSR/API routes)
│   └── api/                # Ví dụ: api/files.ts, api/folders.ts
├── components/             # Reusable UI Components
│   ├── layout/             # Header, Sidebar, Footer
│   ├── folder/             # FolderTree, FolderItemCard
│   └── file/               # FileUploader, FileListItem
├── pages/                  # Application Pages (Routing)
│   ├── index.vue           # Dashboard/Root view
│   ├── login.vue
│   └── drive/[folderId].vue # Dynamic route for specific folder view
├── composables/            # Reusable Vue Composables (State management helpers)
│   └── useDriveService.ts  # Logic gọi API
├── store/ (or composables/)# State Management (Pinia recommended for complex state)
│   └── driveStore.ts       # State for current path, selected items
├── assets/                 # Global styles, custom utilities
│   └── main.css            # Import Tailwind base and custom configurations
├── nuxt.config.ts          # Nuxt configuration
├── package.json
└── tsconfig.json
```

### 2. Cấu trúc Dữ liệu (Data Model)

Chúng ta cần ít nhất hai Entity chính: `Folder` và `File`.

#### A. Data Model: Folder (Thư Mục)
| Field Name | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `id` | UUID/String | Primary Key | Unique, Auto-generated |
| `name` | String | Tên thư mục | Required |
| `parentId` | UUID/String | ID của thư mục cha (null nếu là root) | Foreign Key to Folder.id |
| `createdAt` | Timestamp | Thời gian tạo | |
| `updatedAt` | Timestamp | Thời gian cập nhật cuối | |
| `size` | Integer | Tổng dung lượng (bytes) | Calculated or stored |
| `isDeleted` | Boolean | Trạng thái mềm xóa (Soft Delete) | Default: false |

#### B. Data Model: File (Tệp Tin)
| Field Name | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `id` | UUID/String | Primary Key | Unique, Auto-generated |
| `name` | String | Tên tệp tin | Required |
| `contentUrl` | String | URL lưu trữ thực tế của tệp (ví dụ: AWS S3 link) | Required |
| `fileType` | String | Loại tệp (image, docx, zip...) | |
| `size` | Integer | Kích thước tệp (bytes) | |
| `folderId` | UUID/String | ID của thư mục chứa tệp này | Foreign Key to Folder.id |
| `uploadedBy` | String | User ID đã tải lên | |
| `createdAt` | Timestamp | Thời gian tải lên | |

---

## Phần 3: Lập Kế Hoạch Công Việc Chi Tiết (Task Breakdown & Atomic Task Breakdown)

Dự án sẽ được chia thành các giai đoạn lớn (Milestones).

### Giai đoạn 1: Thiết lập Nền tảng (Foundation Setup) - (Ước tính: 20%)

**Mục tiêu:** Thiết lập cấu trúc dự án, thiết lập môi trường phát triển cơ bản, và xây dựng giao diện khung sườn.

| Task ID | Task Description (High Level) | Atomic Tasks (Detailed Steps) | Dependencies | Est. Time |
| :--- | :--- | :--- | :--- | :--- |
| **1.1** | Khởi tạo Dự án Nuxt 4 | 1.1.1 Cài đặt Nuxt CLI / Tạo project mới. <br> 1.1.2 Cấu hình TypeScript (`tsconfig.json`). <br> 1.1.3 Cài đặt Tailwind CSS v4 và Bootstrap Icons. | None | 2h |
| **1.2** | Thiết lập Layout Cơ bản | 1.2.1 Tạo file layout chính (`AppLayout.vue`). <br> 1.2.2 Xây dựng Header (Navigation Bar) với Logo và nút Đăng nhập. <br> 1.2.3 Xây dựng Sidebar (Folder Tree placeholder). | 1.1 | 3h |
| **1.3** | Thiết lập State Management | 1.3.1 Cài đặt Pinia. <br> 1.3.2 Định nghĩa Store cơ bản cho trạng thái người dùng và dữ liệu Drive. | 1.1 | 2h |
| **1.4** | Mock Data API | 1.4.1 Viết hàm mock để trả về danh sách thư mục/tệp tin tĩnh. <br> 1.4.2 Tích hợp mock data vào Store. | 1.3 | 2h |

### Giai đoạn 2: Quản lý Thư mục (Folder Management) - (Ước tính: 35%)

**Mục tiêu:** Triển khai đầy đủ chức năng xem cây thư mục và CRUD cơ bản cho thư mục.

| Task ID | Task Description (High Level) | Atomic Tasks (Detailed Steps) | Dependencies | Est. Time |
| :--- | :--- | :--- | :--- | :--- |
| **2.1** | Hiển thị Cây Thư Mục | 2.1.1 Phát triển Component `FolderTree.vue` (sử dụng recursion hoặc nested loops). <br> 2.1.2 Áp dụng styling Tailwind cho các node của cây. | 1.2, 1.4 | 4h |
| **2.2** | Chức năng Tạo Thư Mục | 2.2.1 Xây dựng Form Modal/Dialog để tạo tên thư mục. <br> 2.2.2 Gọi API (Mock hoặc thực tế) để thêm Folder mới vào state. | 1.3 | 3h |
| **2.3** | Chức năng Sửa/Xóa Thư Mục | 2.3.1 Thêm chức năng Edit trên từng item trong Tree View. <br> 2.3.2 Triển khai logic xác nhận xóa (Confirmation Dialog). <br> 2.3.3 Cập nhật lại State sau khi thay đổi thành công. | 2.1, 2.2 | 4h |
| **2.4** | Routing & Navigation | 2.4.1 Cấu hình Dynamic Route (`/drive/[folderId]`). <br> 2.4.2 Logic chuyển đổi giữa view danh sách và view chi tiết folder. | 1.2 | 2h |

### Giai đoạn 3: Quản lý Tệp Tin (File Management) - (Ước tính: 30%)

**Mục tiêu:** Cho phép người dùng tải tệp lên, xem thông tin và tải xuống.

| Task ID | Task Description (High Level) | Atomic Tasks (Detailed Steps) | Dependencies | Est. Time |
| :--- | :--- | :--- | :--- | :--- |
| **3.1** | Component Upload File | 3.1.1 Thiết kế giao diện Drag & Drop Zone (Sử dụng Tailwind). <br> 3.1.2 Viết logic Vue để xử lý file được chọn. | 1.2, 1.4 | 5h |
| **3.2** | Xử lý Upload Backend | 3.2.1 Viết Server Route (hoặc gọi API) để nhận file. <br> 3.2.2 Mô phỏng việc lưu trữ URL tệp và metadata vào DB. | Giả định Backend | 6h |
| **3.3** | Hiển thị Danh sách Tệp | 3.3.1 Phát triển Component `FileListItem.vue`. <br> 3.3.2 Hiển thị Icon tương ứng với loại tệp (sử dụng Bootstrap Icons). <br> 3.3.3 Hiển thị kích thước và ngày tạo. | 2.1, 3.2 | 3h |
| **3.4** | Download & Delete File | 3.4.1 Thêm nút Download cho mỗi tệp (sử dụng `<a>` tag với URL). <br> 3.4.2 Thêm chức năng xóa tệp từ UI. | 3.3 | 2h |

### Giai đoạn 4: Hoàn thiện và Tối ưu hóa (Finalization & Polish) - (Ước tính: 15%)

**Mục tiêu:** Đảm bảo trải nghiệm người dùng tốt, tối ưu styling và kiểm thử cuối cùng.

| Task ID | Task Description (High Level) | Atomic Tasks (Detailed Steps) | Dependencies | Est. Time |
| :--- | :--- | :--- | :--- | :--- |
| **4.1** | Styling & Responsiveness Review | 4.1.1 Kiểm tra toàn bộ layout trên các breakpoint (Mobile/Tablet). <br> 4.1.2 Điều chỉnh màu sắc và khoảng cách theo guideline của Tailwind. | Tất cả các task trước | 3h |
| **4.2** | Error Handling & Feedback | 4.2.1 Triển khai thông báo lỗi rõ ràng (Toast Notifications) khi upload/delete thất bại. <br> 4.2.2 Cải thiện trạng thái loading (Loading Spinners). | Các task có I/O | 2h |
| **4.3** | Code Refactoring & Cleanup | 4.3.1 Rà soát lại code trong Composables và Store để đảm bảo tính tái sử dụng cao. <br> 4.3.2 Tối ưu hóa hiệu suất render (nếu cần). | Toàn bộ dự án | 3h |

---

## Tóm tắt Lộ trình Thực hiện

Đây là một lộ trình phát triển tuần tự, tập trung xây dựng nền móng vững chắc trước khi thêm các tính năng phức tạp hơn.

1.  **Setup Environment:** Thiết lập Nuxt, Tailwind, Pinia.
2.  **UI Shell:** Xây dựng Header và Sidebar cố định.
3.  **Data Foundation:** Tạo Mock Data và State Management.
4.  **Core Feature 1 (Folders):** Xây dựng logic hiển thị cây thư mục và CRUD cơ bản.
5.  **Core Feature 2 (Files):** Xây dựng luồng Upload -> Lưu trữ Metadata -> Hiển thị danh sách tệp.
6.  **Polish:** Tinh chỉnh giao diện, xử lý lỗi và làm cho ứng dụng hoạt động trơn tru.