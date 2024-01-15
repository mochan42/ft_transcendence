import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { authenticator, totp } from 'otplib';

it('shouldBeOKWhenUserInputMatchedToken', () => {
  const secret = authenticator.generateSecret();
  const token = totp.generate(secret);

  const userInput = token;
  const valid = totp.check(userInput, secret);

  expect(valid).toBe(true);
});
