import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {

    constructor(
        private readonly seedService: SeedService,
    ) {}

    // @Auth([ ValidRoles.admin ])
    @Get()
    async executeSeed(): Promise<string> {
        return this.seedService.executeSeed();
    }

}
