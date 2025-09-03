# Phishing Detector

Ứng dụng web mô phỏng phát hiện phishing bằng trí tuệ nhân tạo (AI) được phát triển cho bài tập lớn (BTL) môn Bảo Mật Ứng dụng.

## Hướng dẫn cài đặt

### 1. Cài đặt Python/Flask

- Yêu cầu: Cài đặt Python 3.x.
- Kiểm tra phiên bản Python:
  ```bash
  python3 --version
  ```
- Cài đặt các thư viện cần thiết:
  ```bash
  pip install -r requirements.txt
  ```
- Khởi động API Flask:
  ```bash
  cd ai_model
  python predict.py
  ```
  - API sẽ chạy trên `http://localhost:5000`.

### 2. Cài đặt Node.js

- Yêu cầu: Cài đặt Node.js và npm.
- Kiểm tra phiên bản:
  ```bash
  node --version
  npm --version
  ```
- Cài đặt các dependencies:
  ```bash
  cd web
  npm install
  ```
- Khởi động server Node.js:
  ```bash
  node app.js
  ```
  - Server sẽ chạy trên `http://localhost:3000`.

### 3. Truy cập ứng dụng

- Mở trình duyệt và truy cập: `http://localhost:3000`.

## Công nghệ sử dụng

- **Flask**: Xây dựng API để tích hợp và chạy model AI.
- **Node.js/Express**: Làm backend cho ứng dụng web, phục vụ API và file tĩnh.
- **JavaScript**: Tạo giao diện động phía client (không sử dụng HTML tĩnh hoặc EJS).
- **Bootstrap**: Cung cấp giao diện responsive và thân thiện với người dùng.
- **CSS**: Tùy chỉnh giao diện với file `style.css`.

## Cấu trúc dự án

```
phishing-detector/
├── ai_model/                     # Chứa mã nguồn và model AI
│   ├── predict.py                # Script Flask API để dự đoán phishing
│   ├── train.py                  # Script huấn luyện model (tùy chọn)
│   └── saved_model/              # Thư mục lưu trữ model đã huấn luyện
│       └── model.pkl             # File model (dạng scikit-learn hoặc pickle)
├── web/                          # Chứa ứng dụng web Node.js
│   ├── node_modules/             # Thư viện Node.js (tự động tạo)
│   ├── public/                   # Chứa file tĩnh (CSS, JS)
│   │   ├── css/                  # Thư mục CSS
│   │   │   ├── bootstrap.min.css # Framework CSS Bootstrap
│   │   │   └── style.css         # CSS tùy chỉnh
│   │   └── js/                   # Thư mục JavaScript
│   │       ├── index.js          # Logic và giao diện trang chính
│   │       ├── history.js        # Logic và giao diện trang lịch sử
│   │       └── script.js         # File JS bổ sung (tùy chọn)
│   ├── routes/                   # Thư mục chứa các route
│   │   └── index.js              # File xử lý API và routing
│   ├── app.js                    # File chính của ứng dụng Node.js
│   ├── package.json              # Cấu hình dự án Node.js
│   └── package-lock.json         # File khóa dependencies (tự động tạo)
├── data/                         # Thư mục chứa dữ liệu (tùy chọn)
│   ├── phishing_urls.csv         # Dữ liệu URL phishing
│   └── legit_urls.csv            # Dữ liệu URL hợp lệ
├── README.md                     # Tài liệu hướng dẫn dự án
└── requirements.txt              # Danh sách dependencies cho Python/Flask
```

## Mô tả dự án

- Ứng dụng được thiết kế để mô phỏng việc phát hiện các trang web phishing sử dụng AI.
- Model AI được huấn luyện và lưu trong `ai_model/saved_model/`, sau đó tích hợp với API Flask.
- Giao diện web được xây dựng hoàn toàn bằng JavaScript, tạo động trên client-side, với backend Node.js hỗ trợ API.
- Dữ liệu mẫu có thể được lưu trong thư mục `data/` để hỗ trợ quá trình huấn luyện hoặc kiểm thử.

## Hướng dẫn sử dụng

1. Sau khi cài đặt và khởi động cả Flask và Node.js, truy cập `http://localhost:3000`.
2. Nhập URL vào form trên trang chính để kiểm tra xem URL có phải là phishing hay không.
   - Kết quả sẽ hiển thị ngay trên trang, bao gồm trạng thái (Phishing/Hợp lệ) và độ tin cậy.
3. Xem lịch sử kiểm tra tại `http://localhost:3000/history`.

## Hướng dẫn chạy ứng dụng

1. **Chuẩn bị môi trường**:

   - Đảm bảo Python 3.x và Node.js đã được cài đặt (xem bước cài đặt).
   - Mở terminal và di chuyển đến thư mục dự án:
     ```bash
     cd phishing-detector
     ```

2. **Cài đặt dependencies**:

   - Cài đặt cho Python/Flask:
     ```bash
     cd ai_model
     pip install -r requirements.txt
     cd ..
     ```
   - Cài đặt cho Node.js:
     ```bash
     cd web
     npm install
     cd ..
     ```

3. **Chạy các server**:

   - **Chạy Flask API**:
     - Mở một terminal mới:
       ```bash
       cd phishing-detector/ai_model
       python predict.py
       ```
     - Flask sẽ chạy trên `http://localhost:5000`.
   - **Chạy Node.js**:
     - Trong terminal khác:
       ```bash
       cd phishing-detector/web
       node app.js
       ```
     - Node.js sẽ chạy trên `http://localhost:3000`.

4. **Kiểm tra web mô phỏng**:
   - Mở trình duyệt tại `http://localhost:3000`.
   - Nhập URL (ví dụ: `http://fake-login.com`) và nhấn "Kiểm tra".
   - Xem kết quả và lịch sử tại `http://localhost:3000/history`.

## Xử lý lỗi (nếu có)

- **Flask không chạy**:
  - Kiểm tra terminal để xem lỗi (ví dụ: module không tìm thấy). Cài lại:
    ```bash
    pip install -r requirements.txt
    ```
  - Đảm bảo file `model.pkl` tồn tại trong `ai_model/saved_model/`.
- **Node.js không chạy**:
  - Chạy lại `npm install` nếu thiếu module.
  - Kiểm tra kết nối với Flask (`localhost:5000`).
- **Giao diện không hiển thị**:
  - Mở DevTools (F12 trong trình duyệt), kiểm tra tab Console để xem lỗi JavaScript.
  - Đảm bảo Bootstrap và `style.css` được tải (kiểm tra trong `index.js`).

## Mô phỏng thêm (tùy chọn)

- **Thêm delay giả trong `predict.py`**:
  - Thêm `import time` và `time.sleep(2)` trước khi trả kết quả để mô phỏng thời gian xử lý AI.
- **Test với URL giả**:
  - Sử dụng dữ liệu từ `data/phishing_urls.csv` hoặc tạo URL thủ công.

## Lưu ý

- **Chạy đồng thời**: Giữ hai terminal mở (một cho Flask, một cho Node.js).
- **Debug**: Kiểm tra console trình duyệt (F12) nếu gặp lỗi giao diện.
- **Dữ liệu**: Thêm dữ liệu thực tế vào `data/` để cải thiện hiệu suất model nếu cần.

---
