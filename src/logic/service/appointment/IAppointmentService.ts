import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import {
  StudyAppointment,
  AppointmentStatus,
} from "../../../database/model/StudyAppointment";

export interface IAppointmentService {
  create(
    fromUserId: Types.ObjectId,
    data: Omit<Partial<StudyAppointment>, "from">
  ): Promise<DocumentType<StudyAppointment>>;
  updateStatus(
    appointmentId: Types.ObjectId,
    userId: Types.ObjectId,
    status: AppointmentStatus
  ): Promise<DocumentType<StudyAppointment>>;
  getMyAppointments(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]>;
  getIncomingRequests(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]>;
  getOutgoingRequests(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]>;
  cancel(
    appointmentId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<boolean>;
}
