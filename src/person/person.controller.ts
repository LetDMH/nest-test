import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads/',
    }),
  )
  uploadPerson(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return 'upload success';
  }

  @Get('search')
  searchPerson(@Query('name') name: string, @Query('age') age: string) {
    return {
      code: 200,
      data: {
        name,
        age,
      },
      msg: '请求成功',
    };
  }

  @Get(':id')
  getPerson(@Param('id') id: string) {
    return {
      code: 200,
      data: id,
      msg: '请求成功',
    };
  }

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    console.log(createPersonDto);
    return this.personService.create(createPersonDto);
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
