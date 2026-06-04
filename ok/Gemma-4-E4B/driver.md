Chào bạn, đây là một dự án lớn và phức tạp. Để xây dựng một ứng dụng quản lý tệp và thư mục trên cloud (giống Google Drive) chỉ với các công nghệ đã cho (HTML, Tailwind CSS v4, Nuxt 4/Vue 3, Bootstrap Icons), chúng ta cần một kế hoạch chi tiết, phân rã công việc (Task Breakdown), và các tác vụ nguyên tử (Atomic Task Breakdown).

Vì bạn không chỉ định cơ sở dữ liệu hoặc backend cụ thể (ví dụ: Node.js, Python, v.v.), tôi sẽ giả định bạn sẽ sử dụng **Nuxt Server Routes** (API Routes trong Nuxt 3/4) để xử lý logic backend và tương tác với một dịch vụ lưu trữ giả lập hoặc thực tế sau này (ví dụ: S3, Firebase Storage, hoặc một cơ sở dữ liệu đơn giản).

Dưới đây là bản phân tích và kế hoạch chi tiết.

---

## 📝 Phân Tích Yêu Cầu (Requirements Analysis)

**Mục tiêu:** Xây dựng một ứng dụng web quản lý tập tin và thư mục trực tuyến (Cloud File Manager) với giao diện người dùng hiện đại.

**Chức năng cốt lõi cần có:**
1. **Authentication (Xác thực):** Đăng nhập/Đăng ký (Tuy nhiên, do phạm vi nhỏ, chúng ta có thể bắt đầu với một trạng thái đăng nhập giả lập).
2. **File/Folder Management:**
    * Xem danh sách các thư mục và tệp trong một thư mục (Directory Listing).
    * Tạo thư mục mới (Create Folder).
    * Tạo tệp mới (Create File - có thể là placeholder ban đầu).
    * Tải lên tệp (File Upload).
    * Tải xuống tệp (File Download).
    * Di chuyển/Đổi tên (Rename/Move).
    * Xóa (Delete).
3. **UI/UX:** Giao diện thân thiện, hiện đại, responsive, sử dụng Tailwind CSS v4 và Bootstrap Icons.

**Công nghệ được yêu cầu:**
* **Frontend:** HTML, Nuxt 4 (Vue 3).
* **Styling:** Tailwind CSS v4.
* **Icons:** Bootstrap Icons.
* **Backend/Logic:** Nuxt Server Routes (API Endpoints).

---

## 🏛️ Cấu Trúc Kiến Trúc Dự Án (Project Architecture Nuxt 4)

Dự án sẽ tuân theo cấu trúc chuẩn của Nuxt 4:

```
/project-root
├── .nuxt/                # Output build folder
├── node_modules/
├── /public               # Assets tĩnh (images, icons)
├── /composables          # Logic tái sử dụng (useAuth, useFileManager)
├── /components           # Các component UI (FileItem, Sidebar, Toolbar)
├── /layouts              # Các bố cục trang (DefaultLayout)
├── /pages                # Định tuyến (Pages)
│   ├── index.vue        # Trang chính (Root Directory)
│   └── settings.vue
├── /server               # Backend logic (API Endpoints)
│   ├── /api             # Các API Routes
│   │   ├── files.get.post.ts  # Lấy danh sách tệp
│   │   ├── files.upload.post.ts # Upload tệp
│   │   ├── files.create.post.ts # Tạo thư mục/tệp
│   │   └── ...
├── nuxt.config.ts        # Cấu hình Nuxt
└── tailwind.config.ts    # Cấu hình Tailwind CSS
```

---

## 💾 Cấu Trúc Dữ Liệu (Data Model)

Chúng ta cần định nghĩa cấu trúc cho các đối tượng được quản lý.

**1. `FileItem` (Tệp hoặc Thư mục):**

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | Mã định danh duy nhất. | `"f123abc"` |
| `name` | String | Tên của tệp hoặc thư mục. | `"My_Document.pdf"` / `"Reports"` |
| `type` | Enum | Loại đối tượng (`FILE` hoặc `FOLDER`). | `FOLDER` |
| `size` | Number | Kích thước (byte). (0 nếu là thư mục) | `102400` |
| `mimeType` | String | Loại MIME (chỉ áp dụng cho File). | `"application/pdf"` |
| `parentId`| String (UUID) | ID của thư mục chứa nó (null cho Root). | `"r_root"` |
| `createdAt`| Date | Thời gian tạo. | `2024-01-15T10:00:00Z` |

**2. `DirectoryStructure` (Cấu trúc tổng thể - Giả định):**
* Đây là cấu trúc logic mà server sẽ quản lý. Nó là một cây (Tree structure) được ánh xạ qua các ID và `parentId`.

---

## 🧩 Lập Kế Hoạch & Phân Rã Công Việc (Task Breakdown)

Đây là kế hoạch tổng quan, chia dự án thành các giai đoạn lớn (Milestones).

### 🚀 Giai đoạn 1: Thiết lập nền tảng (Setup & UI Foundation)
* Mục tiêu: Thiết lập môi trường và xây dựng giao diện cơ bản.
### 🏗️ Giai đoạn 2: Core Functionality (CRUD - Read)
* Mục tiêu: Hiển thị và duyệt cấu trúc tệp.
### 🛠️ Giai đoạn 3: Editing & Interaction (CRUD - Write)
* Mục tiêu: Cho phép người dùng thay đổi nội dung (Tạo, Xóa, Upload).
###  polish Giai đoạn 4: Refinement & Polish
* Mục tiêu: Tối ưu hóa UX, xử lý lỗi và hoàn thiện giao diện.

---

## 🔪 Phân Rã Tác Vụ Nguyên Tử (Atomic Task Breakdown)

Đây là danh sách các task nhỏ nhất, có thể thực hiện độc lập và kiểm thử được.

### 🎯 Giai đoạn 1: Setup & UI Foundation

**[Frontend - Nuxt/Vue/Tailwind]**
1. [Task 1.1] Initialize Nuxt 4 project structure.
2. [Task 1.2] Configure Tailwind CSS v4 in the project.
3. [Task 1.3] Set up basic layout component (`DefaultLayout.vue`).
4. [Task 1.4] Implement navigation structure (Sidebar/Breadcrumbs placeholder).
5. [Task 1.5] Design the main file viewing area structure (Grid/List view placeholder).
6. [Task 1.6] Integrate Bootstrap Icons library.
7. [Task 1.7] Create a mock data service/composables (`useMockData`) for initial testing.

**[Backend - Nuxt Server]**
8. [Task 1.8] Set up basic server routing structure.

### 🎯 Giai đoạn 2: Core Functionality (Reading Data)

**[Backend - API Endpoints]**
9. [Task 2.1] Implement API endpoint `/api/files/list` (Accepts `parentId`).
10. [Task 2.2] Implement mock logic for fetching the root directory items.
11. [Task 2.3] Test the root listing endpoint successfully (Mock response structure).

**[Frontend - UI Integration]**
12. [Task 2.4] Create `FileItem.vue` component to display a single file/folder (using icons).
13. [Task 2.5] Implement logic in `index.vue` to fetch data from `/api/files/list` upon mount.
14. [Task 2.6] Render the fetched list using `FileItem.vue`.
15. [Task 2.7] Implement basic navigation logic (clicking a folder navigates to its directory).

### 🎯 Giai đoạn 3: Editing & Interaction (Writing Data)

**[Backend - API Endpoints]**
16. [Task 3.1] Implement API endpoint `/api/files/create` (Handle Folder/File creation request).
17. [Task 3.2] Implement mock logic for creating a new entry in the data model.
18. [Task 3.3] Implement API endpoint `/api/files/upload` (Handle multipart/form-data upload). *Focus on receiving the file stream/data.*
19. [Task 3.4] Implement API endpoint `/api/files/delete`.
20. [Task 3.5] Implement API endpoint `/api/files/rename` / `/api/files/move`.

**[Frontend - User Interaction]**
21. [Task 3.6] Design and implement "New Folder" button/dialog UI.
22. [Task 3.7] Implement function to call `/api/files/create` for new folders and update the UI state optimistically.
23. [Task 3.8] Design and implement "Upload File" interface (Drag & Drop zone or standard input).
24. [Task 3.9] Implement logic to upload files via `/api/files/upload` and refresh the view upon success.
25. [Task 3.10] Implement context menu or action bar for Rename/Delete actions on `FileItem.vue`.
26. [Task 3.11] Integrate success/error notification system (Toast/Snackbar).

### 🎯 Giai đoạn 4: Refinement & Polish

**[Frontend - UX/UI]**
27. [Task 4.1] Implement responsive design checks across major breakpoints (using Tailwind utilities).
28. [Task 4.2] Add visual indicators for file type (icon/color coding).
29. [Task 4.3] Improve loading state indicators (Spinners while fetching/uploading).
30. [Task 4.4] Implement search/filter functionality on the main view.
31. [Task 4.5] Review and refactor code for clean separation of concerns (Components vs Logic vs API calls).

**[Backend - Robustness]**
32. [Task 4.6] Add basic input validation to all API routes (e.g., checking required fields).
33. [Task 4.7] Implement error handling middleware on server routes.

---

## 🛠️ Tóm Tắt Công Nghệ và Cách Sử Dụng

| Công Nghệ | Vai Trò Trong Dự Án | Cách Áp Dụng |
| :--- | :--- | :--- |
| **Nuxt 4 (Vue 3)** | Khung ứng dụng, State Management, Routing. | Sử dụng `<script setup>` cho logic component, `definePageMeta` cho routing. |
| **HTML/CSS** | Cấu trúc nội dung cơ bản. | Là nền tảng của mọi component Vue. |
| **Tailwind CSS v4** | Styling, Responsive Design. | Dùng các class utility trực tiếp trên các thẻ HTML/Vue. |
| **Bootstrap Icons** | Biểu tượng trực quan. | Import và sử dụng các thẻ `<i>` với tên icon tương ứng. |
| **Nuxt Server Routes** | Backend, Business Logic, Data Persistence (Giả lập). | Tạo các file trong `/server/api` để xử lý HTTP requests (GET, POST, etc.). |

### Lưu ý quan trọng về "Cloud" và "Persistence"

**Trong bản thiết kế này, tính năng "Cloud" và "Persistence" (lưu trữ vĩnh viễn) hiện đang được giả lập bằng bộ nhớ (in-memory state) hoặc mô phỏng trong server routes.**

Nếu bạn muốn tích hợp thực tế, bạn sẽ thay thế các hàm mock trong **Task 2.1** và **Task 3.x** bằng logic kết nối với:
1. **Database:** (Ví dụ: PostgreSQL/MongoDB qua Prisma/Kysely).
2. **Storage Service:** (Ví dụ: AWS S3, Google Cloud Storage) cho việc lưu trữ thực tế của các file đã upload.