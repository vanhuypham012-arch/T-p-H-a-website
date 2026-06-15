# Tiệm Tạp Hóa Xanh — Static Site

Hướng dẫn nhanh để đưa trang này lên GitHub Pages.

Chuẩn bị
- Tạo tài khoản GitHub nếu bạn chưa có: https://github.com/
- Tạo repository mới trên GitHub (khi tạo, bạn có thể để trống, hoặc add README sau)

Tự động (PowerShell)
- Mình đã cung cấp `deploy.ps1` để bạn chỉ cần chạy 1 lệnh và nhập URL remote của repo GitHub (ví dụ: `https://github.com/USERNAME/REPO.git`).

Cách chạy (PowerShell, trong thư mục dự án):

```powershell
# Vào thư mục dự án
cd "D:\bài tập của phạm văn huy\ĐỰ ÁN"

# Chạy script deploy (nếu bạn muốn nhập remote thủ công, chỉ chạy và làm theo hướng dẫn)
.\deploy.ps1

# Hoặc chạy với tham số remote:
.\deploy.ps1 -RemoteUrl "https://github.com/YOUR_USERNAME/YOUR_REPO.git"
```

Sau khi push xong
- Mở repository trên GitHub → Settings → Pages → Source: chọn `main` branch và folder `/ (root)` → Save
- Đợi vài phút, URL sẽ là: `https://YOUR_USERNAME.github.io/YOUR_REPO`

Ghi chú
- File `.nojekyll` đã được thêm để tránh GitHub Pages chạy Jekyll (giữ cấu trúc thư mục, tên file bắt đầu bằng `_` nếu có).
- Nếu bạn muốn tên miền riêng, thêm file `CNAME` chứa domain của bạn và cấu hình DNS.

Nếu gặp lỗi, gửi nội dung lỗi git hoặc chụp màn hình, mình sẽ hướng dẫn tiếp.