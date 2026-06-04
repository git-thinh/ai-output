Dưới đây là phân tích chi tiết yêu cầu của bạn, bao gồm việc thiết kế cấu trúc dữ liệu cho Google Drive-like và lập chiến lược giải quyết vấn đề "Cloud Online" trong môi trường Nuxt 4 với các công cụ tối ưu hóa đã nêu.

### 1. Phân Tích Yêu Cầu Chi Tiết & Mô Hình Dữ Liệu

Yêu cầu này đòi hỏi một hệ thống quản lý file (File Management System) với đặc điểm nổi bật là **sự tương tác chéo giữa toàn bộ kho lưu trữ (Storage)** thay vì chỉ đọc lại từng tập tin rời rạc như Google Docs hoặc Sheets.

**Mô hình Dữ liệu:**
Hệ thống sẽ phải thể hiện sự liên kết sâu sắc giữa các thư mục cùng cấp bậc dưới cùng. Một folder A chứa nhiều subfolder B; nếu bạn mở ra folder C trong folder B, nó cũng nằm trong Folder A.

*   **Root Node (`/`):** Tổng quan chung.
    *   `files`: Danh sách tất cả tập tin trong toàn bộ kho lưu trữ.
        *   `documents`, `images`, `videos`.
        *   `projects`, `workspaces`, `tasks`.
    *   `folders`: Danh sách các nhánh thư mục đang hoạt động.
        *   `a`, `b`, `c...` (Sử dụng các tên thư mục thực tế hoặc mã nguồn).
            *   Sub-nodes thường chứa `file-list`, `doc-content`, `video-preview`, `project-data`...
    *   `storage`: Thông tin tổng quát của kho lưu trữ.
        *   `total_files`, `last_modified`, `recent_additions`, `quota_usage`.
    *   `admin`: Quản trị viên (Admin Panel), qui trình chạy (cron jobs), API endpoints, settings.

---

### 2. Lập Kế Hoạch Giải Phá Vấn Đề (Project Plan)

Để xử lý hiệu quả với quy mô lớn, chúng ta cần tách nhiệm vụ theo giai đoạn rõ ràng.

| Giai Đoạn | Nhiệm Vụ (Task) | Vai Trò / Mục Tiêu |
| :--- | :--- | :--- |
| **Giai 1: Xây dựng cơ sở hạ tầng nền tảng** | Thiết kế giao diện UI/UX chuẩn Google Drive + Build Backend Nuxt 4 | Tạo khung xương: Cấu trúc code, thư viện Icons, Router logic, Database schema Nuxt. |
| **Giai 2: Xóa rác thải cũ & Chạy Database** | Cleanup old data, Setup SQLite/NestDB, Initial Seed Data | Lọc file quá khứ không thiết yếu để giảm tải server và đưa dữ liệu mới vào hàng đầu tiên. |
| **Giai 3: Hoàn thiện Core Logic** | CRUD Operations cho File Folders, Search, Pagination, Permission Logic | Xử lý tính năng "Search", "Filter", "Sort" trên danh sách thư mục. |
| **Giai 4: Tích hợp Cloud Storage (Storage)** | Connect lại với CDN/Cloud Provider (Google/GitLab/S3), Upload/Download Files | Xử lý luồng file trực tiếp từ cloud đến máy chủ/local, ngược lại. |
| **Giai 5: Admin Dashboard & Automation** | Implementer tự động hóa (Cron Jobs), Settings, Backup Strategy | Cung cấp quyền quản trị cao cấp để quản lý kho lưu trữ chính thức. |

---

### 3. Task Breakdown & Atomic Tasks (Chia nhỏ thành atomic tasks)

Dưới đây là phân tích từng task cụ thể dựa trên yêu cầu HTML/Tailwind/nuxt/bootstrap-icons:

#### Phase A: UX/UI & Frontend Skeleton
*   **Atomic Task 0:** Thiết lập cấu trúc Node.js project với thư mục `src/pages`, `src/components`, `src/views`.
*   **Atomic Task 1:** Import Tailwind CSS v4 (CDN hoặc Module Vite/Vercel).
*   **Atomic Task 2:** Import Bootstrap Icons (CDN).
*   **Atomic Task 3:** Build Main Layout (`App.vue` - thay thế) sử dụng Flexbox/Grid với Navbar style Google Drive.
    *   *Key Features:* Sidebar navigation (Tabs for folders), Header with search bar and user profile icons.
*   **Atomic Task 4:** Design the Root Folder structure (Folder `/`).
    *   *Layout:* Container centered on screen. Sticky header. List of items below. Hover effect to expand folder in sidebar or show preview.

#### Phase B: Navigation & Organization Logic
*   **Atomic Task 5:** Create Sub-components: `FileListItem`, `DocumentPreview`, `ProjectDataTable`.
    *   *Logic:* Hàm render mỗi item trong tree view. Sử dụng `v-if/v-else` logic cho subfolders khi cần hiển thị nhiều hơn một lần.
*   **Atomic Task 6:** Implement a "Collapse Tree" feature. Clicking a node should switch from horizontal list to vertical list while keeping parent open.
*   **Atomic Task 7:** Add dynamic filtering (e.g., filter by type like "Documents").

#### Phase C: Core Data Handling (Nuxt 4 Specifics)
*   **Atomic Task 8:** Setup Nuxt Router components (using Vue Router + nuxt.config). Define routes like `route/file-list`, `route/tree-view`, `route/storage-info`.
*   **Atomic Task 9:** Database Schema Definition (SQLite):
    ```sql
    CREATE TABLE IF NOT EXISTS storage_files { id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, url VARCHAR(500), path_to_file TEXT, created_at DATETIME; }
    
    CREATE INDEX idx_name ON storage_files(name);
    ```
*   **Atomic Task 10:** CRUD Operations Implementation using LocalStorage/NestDB hybrid approach for performance during initial load.
    *   *Strategy:* Load all files first into memory -> Render in page -> Save only changed ones back. This saves disk space initially but keeps it responsive.

#### Phase D: Cloud Storage Integration
*   **Atomic Task 11:** Fetch file data from cloud provider API (e.g., Google Cloud Storage / GitLab CI/CD URL).
*   **Atomic Task 12:** Handle Upload/File Download flow within the app context.
    *   *UX Flow:* User clicks upload button -> Backend returns File Object -> Frontend displays image/video directly without uploading locally (if possible, saving local cache for speed).
*   **Atomic Task 13:** Implement CORS handling if necessary between client-side and backend/cloud services.

#### Phase E: Admin & Automation
*   **Atomic Task 14:** Build an "Admin Panel".
    *   Features: View entire inventory table, Search globally, Delete folders/projects with confirmations.
*   **Atomic Task 15:** Set up Cron Jobs (Job Scheduler).
    *   Trigger: Check every hour or daily at 2 AM. Action: Log new folder creation/update, send push notifications to admin.
*   **Atomic Task 16:** Security Policy Logic. Ensure that when admins delete items, they can't see deleted items on other pages until refreshed (or implement a specific cleanup schedule).

### 4. Checklist cho việc thực hiện nhanh ngay lập tức (Immediate Actions)

Nếu bạn cần bắt đầu làm theo thứ tự này để có kết quả nhất định trong ngày hôm nay:

1.  **Setup Codebase:** Initialize Vite project, install Tailwind v4 CSS.
2.  **Starter Components:** Copy các template từ Google Drive UI và dùng chúng trong trang chủ (`index.html`).
3.  **Database Seed:** Tạo vài thư mục test dummy nội dung để biết cách render dữ liệu trước khi tải hết database.
4.  **Navigation Menu:** Cài đặt sidebar menu với icon bootstrap icons.
5.  **First Demo Page:** Tạo một widget hiển thị danh sách tập tin đơn giản trên toàn màn hình.