import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { IAppointmentService } from "./IAppointmentService";
import { IAppointmentRepository } from "../../repository/appointment/IAppointmentRepository";
import {
  StudyAppointment,
  AppointmentStatus,
} from "../../../database/model/StudyAppointment";
import { UnauthorizedError, NotFoundError } from "../../models/CustomErrors";

export class AppointmentService implements IAppointmentService {
  constructor(private repository: IAppointmentRepository) {}

  async create(
    fromUserId: Types.ObjectId,
    data: Omit<Partial<StudyAppointment>, "from">
  ): Promise<DocumentType<StudyAppointment>> {
    return await this.repository.create({
      ...data,
      from: fromUserId,
      status: AppointmentStatus.PENDING,
    });
  }

  async updateStatus(
    appointmentId: Types.ObjectId,
    userId: Types.ObjectId,
    status: AppointmentStatus
  ): Promise<DocumentType<StudyAppointment>> {
    const appointment = await this.repository.getById(appointmentId);

    if (!appointment) {
      throw new NotFoundError("Randevu bulunamadı");
    }

    // Only the receiver can accept/reject
    if (
      status === AppointmentStatus.ACCEPTED ||
      status === AppointmentStatus.REJECTED
    ) {
      if (appointment.to.toString() !== userId.toString()) {
        throw new UnauthorizedError(
          "Bu randevuyu sadece alıcı kabul/red edebilir"
        );
      }
    }

    // Both parties can cancel
    if (status === AppointmentStatus.CANCELLED) {
      if (
        appointment.from.toString() !== userId.toString() &&
        appointment.to.toString() !== userId.toString()
      ) {
        throw new UnauthorizedError("Bu randevuyu iptal etme yetkiniz yok");
      }
    }

    return await this.repository.updateStatus(appointmentId, status);
  }

  async getMyAppointments(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]> {
    return await this.repository.getByUserId(userId);
  }

  async getIncomingRequests(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]> {
    return await this.repository.getIncomingRequests(userId);
  }

  async getOutgoingRequests(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]> {
    return await this.repository.getOutgoingRequests(userId);
  }

  async cancel(
    appointmentId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<boolean> {
    await this.updateStatus(appointmentId, userId, AppointmentStatus.CANCELLED);
    return true;
  }
}
