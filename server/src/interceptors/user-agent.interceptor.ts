import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import * as geoip from 'geoip-lite';

@Injectable()
export class HeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest<Request>();

    const userAgent = request.headers['user-agent'];

    const uaParser = new UAParser(userAgent);
    const result = uaParser.getResult();
    
    const os = result.os.name;
    const browser = result.browser.name;
    const device = result.device.vendor + ' ' + result.device.model;
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    request.body.os = os;
    request.body.browser = browser;
    request.body.device = device;
    request.body.ip = ip;
    request.body.referer = request.headers['referer'] || request.headers['referrer'];

    
    return next.handle();
  }
}
