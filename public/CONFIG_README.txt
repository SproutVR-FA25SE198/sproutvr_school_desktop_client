# SproutVR Desktop Client

## Cấu hình ứng dụng (Configuration)

Trước khi chạy ứng dụng, hãy cấu hình file `.env` trong thư mục `resources`:

### Vị trí file cấu hình:
```
SproutVR/resources/.env
```

### Các cài đặt cần thay đổi:

Mở file `.env` bằng Notepad và chỉnh sửa các giá trị sau:

```env
# URL của máy chủ trường học của bạn (School Server URL)
SCHOOL_URL=http://YOUR_SERVER_IP:PORT

# URL của máy chủ gRPC (gRPC Server URL)
GRPC_SERVER_URL=YOUR_SERVER_IP:PORT

# URL tải package (được cung cấp trên website sproutvr.vercel.app)
PROVIDER_URL=https://gateway.146.190.4.121.nip.io
```

### Ví dụ cấu hình:

Nếu máy chủ của bạn có IP là `192.168.1.100`:

```env
SCHOOL_URL=http://192.168.1.100:7001
GRPC_SERVER_URL=192.168.1.100:7701
```

## Chạy ứng dụng

1. Cấu hình file `.env` như hướng dẫn ở trên
2. Chạy `SproutVR.exe`

## Lưu ý

- Đảm bảo máy chủ gRPC đang chạy trước khi mở ứng dụng
- Kiểm tra tường lửa (firewall) cho phép kết nối đến các cổng
- Nếu gặp lỗi kết nối, kiểm tra lại địa chỉ IP trong file `.env`

---

# English Instructions

## Configuration

Before running the application, configure the `.env` file in the `resources` folder:

### Config file location:
```
SproutVR/resources/.env
```

### Settings to change:

Open `.env` file with Notepad and edit these values:

```env
# School Server URL
SCHOOL_URL=http://YOUR_SERVER_IP:PORT

# gRPC Server URL
GRPC_SERVER_URL=YOUR_SERVER_IP:PORT
```

## Running the Application

1. Configure the `.env` file as instructed above
2. Run `SproutVR.exe`

## Notes

- Ensure the gRPC server is running before opening the application
- Check that firewall allows connections to ports 
- If connection errors occur, verify the IP address in `.env` file
