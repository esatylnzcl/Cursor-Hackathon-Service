import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../logic/service/auth/IAuthService";
import { ahandler } from "../../decorators/asynchttphandler";
import { Validate } from "../../logic/utils/Validate";
import {
  loginSchema,
  registerSchema,
} from "../../logic/Validators/auth.validator";
import { ResponseFormat } from "../../logic/models/SuccessResponse";

export class AuthController {
  constructor(private authService: IAuthService) {}

  @ahandler
  async Login(req: Request, res: Response, next: NextFunction) {
    // Validate request body
    const validatedData = Validate(req.body, loginSchema);

    // Login işlemi
    const user = await this.authService.Login(validatedData);

    // Session'a kullanıcı bilgilerini kaydet
    (req.session as any).userId = user._id.toString();
    (req.session as any).email = user.email;

    // Şifreyi response'dan çıkar
    const userObject = user.toObject();
    delete (userObject as any).password;

    res.json(ResponseFormat(userObject, true, "Giriş başarılı"));
  }

  @ahandler
  async Register(req: Request, res: Response, next: NextFunction) {
    // Validate request body
    const validatedData = Validate(req.body, registerSchema);

    // Register işlemi
    const user = await this.authService.Register(validatedData);

    // Şifreyi response'dan çıkar
    const userObject = user.toObject();
    delete (userObject as any).password;

    res
      .status(201)
      .json(
        ResponseFormat(userObject, true, "Kullanıcı başarıyla oluşturuldu")
      );
  }

  @ahandler
  async Logout(req: Request, res: Response, next: NextFunction) {
    req.session.destroy((err) => {
      if (err) {
        throw new Error("Çıkış yapılırken bir hata oluştu");
      }
    });

    res.json(ResponseFormat(null, true, "Çıkış başarılı"));
  }

  @ahandler
  async Check(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;

    if (session.userId) {
      res.json(
        ResponseFormat(
          {
            isAuthenticated: true,
            userId: session.userId,
            email: session.email,
          },
          true,
          "Oturum aktif"
        )
      );
    } else {
      res.json(
        ResponseFormat({ isAuthenticated: false }, true, "Oturum bulunamadı")
      );
    }
  }
}
