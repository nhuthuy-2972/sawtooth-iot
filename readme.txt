
yêu cầu :
- Cài đặt Postgresql và extension TimescaleDB
- Tạo database va bảng metrics 

 CREATE TABLE metrics(
     time TIMESTAMPTZ,
     device_id TEXT NOT NULL,
     data JSONB,
     PRIMARY KEY(time, device_id)
 );
 SELECT create_hypertable('metrics', 'time');
 CREATE INDEX idxgin ON metrics USING GIN(data);

Về người dung và quản li thiết bị  sử dụng firebase

- Tạo một project firebase thay đổi các trường trong file use-auth.ts

- set rules cho firebase như sau :

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /devices/{devicesId} {
      allow read: if request.auth.uid == resource.data.auth;
      allow write: if request.auth.uid != null;
    }
  }
} 

- Thêm người dùng sủ dụng tài khoản mail 