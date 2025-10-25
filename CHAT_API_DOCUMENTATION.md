# 🤖 AI Chat API Dokümantasyonu

AI destekli kişiselleştirilmiş eğitim mentörlük sistemi.

## 🔗 Base URL
```
http://localhost:3000
```

## 🔐 Authentication
Tüm endpoint'ler **session-based authentication** gerektirir.

```javascript
fetch('http://localhost:3000/chat/...', {
  credentials: 'include', // ÖNEMLİ: Session cookie'si için!
  headers: {
    'Content-Type': 'application/json'
  }
})
```

---

## 📋 Endpoints

### 1. Yeni Chat Oturumu Başlat

**POST** `/chat/sessions`

Yeni bir chat oturumu oluşturur.

**Request Body (Optional):**
```json
{
  "title": "Matematik Çalışma Planı"
}
```

**Success Response (201):**
```json
{
  "status": true,
  "message": "Chat oturumu oluşturuldu",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "title": "Matematik Çalışma Planı",
    "isActive": true,
    "createdAt": "2024-01-15T14:00:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  }
}
```

---

### 2. Tüm Chat Oturumlarını Listele

**GET** `/chat/sessions`

Kullanıcının tüm aktif chat oturumlarını getirir (en son güncellenen üstte).

**Success Response (200):**
```json
{
  "status": true,
  "message": "Chat oturumları getirildi",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "title": "Matematik Çalışma Planı",
      "isActive": true,
      "createdAt": "2024-01-15T14:00:00.000Z",
      "updatedAt": "2024-01-15T14:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "İngilizce Kelime Teknikleri",
      "isActive": true,
      "createdAt": "2024-01-14T10:00:00.000Z",
      "updatedAt": "2024-01-14T11:00:00.000Z"
    }
  ]
}
```

---

### 3. Chat Oturumundaki Mesajları Getir

**GET** `/chat/sessions/:id`

Belirli bir chat oturumundaki tüm mesajları kronolojik sırayla getirir.

**Path Parameters:**
- `id`: ChatSession ID

**Success Response (200):**
```json
{
  "status": true,
  "message": "Mesajlar getirildi",
  "data": [
    {
      "_id": "msg001",
      "sessionId": "507f1f77bcf86cd799439011",
      "role": "user",
      "content": "Matematik sınavına nasıl hazırlanmalıyım?",
      "createdAt": "2024-01-15T14:05:00.000Z"
    },
    {
      "_id": "msg002",
      "sessionId": "507f1f77bcf86cd799439011",
      "role": "assistant",
      "content": "Merhaba! Profilinize göre (Lisans seviyesi) size özel bir plan hazırladım...",
      "createdAt": "2024-01-15T14:05:05.000Z"
    },
    {
      "_id": "msg003",
      "sessionId": "507f1f77bcf86cd799439011",
      "role": "user",
      "content": "Günde kaç saat çalışmalıyım?",
      "createdAt": "2024-01-15T14:06:00.000Z"
    },
    {
      "_id": "msg004",
      "sessionId": "507f1f77bcf86cd799439011",
      "role": "assistant",
      "content": "Haftada 15 saat müsait zamanınız var, günlük 2-3 saat idealdir...",
      "createdAt": "2024-01-15T14:06:05.000Z"
    }
  ]
}
```

---

### 4. AI'a Mesaj Gönder ⭐ (Ana Endpoint)

**POST** `/chat/sessions/:id/messages`

AI'a mesaj gönderir ve kişiselleştirilmiş cevap alır.

**Path Parameters:**
- `id`: ChatSession ID

**Request Body:**
```json
{
  "message": "İngilizce kelime ezberlemek için hangi yöntemi önerirsin?"
}
```

**Validation:**
- `message`: String, 1-5000 karakter arası, boş olamaz

**Success Response (200):**
```json
{
  "status": true,
  "message": "Mesaj gönderildi",
  "data": {
    "userMessage": {
      "_id": "msg005",
      "sessionId": "507f1f77bcf86cd799439011",
      "role": "user",
      "content": "İngilizce kelime ezberlemek için hangi yöntemi önerirsin?",
      "createdAt": "2024-01-15T14:10:00.000Z"
    },
    "assistantMessage": {
      "_id": "msg006",
      "sessionId": "507f1f77bcf86cd799439011",
      "role": "assistant",
      "content": "Profilinize göre size uygun olacak yöntemler:\n\n1. Spaced Repetition (Aralıklı Tekrar): Eğitim seviyeniz için ideal...\n2. Context-based Learning: İlgi alanlarınıza (Programlama) uygun metinlerden...\n3. Günlük 20-30 kelime hedefi: 15 saat/hafta programınıza uygun...",
      "createdAt": "2024-01-15T14:10:08.000Z"
    }
  }
}
```

**🎯 Önemli:** Bu endpoint otomatik olarak kullanıcının profil bilgilerini (UserInfo) AI'a context olarak gönderir. AI, kullanıcının:
- Eğitim seviyesi
- Kariyer hedefleri
- İlgi alanları
- Güçlü/zayıf yönleri
- Çalışma zamanı

bilgilerine göre **kişiselleştirilmiş** cevaplar verir.

---

### 5. Chat Başlığını Güncelle

**PATCH** `/chat/sessions/:id`

Chat oturumunun başlığını değiştirir.

**Path Parameters:**
- `id`: ChatSession ID

**Request Body:**
```json
{
  "title": "Algoritma Çalışma Stratejileri"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Chat oturumu güncellendi",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Algoritma Çalışma Stratejileri",
    "isActive": true,
    "createdAt": "2024-01-15T14:00:00.000Z",
    "updatedAt": "2024-01-15T14:15:00.000Z"
  }
}
```

---

### 6. Chat Oturumunu Sil

**DELETE** `/chat/sessions/:id`

Chat oturumunu ve içindeki tüm mesajları siler (soft delete).

**Path Parameters:**
- `id`: ChatSession ID

**Success Response (200):**
```json
{
  "status": true,
  "message": "Chat oturumu silindi",
  "data": {
    "deleted": true
  }
}
```

---

## 🔄 Tipik Kullanım Akışı

### Senaryo 1: Yeni Sohbet Başlatma

```javascript
// 1. Yeni chat oturumu oluştur
const sessionRes = await fetch('http://localhost:3000/chat/sessions', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: "Yeni Sohbet" })
});
const { data: session } = await sessionRes.json();
const sessionId = session._id;

// 2. AI'a ilk soruyu sor
const messageRes = await fetch(`http://localhost:3000/chat/sessions/${sessionId}/messages`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: "Merhaba! Programlama öğrenmek için nereden başlamalıyım?" 
  })
});
const { data: messages } = await messageRes.json();

// 3. Her iki mesajı da ekrana yazdır
console.log('Sen:', messages.userMessage.content);
console.log('AI:', messages.assistantMessage.content);
```

---

### Senaryo 2: Devam Eden Sohbet

```javascript
// 1. Tüm chat'leri listele
const sessionsRes = await fetch('http://localhost:3000/chat/sessions', {
  credentials: 'include'
});
const { data: sessions } = await sessionsRes.json();

// 2. İlk chat'i seç
const sessionId = sessions[0]._id;

// 3. Geçmiş mesajları getir
const historyRes = await fetch(`http://localhost:3000/chat/sessions/${sessionId}`, {
  credentials: 'include'
});
const { data: history } = await historyRes.json();

// 4. Mesajları göster
history.forEach(msg => {
  console.log(`${msg.role === 'user' ? 'Sen' : 'AI'}: ${msg.content}`);
});

// 5. Yeni mesaj gönder
const newMsgRes = await fetch(`http://localhost:3000/chat/sessions/${sessionId}/messages`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: "Peki hangi programlama dilini önerirsin?" })
});
```

---

## 💻 React Örnek Kod

### Chat Component

```typescript
import { useState, useEffect } from 'react';

interface Message {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

const ChatComponent = ({ sessionId }: { sessionId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Geçmiş mesajları yükle
  useEffect(() => {
    loadHistory();
  }, [sessionId]);

  const loadHistory = async () => {
    const res = await fetch(`http://localhost:3000/chat/sessions/${sessionId}`, {
      credentials: 'include'
    });
    const data = await res.json();
    if (data.status) {
      setMessages(data.data);
    }
  };

  // Mesaj gönder
  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/chat/sessions/${sessionId}/messages`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input })
        }
      );

      const data = await res.json();
      if (data.status) {
        // Her iki mesajı da listeye ekle
        setMessages(prev => [...prev, data.data.userMessage, data.data.assistantMessage]);
        setInput('');
      }
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Mesaj Listesi */}
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg._id} className={`message ${msg.role}`}>
            <div className="avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="content">{msg.content}</div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Mesajınızı yazın..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </div>
    </div>
  );
};
```

---

### Chat List Component

```typescript
import { useState, useEffect } from 'react';

interface ChatSession {
  _id: string;
  title: string;
  updatedAt: string;
}

const ChatList = ({ onSelectChat }: { onSelectChat: (id: string) => void }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const res = await fetch('http://localhost:3000/chat/sessions', {
      credentials: 'include'
    });
    const data = await res.json();
    if (data.status) {
      setSessions(data.data);
    }
  };

  const createNewChat = async () => {
    const res = await fetch('http://localhost:3000/chat/sessions', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Yeni Sohbet' })
    });
    const data = await res.json();
    if (data.status) {
      setSessions([data.data, ...sessions]);
      onSelectChat(data.data._id);
    }
  };

  const deleteChat = async (id: string) => {
    if (!confirm('Bu sohbeti silmek istediğinizden emin misiniz?')) return;
    
    const res = await fetch(`http://localhost:3000/chat/sessions/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (res.ok) {
      setSessions(sessions.filter(s => s._id !== id));
    }
  };

  return (
    <div className="chat-list">
      <button onClick={createNewChat}>➕ Yeni Sohbet</button>
      
      <div className="sessions">
        {sessions.map((session) => (
          <div key={session._id} className="session-item">
            <div onClick={() => onSelectChat(session._id)}>
              <h3>{session.title}</h3>
              <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
            </div>
            <button onClick={() => deleteChat(session._id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## ⚠️ Error Handling

### Common Errors

**401 Unauthorized:**
```json
{
  "status": false,
  "message": "Lütfen giriş yapın",
  "data": {
    "errorType": "Authentication Error"
  }
}
```
→ Kullanıcı giriş yapmamış. Login endpoint'ine yönlendir.

**403 Forbidden:**
```json
{
  "status": false,
  "message": "Bu chat oturumuna erişim yetkiniz yok",
  "data": {
    "errorType": "Authorization Error"
  }
}
```
→ Chat başka kullanıcıya ait.

**404 Not Found:**
```json
{
  "status": false,
  "message": "Chat oturumu bulunamadı",
  "data": {
    "errorType": "Not Found"
  }
}
```
→ Session ID geçersiz veya silinmiş.

**400 Bad Request:**
```json
{
  "status": false,
  "message": "Validation Error",
  "data": {
    "errorType": "Validation Error",
    "details": "[{\"path\":[\"message\"],\"message\":\"Mesaj boş olamaz\"}]"
  }
}
```
→ Mesaj boş veya çok uzun.

---

## 🎯 AI Kişiselleştirme

AI, her mesajda otomatik olarak kullanıcının profil bilgilerini context olarak alır:

**Backend'de oluşturulan context örneği:**
```
Kullanıcı Profili:
- Cinsiyet: Erkek
- Eğitim Seviyesi: Lisans
- Kariyer Hedefi: Yazılım Geliştirici
- Mevcut Durum: Üniversite 3. sınıf öğrencisi
- İlgi Alanları: Programlama, Matematik, AI
- Geliştirilmesi Gereken Konular: Algoritma
- Güçlü Yönler: Problem Çözme, Mantıksal Düşünme
- Öğrenme Hedefleri: Backend geliştirme öğrenmek
- Müsait Çalışma Zamanı: Haftada 15 saat

Bu kullanıcı profili bilgilerine göre, aşağıdaki soruya 
kişiselleştirilmiş, yardımcı ve motive edici bir cevap ver.

Kullanıcı Sorusu: [User'ın mesajı]
```

Bu sayede AI:
- ✅ Eğitim seviyesine uygun dil kullanır
- ✅ Kariyer hedeflerine yönelik önerilerde bulunur
- ✅ İlgi alanlarına göre örnekler verir
- ✅ Zayıf yönlerini geliştirmeye odaklanır
- ✅ Çalışma zamanına uygun planlar sunar

---

## 🔧 Frontend Checklist

Geliştirmeye başlamadan önce:

- [ ] Backend'in çalıştığını kontrol et
- [ ] Login olduğundan emin ol (`GET /auth/check`)
- [ ] Tüm isteklerde `credentials: 'include'` kullan
- [ ] CORS hatası alırsan FRONTEND_URL'i kontrol et
- [ ] Session cookie'si browser'da var mı kontrol et
- [ ] UserInfo profili oluşturulmuş mu kontrol et (daha iyi AI cevapları için)

---

## 💡 Best Practices

1. **Session Management:**
   - Yeni chat başlatırken session ID'yi sakla
   - Component unmount olduğunda session ID'yi temizle

2. **Loading States:**
   - Mesaj gönderirken loading göster
   - AI cevabı gelene kadar input'u disable et

3. **Error Handling:**
   - Network hatalarını yakala
   - Kullanıcıya anlamlı hata mesajları göster

4. **UX:**
   - Mesajlar otomatik olarak en alta scroll olsun
   - Uzun AI cevaplarını formatla (markdown support)
   - Timestamp'leri human-readable formatla

5. **Performance:**
   - Mesaj listesini virtual scroll ile optimize et
   - Chat listesini localStorage'da cache'le

---

## 📞 Support

**Health Check:**
```
GET http://localhost:3000/health
```

**Test için örnek soru:**
```json
{
  "message": "Merhaba! Bana kendini tanıt ve bana nasıl yardımcı olabilirsin?"
}
```

---

**Son Güncelleme:** 2024-01-15  
**Backend Framework:** Express.js + TypeScript + Gemini AI  
**AI Model:** Google Gemini Pro

