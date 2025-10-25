import { IUserInfoService } from "./IUserInfoService";
import { IUserInfoRepository } from "../../repository/userInfo/IUserInfoRepository";
import { CreateUserInfoArgs } from "../../repository/userInfo/types/createUserInfo";
import { DocumentType } from "@typegoose/typegoose";
import { UserInfo } from "../../../database/model/UserInfo";
import { Types } from "mongoose";
import { NotFoundError } from "../../models/CustomErrors";

export class UserInfoService implements IUserInfoService {
  constructor(private userInfoRepository: IUserInfoRepository) {}

  async getUserInfo(
    userId: Types.ObjectId
  ): Promise<DocumentType<UserInfo> | null> {
    return await this.userInfoRepository.getUserInfoByUserId(userId);
  }

  async createUserInfo(
    userId: Types.ObjectId,
    createArgs: Omit<CreateUserInfoArgs, "userId">
  ): Promise<DocumentType<UserInfo>> {
    const userInfoArgs: CreateUserInfoArgs = {
      userId,
      ...createArgs,
    };

    return await this.userInfoRepository.createUserInfo(userInfoArgs);
  }

  async updateUserInfo(
    userId: Types.ObjectId,
    updateData: Partial<UserInfo>
  ): Promise<DocumentType<UserInfo>> {
    return await this.userInfoRepository.updateUserInfo(userId, updateData);
  }

  async deleteUserInfo(userId: Types.ObjectId): Promise<boolean> {
    return await this.userInfoRepository.deleteUserInfo(userId);
  }

  async getUserInfoForAIPrompt(userId: Types.ObjectId): Promise<string> {
    const userInfo = await this.getUserInfo(userId);

    if (!userInfo) {
      throw new NotFoundError(
        "Kullanıcı profil bilgisi bulunamadı. Lütfen önce profil oluşturun."
      );
    }

    // AI için formatlanmış prompt metni oluştur
    const prompt = `
Kullanıcı Profili:
- Cinsiyet: ${this.translateGender(userInfo.gender)}
- Öğrenme Stili: ${this.translateStudyTactic(userInfo.studyTactic)}
- Eğitim Seviyesi: ${this.translateEducationLevel(userInfo.educationLevel)}
- Kariyer Hedefi: ${userInfo.careerGoal}
- Mevcut Durum: ${userInfo.currentStatus}
${
  userInfo.interests && userInfo.interests.length > 0
    ? `- İlgi Alanları: ${userInfo.interests.join(", ")}`
    : ""
}
${
  userInfo.weaknesses && userInfo.weaknesses.length > 0
    ? `- Geliştirilmesi Gereken Konular: ${userInfo.weaknesses.join(", ")}`
    : ""
}
${
  userInfo.strengths && userInfo.strengths.length > 0
    ? `- Güçlü Yönler: ${userInfo.strengths.join(", ")}`
    : ""
}
${
  userInfo.learningGoals ? `- Öğrenme Hedefleri: ${userInfo.learningGoals}` : ""
}
${
  userInfo.availableStudyTime
    ? `- Müsait Çalışma Zamanı: ${userInfo.availableStudyTime}`
    : ""
}
${
  userInfo.preferredLanguage
    ? `- Tercih Edilen Dil: ${userInfo.preferredLanguage}`
    : ""
}
${userInfo.additionalNotes ? `- Ek Notlar: ${userInfo.additionalNotes}` : ""}
    `.trim();

    return prompt;
  }

  private translateGender(gender: string): string {
    const translations: Record<string, string> = {
      male: "Erkek",
      female: "Kadın",
      other: "Diğer",
      prefer_not_to_say: "Belirtmek İstemiyorum",
    };
    return translations[gender] || gender;
  }

  private translateStudyTactic(tactic: string): string {
    const translations: Record<string, string> = {
      visual: "Görsel Öğrenme",
      auditory: "İşitsel Öğrenme",
      kinesthetic: "Uygulamalı/Kinestetik Öğrenme",
      reading_writing: "Okuma-Yazma",
      mixed: "Karma/Çoklu Yöntem",
    };
    return translations[tactic] || tactic;
  }

  private translateEducationLevel(level: string): string {
    const translations: Record<string, string> = {
      primary_school: "İlkokul",
      middle_school: "Ortaokul",
      high_school: "Lise",
      undergraduate: "Lisans",
      graduate: "Yüksek Lisans",
      doctorate: "Doktora",
      other: "Diğer",
    };
    return translations[level] || level;
  }
}
