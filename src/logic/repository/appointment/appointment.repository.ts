import { Types } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import { IAppointmentRepository } from "./IAppointmentRepository";
import {
  StudyAppointment,
  StudyAppointmentModel,
  AppointmentStatus,
} from "../../../database/model/StudyAppointment";
import { NotFoundError } from "../../models/CustomErrors";

export class AppointmentRepository implements IAppointmentRepository {
  async getById(
    id: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment> | null> {
    return await StudyAppointmentModel.findById(id)
      .populate("from", "firstName lastName email")
      .populate("to", "firstName lastName email");
  }

  async create(
    data: Partial<StudyAppointment>
  ): Promise<DocumentType<StudyAppointment>> {
    const appointment = new StudyAppointmentModel(data);
    await appointment.save();

    const populated = await this.getById(appointment._id);
    if (!populated) {
      throw new NotFoundError("Randevu oluşturuldu ancak getirilemedi");
    }

    return populated;
  }

  async updateStatus(
    id: Types.ObjectId,
    status: AppointmentStatus
  ): Promise<DocumentType<StudyAppointment>> {
    const appointment = await StudyAppointmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("from", "firstName lastName email")
      .populate("to", "firstName lastName email");

    if (!appointment) {
      throw new NotFoundError("Randevu bulunamadı");
    }

    return appointment;
  }

  async getByUserId(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]> {
    return await StudyAppointmentModel.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .populate("from", "firstName lastName email")
      .populate("to", "firstName lastName email")
      .sort({ when: 1 });
  }

  async getIncomingRequests(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]> {
    return await StudyAppointmentModel.find({
      to: userId,
      status: AppointmentStatus.PENDING,
    })
      .populate("from", "firstName lastName email")
      .populate("to", "firstName lastName email")
      .sort({ createdAt: -1 });
  }

  async getOutgoingRequests(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]> {
    return await StudyAppointmentModel.find({
      from: userId,
      status: AppointmentStatus.PENDING,
    })
      .populate("from", "firstName lastName email")
      .populate("to", "firstName lastName email")
      .sort({ createdAt: -1 });
  }

  async delete(id: Types.ObjectId): Promise<boolean> {
    const result = await StudyAppointmentModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
