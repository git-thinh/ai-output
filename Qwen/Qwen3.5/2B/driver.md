Dưới đây là bản phân tích, thiết kế kiến trúc, mô tả dữ liệu và **Task Breakdown** chi tiết cho dự án **"CloudDrive Manager"**. Dự án này sẽ tập trung vào việc xử lý hệ thống file đa phương thức (Image/Video/Voice) và tối ưu hóa trải nghiệm người dùng giống Google Drive nhưng với giao diện hiện đại hơn.

---

### PHẦN 1: PHÂN TÍCH VÀ MÔ TẢ YÊU CẦU CHI TIẾT

#### 1. Phân tích业务 (Business Analysis)
*   **Mục tiêu:** Tạo một ứng dụng web giúp lưu trữ tài nguyên phi văn bản (File Storage).
*   **Khách hàng:** Cá nhân và Doanh nghiệp cần quản lý đám mây dễ dàng, có thể xem trực tiếp hình ảnh/video không cần tải xuống, chia sẻ mã nguồn Git.
*   **Tính năng cốt lõi:** Upload file đa dạng, quản lý folder, xem/thumbnail, share link, cấu hình bảo mật (permissions).
*   **Challenges:** Xử lý streaming video/camera, hiệu suất khi có nhiều người cùng truy cập, cơ sở dữ liệu lớn với hình ảnh khổng lồ.

#### 2. Yêu cầu kỹ thuật cụ thể
*   **Frontend:** Giao diện tốc độ cao, responsive, hiển thị thumbnail ảnh nhanh, hỗ trợ chế độ chuyển đổi video sang trình duyệt (WebRTC).
*   **Backend:** API RESTful hoặc GraphQL để tạo sự linh hoạt, giải quyết vấn đề "Cold Start".
*   **Database:** Relational DB (PostgreSQL) cho metadata và User data; Object Store (MinIO/S3-compatible) cho dữ liệu file thực tế.

#### 3. Công nghệ lựa chọn
*   **Framework:** Nuxt 4 (Composition API + Server Components).
*   **UI Framework:** Tailwind CSS v4 (Tối ưu render, type safety).
*   **Icons:** Bootstrap Icons.
*   **Language:** TypeScript (Phân biệt rõ ràng giữa client và server logic).
*   **Storage:** MinIO (SaaS compliant, miễn phí cho cá nhân).

---

### PHẦN 2: CHUẨN THỨC KÝẾN TRÚC (PROJECT ARCHITECTURE) - NUTS V4

Chúng ta sử dụng pattern **Nuxt App Structure**: `app` chứa logic Client-side và Vue components, `server` chứa các Routes static và Logic Server-side.

```text
cloud-drive-mp
├── nuxt.config.ts          # Cấu hình global (Tailwind v4 plugin), storage key
├── src/
│   ├── app.vue             # Entry point (Root component)
│   └── router/index.js     # Routers (Public routes)
├── public/                 # Static assets (Logo, fonts)
├── tailwind.config.js      # Custom classes (colors like Google Drive Orange)
│
├── api/                    # Backend Endpoints (Protected & Public)
│   ├── auth/               # Login, Register, Logout
│   ├── files/              # Upload, Get Files, Delete File
│   └── folders/            # Create Folder, Move File
│
├── composables/            # Utility functions ($useFileStore)
│   ├── useUpload.ts        # Handle progress bar, chunking for video
│   └── useThumbnail.ts     # Fetch thumbnails from remote URL
│
├── pages/                  # Layouts & Views (Client-Side Only)
│   ├── Home.vue            # Dashboard listing with filters
│   ├── FileViewer.vue      # Preview image/video in browser without download
│   ├── Settings.vue        # Permissions, Share settings
│   └── Auth.vue            # Login/Register Form
│
├── middleware/             # Authentication guards on all routes
│   
└── server/                 # Server-Side Logic (Static Pages)
    ├── index.server.tsx
    └── vite-env.d.ts       # Type definitions for Vite
```

---

### PHẦN 3: CẤU TRÚC DỮ LIỆU (DATA MODEL)

Dữ liệu được chia làm hai bộ dữ liệu chính để tối ưu hiệu năng.

#### A. Database Model (`database/schema.sql`)

**1. Users Table**
| ID | Username | Email | PasswordHash | Role (admin/user) | LastLoginAt | CreatedById | IsLocked |
|----|----------|-------|--------------|------------------|-------------|-------------|----------|

**2. Folders Tree (`folders.nodes`)**
*   Lưu trữ cấu trúc folder hierarchy (như file hệ thống).
| ID | Name | ParentID | Description | IconType | Order | SizeMB |
|----|------|----------|-------------|----------|---------|--------|

**3. Files List (`files.list`)**
*   Danh sách các tài nguyên hiện tại (Image, Video, TextDoc...).
| ID | Filename | OriginalUrl | ContentType (image/png, video/mp4) | ThumbnailSrc | OwnerId | FolderId | SizeBytes | DateModified |
|----|----------|-------------|-------------------------------------|---------------|---------|----------|-----------|--------------|

**4. File Metadata (`files.metadata`)**
*   Thông tin chi tiết của từng file (dùng cho streamer).
| ID | Filename | DurationSec | ResolutionWidth | ResolutionHeight | Codec | AudioCodec | LocationRelativePath | ExifDataJSON |
|----|----------|-------------|-----------------|------------------|-------|------------|---------------------|--------------|

---

### PHẦN 4: TẠO CẤU TRÚC THƯ MỤC CHI TIẾT (TASK BREAKDOWN)

Chia dự án thành 5 giai đoạn lớn (Phases), mỗi phase có nhiều task nhỏ nhất và **Atomic Task Breakdown**.

#### Phase 1: Core Infrastructure & Static Routes
*Mục tiêu: Setup Nuxt, Routing, Tailwind v4, Base Components.*

| Atomic Task ID | Task Title | Priority | Dependencies | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **P-01-A-01** | Init Project Structure (Nuxt + Tailwind v4) | High | - | Tạo `nuxt.config`, thư mục modules, `postcss.config`. |
| **P-01-A-02** | Install Nuxt 4 CLI & Vite Plugin | High | P-01-A-01 | Cài đặt plugins Vite, Nuxt Composition API. |
| **P-01-A-03** | Configure Tailwind CSS v4 Theme | Medium | P-01-A-01 | Define colors (Primary Blue/Orange), typography. |
| **P-01-A-04** | Set up Public Router (/home) | Low | P-01-A-03 | Cấu hình routes public để hiển thị Landing Page. |
| **P-01-A-05** | Create Layout Shell (.vue) | High | P-01-A-01, A-06 | Wrapper chứa Navbar, Footer, Responsive Container. |
| **P-01-A-06** | Add Bootstrap Icons CDN to HTML | Low | P-01-A-01 | Đảm bảo icon được load đúng version. |
| **P-01-A-07** | Implement Login/Register Form | High | P-01-A-05 | Form validation logic trên client-side. |

#### Phase 2: Authentication System (Auth Module)
*Mục tiêu: Quản lý session, User Profile.*

| Atomic Task ID | Task Title | Priority | Dependencies | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **P-02-A-01** | Design Auth Component | High | P-01-A-07 | Input fields cho email/password. |
| **P-02-A-02** | Store JWT Token in LocalStorage | High | P-01-A-07 | Secure storage for user info. |
| **P-02-A-03** | Middleware Protection Logic | Critical | P-01-A-07 | Guard all route with `useGuard` or similar utility. |
| **P-02-A-04** | Register New User Flow | High | P-02-A-03 | Captures name/email on first login. |
| **P-02-A-05** | Forgot Password Functionality | High | P-02-A-04 | Email verification link handling. |
| **P-02-A-06** | Update User Profile UI | High | P-02-A-07 | Edit Name, Bio, Photo upload preview. |
| **P-02-A-07** | Logout & Session Cleanup | Medium | P-02-A-06 | Clear tokens and reset state. |

#### Phase 3: File Upload Engine (File API)
*Mục tiêu: Xử lý file đa dạng, Stream video không cần download.*

| Atomic Task ID | Task Title | Priority | Dependencies | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **P-03-A-01** | Create File Upload Route (`/api/files/upload`) | High | - | Endpoint accept multipart/form-data. |
| **P-03-A-02** | Handle Image Files (PNG/JPG) | High | P-03-A-01 | Save to Object Storage (MinIO). |
| **P-03-A-03** | Handle Video Files (.mp4/mov) | High | P-03-A-01 | Use chunked transfer protocol or direct stream endpoint if possible. |
| **P-03-A-04** | Implement Thumbnail Fetcher | High | P-03-A-01 | Call external service to get small preview image. |
| **P-03-A-05** | Auto Rename Logic | Low | P-03-A-04 | Generate unique filename based on date + hash. |
| **P-03-A-06** | Validation Rules (Ext > 4MB?) | Medium | P-03-A-03 | Reject files larger than threshold immediately. |

#### Phase 4: Folder Management System
*Mục tiêu: Tạo, di chuyển, xóa folder và quản lý permissions.*

| Atomic Task ID | Task Title | Priority | Dependencies | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **P-04-A-01** | Build Folder Tree Component | Critical | P-01-A-05 | Visual tree view with drag-and-drop support. |
| **P-04-A-02** | Create New Folder API Endpoints | High | P-03-A-01 | POST /folders/create. |
| **P-04-A-03** | Move File Functionality | High | P-03-A-01 | Update metadata path relative to root. |
| **P-04-A-04** | Delete File Functionality | High | P-03-A-01 | Remove from list and store metadata. |
| **P-04-A-05** | Bulk Operations (Select All/Delete) | Medium | P-04-A-01 | Checkbox selection logic. |
| **P-04-A-06** | Recursive Search & Filter UI | High | P-01-A-05 | Dropdown/filter bar for "All", "Images only". |

#### Phase 5: File Viewer Experience (WebRTC/Preview)
*Mục tiêu: Xem file trực tiếp trên trình duyệt mà không tải xuống (Streaming).*

| Atomic Task ID | Task Title | Priority | Dependencies | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **P-05-A-01** | Design Image Preview View | Critical | - | Full screen modal, zoom capability. |
| **P-05-A-02** | Design Video Streaming View | Critical | - | Play/Pause controls, Volume slider. |
| **P-05-A-03** | Fetch Metadata Server-Side | High | P-04-A-04 | Get duration/resolution before streaming starts. |
| **P-05-A-04** | Implement Stream Logic | Medium | P-05-A-03 | Use `stream` tag or WebRTC library in Nuxt. |
| **P-05-A-05** | Add Download Button (Fallback) | Low | P-05-A-04 | If preview fails, show download link. |
| **P-05-A-06** | Share Link Generator Feature | Medium | - | Generate unique URL for specific folder/file. |

---

### PHẦN 5: KẾT LUẬN VÀ LƯU Ý KIỂM SOÁT

Để đảm bảo dự án thành công và tương thích với Google Drive:

1.  **Performance:** Sử dụng Vite cho build time nhanh hơn Tailwind v4 chuẩn. Tối ưu CSS sử dụng Grid/Flexbox thay vì margin/padding để giảm load JS bundle.
2.  **Security:** Luôn dùng HTTPS. Validate mọi input ở Client AND Server-side. Không lưu mật khẩu plain text trong DB.
3.  **Scalability:** Nếu có nhiều người cùng xem video, cần cân nhắc CDN hoặc streamer server riêng biệt nếu lượng dữ liệu lớn vượt quá giới hạn MinIO mặc định.
4.  **Code Quality:** Sử dụng TypeScript strict mode, ESLint plugin type-checker, và Vitest cho unit tests của composables API.