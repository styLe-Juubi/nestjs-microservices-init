import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ValidRoles } from 'src/modules/core/auth/interfaces/valid-roles.enum';
import { IUser } from 'src/modules/user/interfaces/user.interface';

@Injectable()
export class UserOwner implements CanActivate {

  async canActivate(
    ctx: ExecutionContext,
  ): Promise<boolean>{
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as IUser;
    const { userId } = req.params;

    if ( user.roles.includes( ValidRoles.admin ))
      return true;

    if ( user._id !== userId )
      throw new ForbiddenException(`${ user.username } does not have the permissions to perform this action`);

    return true;
  }
}