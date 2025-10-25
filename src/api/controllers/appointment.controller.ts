import { Request, Response, NextFunction } from "express";
import { IAppointmentService } from "../../logic/service/appointment/IAppointmentService";
import { ahandler } from "../../decorators/asynchttphandler";
import { Validate } from "../../logic/utils/Validate";
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "../../logic/Validators/appointment.validator";
import { ResponseFormat } from "../../logic/models/SuccessResponse";
import { Types } from "mongoose";
import { AuthenticationError } from "../../logic/models/CustomErrors";

export class AppointmentController {
  constructor(private service: IAppointmentService) {}

  @ahandler
  async create(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const validatedData = Validate(req.body, createAppointmentSchema);

    const appointment = await this.service.create(
      new Types.ObjectId(session.userId),
      {
        ...validatedData,
        to: new Types.ObjectId(validatedData.to),
        when: new Date(validatedData.when),
      }
    );

    res
      .status(201)
      .json(ResponseFormat(appointment, true, "Randevu talebi oluşturuldu"));
  }

  @ahandler
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const { id } = req.params;
    const validatedData = Validate(req.body, updateAppointmentStatusSchema);

    const appointment = await this.service.updateStatus(
      new Types.ObjectId(id),
      new Types.ObjectId(session.userId),
      validatedData.status
    );

    res.json(ResponseFormat(appointment, true, "Randevu durumu güncellendi"));
  }

  @ahandler
  async getMyAppointments(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const appointments = await this.service.getMyAppointments(
      new Types.ObjectId(session.userId)
    );

    res.json(ResponseFormat(appointments, true, "Randevular getirildi"));
  }

  @ahandler
  async getIncomingRequests(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const requests = await this.service.getIncomingRequests(
      new Types.ObjectId(session.userId)
    );

    res.json(ResponseFormat(requests, true, "Gelen talepler getirildi"));
  }

  @ahandler
  async getOutgoingRequests(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const requests = await this.service.getOutgoingRequests(
      new Types.ObjectId(session.userId)
    );

    res.json(ResponseFormat(requests, true, "Giden talepler getirildi"));
  }

  @ahandler
  async cancel(req: Request, res: Response, next: NextFunction) {
    const session = req.session as any;
    if (!session.userId) {
      throw new AuthenticationError("Lütfen giriş yapın");
    }

    const { id } = req.params;

    const result = await this.service.cancel(
      new Types.ObjectId(id),
      new Types.ObjectId(session.userId)
    );

    res.json(
      ResponseFormat({ cancelled: result }, true, "Randevu iptal edildi")
    );
  }
}
