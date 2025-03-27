import { Injectable } from '@nestjs/common';

import { ThemeRepositoryBase } from '@theme/interface';
import { ThemeEntity } from '@theme/entities/theme.entity';
import { ThemeLogEntity } from '@theme/entities/theme-log.entity';

@Injectable()
export class ThemeRepository implements ThemeRepositoryBase {
  private themes: ThemeEntity[] = [
    { id: '1', text: '오늘 한 일 중 앞으로도 계속하고 싶은 일이 있나요?' },
    { id: '2', text: '오늘 나를 웃게 만든 일은 무엇이었나요?' },
    { id: '3', text: '오늘 나를 가장 힘들게 한 순간은 언제였나요?' },
    { id: '4', text: '오늘 하루를 되돌아보면 어떤 감정이 가장 컸나요?' },
    { id: '5', text: '오늘 내가 누군가에게 친절을 베푼 순간이 있었나요?' },
    { id: '6', text: '오늘 내가 배운 것이 있다면 무엇인가요?' },
    { id: '7', text: '오늘 하루를 동물이나 날씨로 표현한다면 무엇일까요? 왜 그렇게 느꼈나요?' },
    { id: '8', text: '오늘 내가 집중했던 일은 무엇이었고, 만족스러웠나요?' },
    { id: '9', text: '오늘 내가 무심코 지나친 작은 행복이 있다면 무엇이었나요?' },
    { id: '10', text: '오늘 하루를 다시 산다면 무엇을 바꾸고 싶나요?' },
  ];
  private themeLogs: ThemeLogEntity[] = [];
  private logId = '0';

  constructor() {}

  findById(id: string): Promise<ThemeEntity | null> {
    return Promise.resolve(this.themes.find((v) => v.id === id) || null);
  }

  getRandomTheme(): Promise<ThemeEntity> {
    const theme = this.themes[Math.floor(Math.random() * this.themes.length)];
    return Promise.resolve(theme);
  }

  getLastLog(): Promise<ThemeLogEntity | null> {
    return Promise.resolve(this.themeLogs.at(-1) || null);
  }

  saveLog(themeEntity: ThemeEntity): Promise<void> {
    if (this.themeLogs.length > 10) this.themeLogs.shift();

    this.logId = String(Number(this.logId) + 1);

    this.themeLogs.push({
      id: this.logId,
      theme_id: themeEntity.id,
      created_at: new Date(),
    });
    return Promise.resolve();
  }
}