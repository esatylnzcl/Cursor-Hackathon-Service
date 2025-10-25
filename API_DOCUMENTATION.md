# 📚 Eğitim Platformu API Dokümantasyonu

Bu doküman, eğitim platformu backend API'sinin tüm endpoint'lerini, request/response formatlarını ve kullanım örneklerini içerir.

## 🔗 Base URL

```
http://localhost:3000
```

## 🔐 Authentication

API, **session-based authentication** kullanır. Giriş yaptıktan sonra session cookie'si otomatik olarak tarayıcı tarafından gönderilir.

**Önemli:** Tüm isteklerde `credentials: 'include'` kullanmalısınız!

```javascript
fetch("http://localhost:3000/api/endpoint", {
  credentials: "include", // Session cookie'sini gönder
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

## 📋 İçindekiler

1. [Auth Endpoints](#-1-auth-endpoints)
2. [User Info Endpoints](#-2-user-info-endpoints)
3. [Study Preference Endpoints](#-3-study-preference-endpoints)
4. [Appointment Endpoints](#-4-appointment-endpoints)
5. [Response Format](#-response-format)
6. [Error Handling](#-error-handling)
7. [Kullanım Akışları](#-kullanım-akışları)

---

## 🔑 1. Auth Endpoints

### 1.1 Register (Kayıt Ol)

Yeni kullanıcı kaydı oluşturur.

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "password": "123456"
}
```

**Validation Rules:**

- `firstName`: Min 2 karakter
- `lastName`: Min 2 karakter
- `email`: Geçerli email formatı
- `password`: Min 6 karakter

**Success Response (201):**

```json
{
  "status": true,
  "message": "Kullanıcı başarıyla oluşturuldu",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com",
    "isDeleted": false,
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "status": false,
  "message": "Validation Error",
  "data": {
    "errorType": "Validation Error",
    "details": "[{\"path\":[\"email\"],\"message\":\"Geçerli bir email adresi giriniz\"}]"
  }
}
```

---

### 1.2 Login (Giriş Yap)

Kullanıcı girişi yapar ve session oluşturur.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "ahmet@example.com",
  "password": "123456"
}
```

**Success Response (200):**

```json
{
  "status": true,
  "message": "Giriş başarılı",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com",
    "isDeleted": false,
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "status": false,
  "message": "Email ile eşleşen hesap bulunamadı!",
  "data": {
    "errorType": "Not Found (No Content)"
  }
}
```

**Error Response (400):**

```json
{
  "status": false,
  "message": "Lütfen doğru şifreyi girdiğinize emin olun.",
  "data": {
    "errorType": "Credentials Error"
  }
}
```

---

### 1.3 Logout (Çıkış Yap)

Kullanıcı çıkışı yapar ve session'ı sonlandırır.

**Endpoint:** `DELETE /auth/logout`

**Authentication:** Required ✅

**Success Response (200):**

```json
{
  "status": true,
  "message": "Çıkış başarılı",
  "data": null
}
```

---

### 1.4 Check Session (Oturum Kontrolü)

Kullanıcının giriş yapıp yapmadığını kontrol eder.

**Endpoint:** `GET /auth/check`

**Success Response - Logged In (200):**

```json
{
  "status": true,
  "message": "Oturum aktif",
  "data": {
    "isAuthenticated": true,
    "userId": "507f1f77bcf86cd799439011",
    "email": "ahmet@example.com"
  }
}
```

**Success Response - Not Logged In (200):**

```json
{
  "status": true,
  "message": "Oturum bulunamadı",
  "data": {
    "isAuthenticated": false
  }
}
```

---

## 👤 2. User Info Endpoints

Kullanıcı profil bilgileri - AI'a gönderilmek üzere.

### 2.1 Get User Info (Profil Bilgilerini Al)

**Endpoint:** `GET /user-info`

**Authentication:** Required ✅

**Success Response (200):**

```json
{
  "status": true,
  "message": "Kullanıcı profili başarıyla getirildi",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "gender": "male",
    "educationLevel": "undergraduate",
    "careerGoal": "Yazılım Geliştirici",
    "currentStatus": "Üniversite 3. sınıf öğrencisi",
    "interests": ["Programlama", "Matematik", "AI"],
    "weaknesses": ["Algoritma"],
    "strengths": ["Problem Çözme", "Mantıksal Düşünme"],
    "learningGoals": "Backend geliştirme ve mikroservis mimarileri öğrenmek",
    "availableStudyTime": "Haftada 15 saat",
    "preferredLanguage": "tr",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### 2.2 Create User Info (Profil Oluştur)

**Endpoint:** `POST /user-info`

**Authentication:** Required ✅

**Request Body:**

```json
{
  "gender": "male",
  "educationLevel": "undergraduate",
  "careerGoal": "Yazılım Geliştirici",
  "currentStatus": "Üniversite 3. sınıf öğrencisi",
  "interests": ["Programlama", "Matematik"],
  "weaknesses": ["Algoritma"],
  "strengths": ["Problem Çözme"],
  "learningGoals": "Backend geliştirme öğrenmek",
  "availableStudyTime": "Haftada 15 saat",
  "preferredLanguage": "tr"
}
```

**Enum Values:**

- **gender:** `"male"`, `"female"`
- **educationLevel:** `"primary_school"`, `"middle_school"`, `"high_school"`, `"undergraduate"`, `"graduate"`, `"doctorate"`, `"other"`

**Success Response (201):**

```json
{
  "status": true,
  "message": "Kullanıcı profili başarıyla oluşturuldu",
  "data": {
    /* Profil bilgileri */
  }
}
```

---

### 2.3 Update User Info (Profil Güncelle)

**Endpoint:** `PATCH /user-info`

**Authentication:** Required ✅

**Request Body:** (Partial - sadece güncellemek istediğiniz alanları gönderin)

```json
{
  "careerGoal": "Full Stack Developer",
  "interests": ["React", "Node.js", "TypeScript"]
}
```

**Success Response (200):**

```json
{
  "status": true,
  "message": "Kullanıcı profili başarıyla güncellendi",
  "data": {
    /* Güncellenmiş profil */
  }
}
```

---

### 2.4 Delete User Info (Profil Sil)

**Endpoint:** `DELETE /user-info`

**Authentication:** Required ✅

**Success Response (200):**

```json
{
  "status": true,
  "message": "Kullanıcı profili silindi",
  "data": {
    "deleted": true
  }
}
```

---

### 2.5 Get AI Prompt (AI İçin Profil Metni)

Kullanıcı profilini AI'a göndermek için formatlanmış metin halinde döner.

**Endpoint:** `GET /user-info/ai-prompt`

**Authentication:** Required ✅

**Success Response (200):**

```json
{
  "status": true,
  "message": "AI prompt başarıyla oluşturuldu",
  "data": {
    "prompt": "Kullanıcı Profili:\n- Cinsiyet: Erkek\n- Eğitim Seviyesi: Lisans\n- Kariyer Hedefi: Yazılım Geliştirici\n- Mevcut Durum: Üniversite 3. sınıf öğrencisi\n- İlgi Alanları: Programlama, Matematik, AI\n- Geliştirilmesi Gereken Konular: Algoritma\n- Güçlü Yönler: Problem Çözme, Mantıksal Düşünme\n- Öğrenme Hedefleri: Backend geliştirme ve mikroservis mimarileri öğrenmek\n- Müsait Çalışma Zamanı: Haftada 15 saat"
  }
}
```

---

## 📚 3. Study Preference Endpoints

Çalışma tercihleri ve eşleşme sistemi.

### 3.1 Get My Preferences (Tercihlerimi Al)

**Endpoint:** `GET /study-preference`

**Authentication:** Required ✅

**Success Response (200):**

```json
{
  "status": true,
  "message": "Tercihler getirildi",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "techniqueId": "pomodoro",
    "studyArea": "İngilizce",
    "educationLevel": "undergraduate",
    "isActive": true,
    "maxParticipants": 2,
    "preferredDays": ["monday", "wednesday", "friday"],
    "preferredTimeSlots": ["14:00-17:00", "19:00-21:00"],
    "createdAt": "2024-01-15T10:40:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

---

### 3.2 Create Preferences (Tercih Oluştur)

**Endpoint:** `POST /study-preference`

**Authentication:** Required ✅

**Request Body:**

```json
{
  "techniqueId": "pomodoro",
  "studyArea": "İngilizce",
  "educationLevel": "undergraduate",
  "isActive": true,
  "maxParticipants": 2,
  "preferredDays": ["monday", "wednesday"],
  "preferredTimeSlots": ["14:00-17:00"]
}
```

**Required Fields:**

- `techniqueId`: string (örn: "pomodoro", "spaced_repetition", "feynman")
- `studyArea`: string (örn: "İngilizce", "Matematik", "Programlama")
- `educationLevel`: enum

**Optional Fields:**

- `isActive`: boolean (default: true)
- `maxParticipants`: number (default: 2)
- `preferredDays`: string[] (örn: ["monday", "tuesday"])
- `preferredTimeSlots`: string[] (örn: ["09:00-12:00"])

**Success Response (201):**

```json
{
  "status": true,
  "message": "Tercihler oluşturuldu",
  "data": {
    /* Tercih bilgileri */
  }
}
```

---

### 3.3 Update Preferences (Tercih Güncelle)

**Endpoint:** `PATCH /study-preference`

**Authentication:** Required ✅

**Request Body:** (Partial)

```json
{
  "studyArea": "Matematik",
  "isActive": false
}
```

**Success Response (200):**

```json
{
  "status": true,
  "message": "Tercihler güncellendi",
  "data": {
    /* Güncellenmiş tercih */
  }
}
```

---

### 3.4 Delete Preferences (Tercih Sil)

**Endpoint:** `DELETE /study-preference`

**Authentication:** Required ✅

**Success Response (200):**

```json
{
  "status": true,
  "message": "Tercihler silindi",
  "data": {
    "deleted": true
  }
}
```

---

### 3.5 Find Matches (Eşleşmeleri Bul) 🎯

Aynı technique, studyArea ve educationLevel'a sahip kullanıcıları bulur.

**Endpoint:** `GET /study-preference/matches`

**Authentication:** Required ✅

**Success Response (200):**

```json
{
  "status": true,
  "message": "3 eşleşme bulundu",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": {
        "_id": "507f1f77bcf86cd799439015",
        "firstName": "Mehmet",
        "lastName": "Demir",
        "email": "mehmet@example.com"
      },
      "techniqueId": "pomodoro",
      "studyArea": "İngilizce",
      "educationLevel": "undergraduate",
      "isActive": true,
      "maxParticipants": 2,
      "preferredDays": ["tuesday", "thursday"],
      "preferredTimeSlots": ["10:00-13:00"]
    },
    {
      "_id": "507f1f77bcf86cd799439016",
      "userId": {
        "_id": "507f1f77bcf86cd799439017",
        "firstName": "Ayşe",
        "lastName": "Kaya",
        "email": "ayse@example.com"
      },
      "techniqueId": "pomodoro",
      "studyArea": "İngilizce",
      "educationLevel": "undergraduate",
      "isActive": true
    }
  ]
}
```

---

## 📅 4. Appointment Endpoints

Randevu talep ve yönetim sistemi.

### 4.1 Create Appointment (Randevu Talebi Oluştur)

**Endpoint:** `POST /appointments`

**Authentication:** Required ✅

**Request Body:**

```json
{
  "to": "507f1f77bcf86cd799439015",
  "when": "2024-01-20T14:00:00Z",
  "studyArea": "İngilizce",
  "techniqueId": "pomodoro",
  "duration": 90,
  "notes": "İngilizce gramer ve kelime çalışması yapacağız",
  "meetingLink": "https://zoom.us/j/123456789"
}
```

**Required Fields:**

- `to`: string (User ID)
- `when`: string (ISO 8601 datetime)

**Optional Fields:**

- `studyArea`: string
- `techniqueId`: string
- `duration`: number (dakika)
- `notes`: string
- `meetingLink`: string (URL)

**Success Response (201):**

```json
{
  "status": true,
  "message": "Randevu talebi oluşturuldu",
  "data": {
    "_id": "507f1f77bcf86cd799439018",
    "from": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "Ahmet",
      "lastName": "Yılmaz",
      "email": "ahmet@example.com"
    },
    "to": {
      "_id": "507f1f77bcf86cd799439015",
      "firstName": "Mehmet",
      "lastName": "Demir",
      "email": "mehmet@example.com"
    },
    "when": "2024-01-20T14:00:00.000Z",
    "status": "pending",
    "studyArea": "İngilizce",
    "techniqueId": "pomodoro",
    "duration": 90,
    "notes": "İngilizce gramer ve kelime çalışması yapacağız",
    "meetingLink": "https://zoom.us/j/123456789",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 4.2 Update Appointment Status (Randevu Durumunu Güncelle)

Randevu talebini kabul et, reddet veya iptal et.

**Endpoint:** `PATCH /appointments/:id/status`

**Authentication:** Required ✅

**Request Body:**

```json
{
  "status": "accepted"
}
```

**Status Values:**

- `"accepted"` - Kabul edildi (sadece alıcı yapabilir)
- `"rejected"` - Reddedildi (sadece alıcı yapabilir)
- `"cancelled"` - İptal edildi (her iki taraf yapabilir)
- `"completed"` - Tamamlandı

**Success Response (200):**

```json
{
  "status": true,
  "message": "Randevu durumu güncellendi",
  "data": {
    "_id": "507f1f77bcf86cd799439018",
    "from": {
      /* User bilgileri */
    },
    "to": {
      /* User bilgileri */
    },
    "when": "2024-01-20T14:00:00.000Z",
    "status": "accepted"
    /* ... diğer alanlar */
  }
}
```

---

### 4.3 Get My Appointments (Tüm Randevularım)

**Endpoint:** `GET /appointments`

**Authentication:** Required ✅

**Success Response (200):**

```json
{
  "status": true,
  "message": "Randevular getirildi",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "from": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "Ahmet",
        "lastName": "Yılmaz",
        "email": "ahmet@example.com"
      },
      "to": {
        "_id": "507f1f77bcf86cd799439015",
        "firstName": "Mehmet",
        "lastName": "Demir",
        "email": "mehmet@example.com"
      },
      "when": "2024-01-20T14:00:00.000Z",
      "status": "accepted",
      "studyArea": "İngilizce",
      "duration": 90
    }
  ]
}
```

---

### 4.4 Get Incoming Requests (Gelen Talepler)

Bana gelen bekleyen randevu talepleri.

**Endpoint:** `GET /appointments/incoming`

**Authentication:** Required ✅

**Success Response (200):**

```json
{
  "status": true,
  "message": "Gelen talepler getirildi",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439019",
      "from": {
        "_id": "507f1f77bcf86cd799439020",
        "firstName": "Zeynep",
        "lastName": "Şahin",
        "email": "zeynep@example.com"
      },
      "to": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "Ahmet",
        "lastName": "Yılmaz",
        "email": "ahmet@example.com"
      },
      "when": "2024-01-22T10:00:00.000Z",
      "status": "pending",
      "studyArea": "Matematik"
    }
  ]
}
```

---

### 4.5 Get Outgoing Requests (Giden Talepler)

Benim gönderdiğim bekleyen randevu talepleri.

**Endpoint:** `GET /appointments/outgoing`

**Authentication:** Required ✅

**Success Response (200):**

```json
{
  "status": true,
  "message": "Giden talepler getirildi",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "from": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "Ahmet",
        "lastName": "Yılmaz",
        "email": "ahmet@example.com"
      },
      "to": {
        "_id": "507f1f77bcf86cd799439015",
        "firstName": "Mehmet",
        "lastName": "Demir",
        "email": "mehmet@example.com"
      },
      "when": "2024-01-20T14:00:00.000Z",
      "status": "pending"
    }
  ]
}
```

---

### 4.6 Cancel Appointment (Randevuyu İptal Et)

**Endpoint:** `DELETE /appointments/:id`

**Authentication:** Required ✅

**Success Response (200):**

```json
{
  "status": true,
  "message": "Randevu iptal edildi",
  "data": {
    "cancelled": true
  }
}
```

---

## 📦 Response Format

Tüm API response'ları aşağıdaki formatta döner:

### Success Response

```json
{
  "status": true,
  "message": "İşlem başarılı mesajı",
  "data": {
    /* İlgili veri */
  }
}
```

### Error Response

```json
{
  "status": false,
  "message": "Hata mesajı",
  "data": {
    "errorType": "Hata Tipi",
    "details": "Ek detaylar (sadece development modunda)"
  }
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Anlamı       | Örnek             |
| ---- | ------------ | ----------------- |
| 200  | Success      | İşlem başarılı    |
| 201  | Created      | Kayıt oluşturuldu |
| 400  | Bad Request  | Validation hatası |
| 401  | Unauthorized | Giriş yapılmamış  |
| 403  | Forbidden    | Yetki yok         |
| 404  | Not Found    | Kayıt bulunamadı  |
| 409  | Conflict     | Duplicate kayıt   |
| 500  | Server Error | Sunucu hatası     |

### Error Types

- **Validation Error:** Gönderilen veri formatı hatalı
- **Authentication Error:** Kullanıcı giriş yapmamış
- **Authorization Error:** Kullanıcının yetkisi yok
- **Not Found:** Aranan kayıt bulunamadı
- **Duplication Error:** Aynı kayıt zaten mevcut
- **Credentials Error:** Email/şifre hatalı

---

## 🔄 Kullanım Akışları

### Flow 1: Kullanıcı Kaydı ve Profil Oluşturma

```javascript
// 1. Kayıt ol
POST /auth/register
{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "password": "123456"
}

// 2. Giriş yap
POST /auth/login
{
  "email": "ahmet@example.com",
  "password": "123456"
}

// 3. Profil oluştur
POST /user-info
{
  "gender": "male",
  "educationLevel": "undergraduate",
  "careerGoal": "Yazılım Geliştirici",
  "currentStatus": "Üniversite 3. sınıf",
  "interests": ["Programlama", "AI"]
}
```

### Flow 2: Çalışma Arkadaşı Bulma

```javascript
// 1. Çalışma tercihlerini oluştur
POST /study-preference
{
  "techniqueId": "pomodoro",
  "studyArea": "İngilizce",
  "educationLevel": "undergraduate"
}

// 2. Eşleşmeleri bul
GET /study-preference/matches
// Response: Benzer tercihlere sahip kullanıcılar

// 3. Birine randevu talebi gönder
POST /appointments
{
  "to": "MATCHED_USER_ID",
  "when": "2024-01-20T14:00:00Z",
  "studyArea": "İngilizce"
}
```

### Flow 3: Randevu Yönetimi

```javascript
// 1. Gelen talepleri kontrol et
GET /appointments/incoming

// 2. Talebi kabul et
PATCH /appointments/:id/status
{
  "status": "accepted"
}

// 3. Tüm randevularını gör
GET /appointments
```

### Flow 4: AI'a Profil Gönderme

```javascript
// 1. AI prompt'unu al
GET / user - info / ai - prompt;

// 2. Response'daki prompt'u AI'a gönder
const response = await fetch("http://localhost:3000/user-info/ai-prompt", {
  credentials: "include",
});
const { data } = await response.json();

// 3. data.prompt'u AI API'sine context olarak ekle
const aiResponse = await fetch("AI_API_URL", {
  method: "POST",
  body: JSON.stringify({
    prompt: `${data.prompt}\n\nKullanıcı Sorusu: ${userQuestion}`,
  }),
});
```

---

## 💻 Frontend Kod Örnekleri

### React/TypeScript ile Authentication

```typescript
// Login Component
const login = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      credentials: "include", // Önemli!
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.status) {
      console.log("Giriş başarılı:", data.data);
      // Kullanıcıyı ana sayfaya yönlendir
    } else {
      console.error("Hata:", data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};
```

### Session Check Hook

```typescript
// useAuth.ts
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/check", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(data.data);
      }
    } catch (error) {
      console.error("Session check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return { isAuthenticated, user, loading, checkSession };
};
```

### Eşleşme Bulma ve Randevu Oluşturma

```typescript
// FindMatches Component
const findAndRequestAppointment = async () => {
  try {
    // 1. Eşleşmeleri bul
    const matchesRes = await fetch(
      "http://localhost:3000/study-preference/matches",
      {
        credentials: "include",
      }
    );
    const matchesData = await matchesRes.json();

    if (matchesData.status && matchesData.data.length > 0) {
      const firstMatch = matchesData.data[0];

      // 2. İlk eşleşmeye randevu talebi gönder
      const appointmentRes = await fetch("http://localhost:3000/appointments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: firstMatch.userId._id,
          when: new Date("2024-01-20T14:00:00Z").toISOString(),
          studyArea: firstMatch.studyArea,
          techniqueId: firstMatch.techniqueId,
          duration: 90,
          notes: "Birlikte çalışalım!",
        }),
      });

      const appointmentData = await appointmentRes.json();
      console.log("Randevu talebi gönderildi:", appointmentData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## 🧪 Test için Örnek Kullanıcılar

Geliştirme sırasında test için örnek kullanıcılar oluşturabilirsiniz:

```bash
# 1. Kullanıcı
POST /auth/register
{
  "firstName": "Test",
  "lastName": "User1",
  "email": "test1@example.com",
  "password": "123456"
}

# 2. Kullanıcı
POST /auth/register
{
  "firstName": "Test",
  "lastName": "User2",
  "email": "test2@example.com",
  "password": "123456"
}
```

---

## 🔧 Environment Setup

Backend'in `.env` dosyasında aşağıdaki ayarlar yapılmalı:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cursor-hackathon
SESSION_SECRET=your-super-secret-session-key-min-16-chars-required
FRONTEND_URL=http://localhost:5173
EMAIL_USER=test@example.com
EMAIL_PASSWORD=test-password
BACKEND_PATH=/
```

**Önemli:** `FRONTEND_URL`'i kendi frontend port'unuza göre ayarlayın!

---

## 📞 Destek

Herhangi bir sorun veya soru için backend developer ile iletişime geçin.

**Health Check Endpoint:**

```
GET http://localhost:3000/health
```

Response:

```json
{
  "status": true,
  "message": "API is running!",
  "environment": "development",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

---

## 🚀 Hızlı Başlangıç Checklist

Frontend geliştirmeye başlamadan önce:

- [ ] Backend'in çalıştığını kontrol et (`GET /health`)
- [ ] MongoDB'nin çalıştığını doğrula
- [ ] `.env` dosyasında `FRONTEND_URL`'i ayarla
- [ ] Tüm isteklerde `credentials: 'include'` kullan
- [ ] CORS hatası alırsan backend'deki FRONTEND_URL'i kontrol et
- [ ] Session cookie'si browser'da saklanıyor mu kontrol et (DevTools → Application → Cookies)

---

**Son Güncelleme:** 2024-01-15
**API Version:** 1.0.0
**Backend Framework:** Express.js + TypeScript + MongoDB
