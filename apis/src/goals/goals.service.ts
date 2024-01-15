import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private GoalRepository: Repository<Goal>,
  ) {}

  async create(createGoalDto: CreateGoalDto) {
    return await this.GoalRepository.save(createGoalDto);
  }

  async findAll() {
    return await this.GoalRepository.find();
  }

  findOne(id: number) {
    return this.GoalRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateGoalDto: UpdateGoalDto,
  ): Promise<UpdateGoalDto> {
    const matchedGoal = await this.GoalRepository.findOne({ where: { id } });
    const updatedGoal = Object.assign(matchedGoal, updateGoalDto);
    return await this.GoalRepository.save(updatedGoal);
  }

  async remove(id: number) {
    return await this.GoalRepository.delete(id);
  }
  async feedGoals(): Promise<(Goal | null)[]>{
    const goals = await this.GoalRepository.find();
    if (goals.length > 0) {
      console.log('YES')
      return null;
    };
    const seeds = [
     {
      label: "WELCOME",
      image: "https://www.svgrepo.com/show/398519/trophy.svg",
      description: "Welcome on board!"
    },
    {
      label: "Beat that Bot",
      image: "https://www.svgrepo.com/show/131148/robot.svg",
      description: "Won against the Bot on easy"
    },
    {
      label: "Artificial what now?",
      image: "https://www.svgrepo.com/show/235195/robot-ai.svg",
      description: "Won against the Bot on medium"
    },
    {
      label: "iRobot who?",
      image: "https://www.svgrepo.com/show/134/robot.svg",
      description: "Won against the Bot on hard"
    },
    {
      label: "Terminator termniated",
      image: "https://www.svgrepo.com/show/402624/robot-face.svg",
      description: "Won against the Bot on very hard"
    },
    {
      label: "Heisted Heistotron",
      image: "https://www.svgrepo.com/show/145418/robot.svg",
      "description": "Won against the Bot on extreme"
    }
    ]
    const done = await this.GoalRepository.save(seeds);
    console.log(done);
    return done;
  }
}
