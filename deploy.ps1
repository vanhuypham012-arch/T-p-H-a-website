param(
    [string]$RemoteUrl
)

# Helper PowerShell to initialize git repo and push to remote
# Usage: .\deploy.ps1 -RemoteUrl "https://github.com/USERNAME/REPO.git"

Set-StrictMode -Version Latest

$cwd = Get-Location
Write-Host "Working directory: $cwd"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git không được tìm thấy trên PATH. Cài Git trước (https://git-scm.com/downloads)."
    exit 1
}

if (-not $RemoteUrl) {
    $RemoteUrl = Read-Host "Nhập URL remote Git (ví dụ https://github.com/USERNAME/REPO.git)"
}

if (-not $RemoteUrl) {
    Write-Error "Không có remote URL. Hủy."
    exit 1
}

try {
    if (-not (Test-Path -Path .git -PathType Container)) {
        git init
        Write-Host "Git repo mới đã được khởi tạo."
    } else {
        Write-Host "Thư mục đã có git repo."
    }

    git add .
    git commit -m "Deploy static site" -a | Out-Null

    # Thiết lập remote
    $existing = git remote
    if ($existing -notmatch "origin") {
        git remote add origin $RemoteUrl
    } else {
        git remote set-url origin $RemoteUrl
    }

    git branch -M main
    Write-Host "Đẩy lên remote origin (branch main)..."
    git push -u origin main
    Write-Host "Đã push. Bây giờ vào GitHub → Settings → Pages để bật GitHub Pages (chọn branch 'main' và folder '/')."
} catch {
    Write-Error "Có lỗi khi deploy: $_"
    exit 1
}

Write-Host "Hoàn tất. Nếu page chưa hiện, chờ vài phút rồi thử làm mới URL trên GitHub Pages."