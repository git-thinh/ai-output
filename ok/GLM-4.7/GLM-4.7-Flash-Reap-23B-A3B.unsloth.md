Dưới đây là phân tích, mô tả yêu cầu và lập kế hoạch chiến thuật (Task Breakdown) để xây dựng một hệ thống quản lý tập tin trên Cloud (Cloud Storage) sử dụng **Nuxt 4 (Full Stack)**, **Tailwind CSS v4** và **Bootstrap Icons**, bao gồm cấu trúc thư mục, mô hình dữ liệu và danh sách task chi tiết.

---

### 1. Cấu trúc thư mục (Project Architecture Nuxt 4)

Nuxt 4 cho phép tùy biến cấu trúc, nhưng để xử lý logic và API, chúng ta sẽ chia dự án thành 2 phần chính:

```text
cloud-storage-app/
├── app/                          # Frontend (Client-Side)
│   ├── assets/                   # Tài sản động, hình ảnh
│   ├── components/               # React Components (UI)
│   │   ├── ui/                   # Các component lặp lại (Button, Input, Modal...)
│   │   ├── layout/               # Layout chính (Sidebar, Header)
│   │   └── features/             # Các module chức năng
│   │       ├── file-list.vue     # Danh sách tập tin
│   │       ├── folder-tree.vue   # Cây thư mục (Sidebar)
│   │       ├── upload-zone.vue   # Khu vực thả file
│   │       └── preview.vue       # Xem trước tập tin
│   ├── composables/              # Logics (useAuth, useFile, useFolders)
│   ├── plugins/                  # Tailwind CSS v4 plugin
│   ├── middleware/               # Middleware (Auth check)
│   ├── pages/                    # Các trang (Login, Dashboard)
│   ├── server/                   # API Routes (Server Actions)
│   └── utils/                    # Helper functions
├── server/                       # Backend (Server Actions / API)
│   ├── api/                      # API Routes (Express.js style)
│   │   ├── folders/              # CRUD Folders
│   │   ├── files/                # CRUD Files, Upload, Download
│   │   └── auth/                 # Auth API
│   ├── middleware/               # Middleware backend
│   └── utils/                    # Backend logic (định nghĩa interface)
├── .env                          # Environment variables
├── package.json
└── nuxt.config.ts                # Cấu hình Nuxt 4
```

---

### 2. Mô hình Dữ liệu (Data Model)

Để mô hình Google Drive, chúng ta cần lưu trữ cấu trúc lặp và thông tin tập tin.

**A. Type Definitions (TypeScript)**
Định nghĩa shape của dữ liệu để đảm bảo type safety.

```typescript
// app/types/index.ts
export interface IFile {
  id: string; // UUID hoặc hash
  name: string; // Tên tập tin (ví dụ: image.png)
  mimeType: string; // MIME type (application/pdf, image/png)
  size: number; // Byte size
  url: string; // URL để tải hoặc xem
  thumbnail?: string; // URL ảnh thu nhỏ (cho ảnh)
  createdAt: string;
  updatedAt: string;
}

export interface IFolder {
  id: string;
  name: string; // Tên thư mục (ví dụ: Documents)
  parentId: string | null; // ID của thư mục cha (null nếu root)
  children: (IFolder | IFile)[]; // Lưu ý: Trong thực tế nên tách ra `folders` và `files` mảng để optimize, nhưng cho atomic task ta dùng flat structure hoặc tree. Ở dưới đây ta sẽ dùng flat structure với query.
  createdAt: string;
  updatedAt: string;
}

export interface IAuth {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}
```

**B. Database Schema (Logic)**
*   **Lưu trữ:** Vì đây là ứng dụng web, chúng ta giả lập database bằng Local Storage (cho demo) hoặc PostgreSQL/SQLite (cho production). Ở đây, ta giả lập storage bằng LocalStorage để chạy ngay trên trình duyệt.

*   **Schema:**
    *   `files`: Array `{ id, name, size, type, parentId, contentUrl }`
    *   `folders`: Array `{ id, name, parentId }`

---

### 3. Danh sách Task List Chi tiết (Task Breakdown)

Chúng ta sẽ chia thành 3 giai đoạn: **Setup (Khởi tạo)**, **Core Logic (Xử lý dữ liệu)** và **UI Implementation (Giao diện)**.

#### Phase 1: Setup & Configuration (Nuxt 4 Foundation)
*   **1.1** Khởi tạo Nuxt 4 project với cấu hình Tailwind v4.
*   **1.2** Cài đặt và cấu hình `@nuxtjs/tailwindcss` plugin để sử dụng Tailwind v4.
*   **1.3** Cài đặt `@nuxtjs/bootstrap-icons` để sử dụng icon library.
*   **1.4** Thiết lập cấu trúc thư mục `app/components`, `app/pages`, `server`.

#### Phase 2: Data Logic & Composables (Backend Simulation)
*   **2.1** Tạo `useLocalStorage` composable để quản lý state dữ liệu (tập tin/thư mục).
*   **2.2** Tạo `useFolderTree` composable để chuyển đổi flat data (array) sang tree structure (để hiển thị sidebar).
*   **2.3** Tạo `useFileOperations` composable với các method:
    *   `createFolder(folderName, parentId)`
    *   `deleteItem(itemId, type)`
    *   `searchFiles(query)`
*   **2.4** Tạo `useFileUpload` composable để xử lý logic upload (convert file sang Base64 hoặc giả lập URL).

#### Phase 3: UI Components (Frontend)
*   **3.1** Tạo `FileIcon` component: Hiển thị icon dựa trên mimeType (PDF, Image, Video, File).
*   **3.2** Tạo `FileCard` component: Card hiển thị thông tin tập tin (icon, name, size, date, action buttons).
*   **3.3** Tạo `FolderItem` component: Hiển thị thư mục với icon và nút expand/collapse.
*   **3.4** Tạo `Breadcrumbs` component: Hiển thị đường dẫn (Root > Documents > Project).

#### Phase 4: Layout & Navigation
*   **4.1** Tạo `AppLayout` component bao gồm:
    *   Sidebar (Tree view folders).
    *   Header (Search bar, User profile, Upload button).
    *   Main Content Area.
*   **4.2** Tạo `FileListView` component: Grid layout hiển thị các `FileCard`.

#### Phase 5: Interaction & Features
*   **5.1** Xử lý Upload: Tạo Drag & Drop zone (`UploadZone`) sử dụng Tailwind classes.
*   **5.2** Xử lý Navigation: Khi click vào folder trong Sidebar -> Update `currentFolderId` state -> Re-render `FileListView`.
*   **5.3** Xử lý Context Menu: Tạo Modal cho phép tạo thư mục, xóa file/folder khi click chuột phải (hoặc nút 3 dots).
*   **5.4** Xử lý Search: Tìm kiếm tập tin trong `currentFolderId`.

#### Phase 6: Styling & Polish (Tailwind CSS v4)
*   **6.1** Áp dụng Tailwind classes cho Layout (Flexbox/Grid).
*   **6.2** Style `FileCard` (hover effect, rounded corners, shadow).
*   **6.3** Style Modal (Backdrop, centered box).
*   **6.4** Style Loading states (Spinners).

---

### 4. Task Breakdown Chiến thuật (Atomic Task Breakdown)

Để đảm bảo không bỏ sót bước, chúng ta sẽ đi sâu vào từng dòng code logic.

#### **Group A: Environment & Configuration**

*   **A1.** `npx nux@latest init cloud-drive` (Khởi tạo).
*   **A2.** Thêm dependency `"@nuxtjs/tailwindcss": "^4.0.0"` vào `package.json`.
*   **A3.** Thêm dependency `"@nuxtjs/bootstrap-icons": "^1.11.0"` vào `package.json`.
*   **A4.** Trong `nuxt.config.ts`:
    *   Import Tailwind.
    *   Import Bootstrap Icons.
    *   Cấu hình Tailwind theme.
*   **A5.** Tạo thư mục `app/server` và `app/utils` (nếu chưa có).

#### **Group B: Type Definitions**

*   **B1.** Tạo file `app/types/storage.ts`.
*   **B2.** Define Interface `IFile` (id, name, type, size, parentId, url).
*   **B3.** Define Interface `IFolder` (id, name, parentId).
*   **B4.** Define Type `TItem = IFile | IFolder`.

#### **Group C: Backend Logic Simulation (Composables)**

*   **C1.** Tạo file `app/composables/useLocalStorage.ts`.
    *   Logic: Lấy item từ localStorage, Set item vào localStorage, Listen cho event storage.
*   **C2.** Tạo file `app/composables/useStore.ts`.
    *   Logic: Khởi tạo state `files: IFile[]`, `folders: IFolder[]`, `currentFolderId: string | null`.
*   **C3.** Tạo file `app/composables/useFolderTree.ts`.
    *   Logic: Function `buildTree(items, parentId)`: Lọc items, nhóm lại thành object tree.
*   **C4.** Tạo file `app/composables/useFileActions.ts`.
    *   **C4.1** Logic `uploadFile(file: File)`: Tạo object IFile, thêm vào mảng `files`.
    *   **C4.2** Logic `createFolder(name: string)`: Tạo object IFolder, thêm vào mảng `folders`.
    *   **C4.3** Logic `deleteItem(id: string, type: 'file' | 'folder')`: Filter mảng array.

#### **Group D: UI Components**

*   **D1.** Tạo `app/components/ui/Button.vue`.
    *   Props: `variant` ('primary', 'danger'), `label`.
    *   Logic: Render `<button class="..." ...>` sử dụng Tailwind.
*   **D2.** Tạo `app/components/ui/Modal.vue`.
    *   Props: `isOpen`, `title`, `onClose`, `children`.
    *   Logic: Conditional rendering (`v-if`), backdrop overlay.
*   **D3.** Tạo `app/components/ui/Input.vue`.
    *   Props: `modelValue`, `placeholder`.
    *   Logic: `v-model` binding, Tailwind border focus ring.

*   **D4.** Tạo `app/components/features/FileIcon.vue`.
    *   Logic: Nhận prop `mimeType`. Use `bi-file-earmark` (mặc định) hoặc `bi-file-pdf`, `bi-file-image`.
*   **D5.** Tạo `app/components/features/FileCard.vue`.
    *   Props: `file`.
    *   Logic: Hiển thị `FileIcon`, name, size (format bytes), date. Hover effect: `hover:bg-gray-100`.
*   **D6.** Tạo `app/components/features/FolderItem.vue`.
    *   Props: `folder`, `onSelect`, `onDelete`.
    *   Logic: Hiển thị folder icon, name. Click vào -> emit `onSelect`.

#### **Group E: Layout Structure**

*   **E1.** Tạo `app/components/layout/Sidebar.vue`.
    *   Logic: Call `useFolderTree` để lấy tree structure. Map qua từng node -> render `FolderItem`.
*   **E2.** Tạo `app/components/layout/Header.vue`.
    *   Props: `onUpload`, `searchQuery`.
    *   Logic: Search input `v-model`, Upload button click event.

#### **Group F: Main Page Logic**

*   **F1.** Tạo `app/pages/index.vue`.
*   **F2.** Import `useStore` composable.
*   **F3.** Call `useStore()` để lấy `files` và `currentFolderId`.
*   **F4.** Filter `files` dựa trên `currentFolderId` (kiểm tra `file.parentId === currentFolderId`).
*   **F5.** Render `FileCard` trong `div` với Tailwind Grid (`grid-cols-3 md:grid-cols-4 gap-4`).

#### **Group G: Interactions (Upload & Modals)**

*   **G1.** Tạo `app/components/features/UploadZone.vue`.
    *   Props: `onFileDrop`.
    *   Logic: Dragover event, Drop event.
*   **G2.** Tạo `app/components/features/CreateFolderModal.vue`.
    *   Props: `isOpen`, `onSubmit`, `onClose`.
    *   Logic: Input name. Submit -> Call `useFileActions` -> Update Store.
*   **G3.** Tạo `app/pages/index.vue` (update):
    *   Add `UploadZone` vào Header.
    *   Add `CreateFolderModal` vào components.
    *   Add `useFileActions` để handle upload logic (convert File -> IFile).

#### **Group H: Polish & Tailwind V4**

*   **H1.** Apply `bg-white` và `shadow-lg` cho `AppLayout`.
*   **H2.** Apply `text-gray-600`, `text-sm` cho text details.
*   **H3.** Style `FileCard` với rounded corners `rounded-xl` và `overflow-hidden`.
*   **H4.** Style Modal với `fixed inset-0` và `flex justify-center`.

---

### Tóm lại

Bằng cách chia nhỏ thành các task atomic như trên, bạn có một roadmap rõ ràng để xây dựng Cloud Storage App. Bạn sẽ bắt đầu với **Setup (A)**, sau đến **Data Logic (B, C)**, sau đến **UI Components (D, E)**, kết thúc với **Integration (F, G)** và **Styling (H)**. Điều này giúp việc quản lý dự án nhỏ trở thành một dự án lớn hiệu quả hơn.