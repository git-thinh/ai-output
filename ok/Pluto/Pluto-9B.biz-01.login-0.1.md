</think>

Tôi sẽ tạo một hệ thống đăng nhập hoàn chỉnh với React + TypeScript + Tailwind CSS. Dưới đây là kế hoạch chi tiết:

## Kế Hoạch Thực Thi

### 1. Cấu trúc thư mục đề xuất
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   └── AuthLayout.tsx
│   ├── ui/
│       └── InputField.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useAuthForm.ts
├── types/
│   └── authTypes.ts
├── services/
│   └── authService.ts
└── pages/
    ├── LoginPage.tsx
    ├── RegisterPage.tsx
    └── ProtectedRoute.tsx
```

### 2. Các thành phần chính

**A. LoginForm.tsx** - Form đăng nhập với:
- Email và mật khẩu
- Checkbox "Ghi nhớ"
- Nút đăng nhập chính
- Link quên mật khẩu
- Link đăng ký tài khoản

**B. RegisterForm.tsx** - Form đăng ký với:
- Tên đầy đủ
- Email
- Mật khẩu (với xác nhận)
- Checkbox đồng ý điều khoản

**C. useAuth.ts** - Hook quản lý trạng thái auth:
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const useAuth = () => {
  const [state, setState] = useState<AuthState>({ ... });
  
  const login = async (email: string, password: string) => { ... };
  const register = async (userData: RegisterData) => { ... };
  const logout = () => { ... };
  
  return { state, login, register, logout };
};
```

### 3. Tính năng bảo mật cần thiết

| Tính năng | Mô tả |
|-----------|-------|
| **HTTPS** | Bắt buộc cho mọi giao dịch |
| **Password Hashing** | Sử dụng bcrypt/argon2 |
| **Rate Limiting** | Giới hạn 5 lần thử trong 15 phút |
| **CORS** | Cấu hình đúng domain |
| **CSRF Token** | Bảo vệ form đăng nhập |

### 4. Xử lý trạng thái và feedback

```typescript
// Loading states
const [isLoading, setIsLoading] = useState(false);

// Error handling with user-friendly messages
const handleLoginError = (error: string) => {
  const messages: Record<string, string> = {
    'invalid_credentials': 'Email hoặc mật khẩu không đúng',
    'email_exists': 'Email đã được sử dụng',
    'password_too_short': 'Mật khẩu phải có ít nhất 8 ký tự'
  };
  return messages[error] || error;
};
```

### 5. Accessibility (Truy cập)

- Label cho tất cả input
- ARIA attributes cho form
- Keyboard navigation support
- Screen reader friendly messages

### 6. Responsive Design

```css
/* Mobile-first approach */
.auth-container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .auth-container {
    max-width: 400px;
    margin: 0 auto;
  }
}
```

### 7. Testing Strategy

| Loại test | Công cụ | Mục tiêu |
|-----------|---------|----------|
| Unit tests | Jest + React Testing Library | Logic form, validation |
| Integration tests | Cypress | Flow đăng nhập hoàn chỉnh |
| E2E tests | Playwright | Cross-browser compatibility |

### 8. Deployment Considerations

- Environment variables cho API endpoints
- Database migration scripts
- Health check endpoint
- Logging và monitoring

---

**Bạn muốn tôi bắt đầu triển khai phần nào trước?** Tôi có thể:

1. Tạo toàn bộ cấu trúc file và code
2. Tập trung vào một thành phần cụ thể (ví dụ: LoginForm)
3. Triển khai từ từ từng bước với giải thích chi tiết