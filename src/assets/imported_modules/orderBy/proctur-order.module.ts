import { NgModule } from '@angular/core';
import { OrderPipe } from './proctur-order.pipe';

@NgModule({
  declarations: [OrderPipe],
  exports: [OrderPipe]
})
export class OrderModule {}