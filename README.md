# Cursor-Hackathon-Service

Modern ve ölçeklenebilir bir TypeScript/Express backend template'i.

## 🏗️ Mimari Yapı

```
src/
├── api/                      # API katmanı (HTTP layer)
│   ├── controllers/         # Request handlers
│   │   └── auth.controller.ts  # Auth controller
│   ├── middlewares/         # Express middlewares
│   │   ├── cors.ts         # CORS yapılandırması
│   │   ├── ErrorHandler.ts # Global error handling
│   │   └── session.ts      # Session yönetimi
│   ├── routes/             # Route tanımlamaları
│   │   ├── index.ts        # Ana route yapılandırması
│   │   └── auth.routes.ts  # Auth routes
│   └── utils/              # API utils
│       └── Validate.ts     # Validation utility
├── logic/                   # Business logic katmanı
│   ├── helpers/            # Yardımcı fonksiyonlar
│   │   ├── hashPassword.ts # Şifre hash'leme
│   │   └── comparePassword.ts # Şifre karşılaştırma
│   ├── models/             # Domain models
│   │   ├── CustomErrors.ts # Özel hata sınıfları
│   │   ├── ErrorResponse.ts # Hata response modeli
│   │   └── SuccessResponse.ts # Başarı response modeli
│   ├── repository/         # Data access layer
│   │   └── user/           # User repository
│   │       ├── IUserRepository.ts # Interface
│   │       ├── user.repository.ts # Implementation
│   │       └── types/      # Repository types
│   ├── service/            # Business services
│   │   └── auth/           # Auth service
│   │       ├── IAuthService.ts # Interface
│   │       └── auth.service.ts # Implementation
│   ├── utils/              # Logic utils
│   │   └── Validate.ts     # Validation utility
│   └── Validators/         # Zod validation schemas
│       └── auth.validator.ts # Auth validation schemas
├── database/               # Database katmanı
│   ├── connection.ts      # MongoDB connection
│   └── model/             # Typegoose models
│       └── User.ts        # User model
└── decorators/            # TypeScript decorators
    └── asynchttphandler.ts # Async error wrapper
```

## 🚀 Özellikler

- ✅ **TypeScript** - Type-safe development
- ✅ **Express.js** - Minimal ve esnek web framework
- ✅ **MongoDB/Mongoose** - NoSQL database
- ✅ **Typegoose** - TypeScript class-based models
- ✅ **Zod** - Schema validation
- ✅ **BCrypt** - Password hashing
- ✅ **Session Management** - express-session + connect-mongo
- ✅ **CORS** - Yapılandırılabilir CORS middleware
- ✅ **Error Handling** - Merkezi error handling sistemi
- ✅ **Custom Error Classes** - Tip-güvenli hata yönetimi
- ✅ **Async Decorator** - HTTP handler'lar için async wrapper
- ✅ **Repository Pattern** - Interface-based data access
- ✅ **Service Pattern** - Business logic separation
- ✅ **Dependency Injection** - Constructor-based DI

## 📦 Kurulum

1. **Dependencies'leri yükleyin:**

```bash
npm install
```

2. **Environment variables'ları ayarlayın:**

```bash
cp .env.example .env
# .env dosyasını düzenleyip kendi değerlerinizi girin
```

3. **Development modunda çalıştırın:**

```bash
npm run dev
```

## 🔧 Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production/test)
- `MONGO_URI` - MongoDB connection string
- `SESSION_SECRET` - Session secret key (min 16 chars)
- `FRONTEND_URL` - Frontend URL for CORS
- `EMAIL_USER` - Email user for notifications
- `EMAIL_PASSWORD` - Email password
- `BACKEND_PATH` - Backend base path

## 🎯 API Endpoints

### Auth Routes

#### POST /auth/register

Yeni kullanıcı kaydı oluşturur.

**Request Body:**

```json
{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "identityNumber": "12345678901",
  "email": "ahmet@example.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "status": true,
  "message": "Kullanıcı başarıyla oluşturuldu",
  "data": {
    "_id": "...",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com"
  }
}
```

#### POST /auth/login

Kullanıcı girişi yapar.

**Request Body:**

```json
{
  "email": "ahmet@example.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "status": true,
  "message": "Giriş başarılı",
  "data": {
    "_id": "...",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com"
  }
}
```

#### DELETE /auth/logout

Kullanıcı çıkışı yapar.

**Response:**

```json
{
  "status": true,
  "message": "Çıkış başarılı"
}
```

#### GET /auth/check

Session kontrolü yapar.

**Response:**

```json
{
  "status": true,
  "message": "Oturum aktif",
  "data": {
    "isAuthenticated": true,
    "userId": "...",
    "email": "ahmet@example.com"
  }
}
```

## 🎯 Kullanım Örnekleri

### Model Oluşturma (Typegoose)

```typescript
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({
  schemaOptions: {
    collection: "product",
    versionKey: false,
    timestamps: true,
  },
})
export class Product {
  public _id!: Types.ObjectId;
  public createdAt!: Date;
  public updatedAt!: Date;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public price!: number;
}

export const ProductModel = getModelForClass(Product);
```

### Repository Pattern

```typescript
// Interface
export interface IProductRepository {
  getAll(): Promise<DocumentType<Product>[]>;
  getById(id: Types.ObjectId): Promise<DocumentType<Product>>;
  create(data: CreateProductArgs): Promise<DocumentType<Product>>;
}

// Implementation
export class ProductRepository implements IProductRepository {
  async getAll(): Promise<DocumentType<Product>[]> {
    return await ProductModel.find();
  }

  async getById(id: Types.ObjectId): Promise<DocumentType<Product>> {
    const product = await ProductModel.findById(id);
    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  async create(data: CreateProductArgs): Promise<DocumentType<Product>> {
    const product = new ProductModel(data);
    await product.save();
    return product;
  }
}
```

### Service Pattern

```typescript
// Interface
export interface IProductService {
  getAllProducts(): Promise<DocumentType<Product>[]>;
  getProductById(id: Types.ObjectId): Promise<DocumentType<Product>>;
}

// Implementation
export class ProductService implements IProductService {
  constructor(private productRepository: IProductRepository) {}

  async getAllProducts(): Promise<DocumentType<Product>[]> {
    return await this.productRepository.getAll();
  }

  async getProductById(id: Types.ObjectId): Promise<DocumentType<Product>> {
    return await this.productRepository.getById(id);
  }
}
```

### Controller Oluşturma

```typescript
import { Request, Response } from "express";
import { ahandler } from "../../decorators/asynchttphandler";
import { ResponseFormat } from "../../logic/models/SuccessResponse";

export class ProductController {
  constructor(private productService: IProductService) {}

  @ahandler
  async getProducts(req: Request, res: Response) {
    const products = await this.productService.getAllProducts();
    res.json(ResponseFormat(products, true, "Ürünler listelendi"));
  }
}
```

### Route Oluşturma (Dependency Injection)

```typescript
import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../../logic/service/product/product.service";
import { ProductRepository } from "../../logic/repository/product/product.repository";

export const productRouter = Router();

// DI Pattern
const repository = new ProductRepository();
const service = new ProductService(repository);
const controller = new ProductController(service);

// Routes
productRouter.get("/", (req, res, next) =>
  controller.getProducts(req, res, next)
);
```

### Validation (Zod)

```typescript
import zod from "zod";
import { Validate } from "../logic/utils/Validate";

const productSchema = zod.object({
  name: zod.string().min(3, "İsim en az 3 karakter olmalı"),
  price: zod.number().positive("Fiyat pozitif olmalı"),
});

// Controller içinde kullanım
const validatedData = Validate(req.body, productSchema);
```

### Custom Error Kullanımı

```typescript
import {
  NotFoundError,
  AuthenticationError,
  CredentialsError,
} from "../logic/models/CustomErrors";

if (!user) {
  throw new NotFoundError("Kullanıcı bulunamadı");
}

if (!isAuthenticated) {
  throw new AuthenticationError("Lütfen giriş yapın");
}

if (!isValidPassword) {
  throw new CredentialsError("Geçersiz şifre");
}
```

## 📝 Scripts

- `npm run dev` - Development mode (ts-node)
- `npm run build` - Build için compile et
- `npm start` - Production mode (compiled JS)

## 🔐 Error Handling

Tüm hatalar `GlobalErrorHandler` tarafından merkezi olarak işlenir:

- **ZodError** → 400 Validation Error
- **AuthenticationError** → 401 Unauthorized
- **UnauthorizedError** → 403 Forbidden
- **NotFoundError** → 200 No Content
- **DuplicationError** → 409 Conflict
- **MongoServerError** → 400/500 Database Error
- **Generic Errors** → 500 Internal Server Error

## 🏛️ Mimari Prensipleri

1. **Separation of Concerns** - API, Logic ve Database katmanları ayrı
2. **Type Safety** - TypeScript ile compile-time güvenlik
3. **Validation First** - Zod ile runtime validation
4. **Error Handling** - Merkezi ve tip-güvenli hata yönetimi
5. **Session Management** - MongoDB-backed sessions
6. **CORS Security** - Origin-based access control
