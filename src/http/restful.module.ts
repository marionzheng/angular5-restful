import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RestfulClient} from './restful.service';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  exports: [HttpClientModule],
  providers: [RestfulClient]
})
export class RestfulModule {}
