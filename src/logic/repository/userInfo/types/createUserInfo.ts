import { Types } from "mongoose";
import {
  Gender,
  StudyTactic,
  EducationLevel,
} from "../../../../database/model/UserInfo";

export type CreateUserInfoArgs = {
  userId: Types.ObjectId;
  gender: Gender;
  studyTactic: StudyTactic;
  educationLevel: EducationLevel;
  careerGoal: string;
  currentStatus: string;
  interests?: string[];
  weaknesses?: string[];
  strengths?: string[];
  learningGoals?: string;
  availableStudyTime?: string;
  preferredLanguage?: string;
  additionalNotes?: string;
};
