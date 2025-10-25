import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import {
  StudyAppointment,
  AppointmentStatus,
} from "../../../database/model/StudyAppointment";

export interface IAppointmentRepository {
  getById(id: Types.ObjectId): Promise<DocumentType<StudyAppointment> | null>;
  create(
    data: Partial<StudyAppointment>
  ): Promise<DocumentType<StudyAppointment>>;
  updateStatus(
    id: Types.ObjectId,
    status: AppointmentStatus
  ): Promise<DocumentType<StudyAppointment>>;
  getByUserId(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]>;
  getIncomingRequests(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]>;
  getOutgoingRequests(
    userId: Types.ObjectId
  ): Promise<DocumentType<StudyAppointment>[]>;
  delete(id: Types.ObjectId): Promise<boolean>;
}
