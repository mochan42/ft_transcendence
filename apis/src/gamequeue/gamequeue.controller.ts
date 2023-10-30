import { Controller, Param, Get } from '@nestjs/common';

@Controller('gamequeue')
export class GamequeueController {
  @Get(':id')
  async makeMatch(@Param('id') id: string) {
    return `Good start ${id}`;
  }
}
