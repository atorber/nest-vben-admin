import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { isEmpty } from 'lodash';
import * as svgCaptcha from 'svg-captcha';

import { ApiResult } from '@/decorators';
import { RedisService } from '@/modules/shared/redis/redis.service';

import { generateUUID } from '@/utils';

import { Public } from '../decorators';

import { ImageCaptchaDto } from '../dtos/captcha.dto';
import { ImageCaptcha } from '../models/auth.model';

@ApiTags('Captcha - 验证码模块')
@UseGuards(ThrottlerGuard)
@Controller('auth/captcha')
export class CaptchaController {
  constructor(private redisService: RedisService) {}

  @Get('img')
  @ApiOperation({ summary: '获取登录图片验证码' })
  @ApiResult({ type: ImageCaptcha })
  @Public()
  @Throttle(2, 60)
  async captchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    const { width, height } = dto;

    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(width) ? 100 : width,
      height: isEmpty(height) ? 50 : height,
      charPreset: '1234567890',
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64',
      )}`,
      id: generateUUID(),
    };
    // 5分钟过期时间
    await this.redisService.client.set(
      `captcha:img:${result.id}`,
      svg.text,
      'EX',
      60 * 5,
    );
    return result;
  }
}
