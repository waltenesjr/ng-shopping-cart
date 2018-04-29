import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CartItem } from '../../classes/cart-item';
import { CartShowcaseItemComponent } from '../../components/cart-showcase-item/cart-showcase-item.component';

/**
 * Renders items arranged in columns using a dynamic component for the item useful for getting started with e-commerce applications.
 *
 * @howToUse "Using wider items"
 * ```html
 * <cart-showcase [items]="items" [aspectRatio]="'2:1'">
 * </cart-showcase>
 * ```
 *
 * @howToUse "Using four columns in all screen sizes bigger than 768px"
 * ```html
 * <cart-showcase [items]="items" [mCols]="4" [lCols]="4">
 * </cart-showcase>
 * ```
 *
 * @howToUse "Using a different item component"
 * ```html
 * <cart-showcase [items]="items" [itemComponent]="itemComponent">
 * </cart-showcase>
 * ```
 * ```typescript
 * export class MyComponent {
 *   itemComponent = MyCustomItemComponent;
 * }

 * export class MyCustomItemComponent implements ShowcaseItem  {
 *   item: CartItem;
 * }
 *
 * @NgModule({
 *   // .....
 *   entryComponents: [MyCustomItemComponent],
 * })
 * export class AppModule {
 * }
 * ```
 *
 * @note If you change the [columns] input you must also change the SASS variable that controls the component grid. A similar procedure is
 * required to create aspect ratios with values greater than four eg: '1:5'. Check the styling guide for more information.
 *
 * @note The aspect ratio is the width/height proportion of the items therefore a ratio of "2:2" is equivalent to "1:1". Redundant ratios
 * like these are removed from the source so don't try to use them.
 *
 */
@Component({
  selector: 'cart-showcase',
  templateUrl: './cart-showcase.component.html',
})
export class CartShowcaseComponent implements OnChanges {
  xsClass = 'showcase-container-xs-12';
  sClass = 'showcase-container-s-6';
  mClass = 'showcase-container-m-4';
  lClass = 'showcase-container-l-4';
  xlClass = 'showcase-container-xl-3';
  ratioClass = 'showcase-ratio-1-1';
  /**
   * The number of columns to display when the screen size matches phone devices.
   */
  @Input() xsCols = 1;
  /**
   * The number of columns to display when the screen matches tablet devices.
   */
  @Input() sCols = 2;
  /**
   * The number of columns to display when the screen matches desktop devices.
   */
  @Input() mCols = 3;
  /**
   * The number of columns to display when the screen matches large desktop devices.
   */
  @Input() lCols = 3;
  /**
   * The number of columns to display when the screen matches extra large desktop devices.
   */
  @Input() xlCols = 4;
  /**
   * The number of columns in the grid
   */
  @Input() columns = 12;
  /**
   * An array of items to display
   */
  @Input() items: CartItem[];
  /**
   * The component to use to display the items
   */
  @Input() itemComponent: any = CartShowcaseItemComponent;
  /**
   * The aspect ratio of the container of the items. A value of `1:1` means square items, `2:1` means two times wider, `1:2` two times
   * taller and so on.
   */
  @Input() aspectRatio = '1:1';

  private getColumnSize(value) {
    return Math.floor(this.columns / value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const columnProps = ['xsCols', 'sCols', 'mCols', 'lCols', 'xlCols'];
    const classPrefix = ['xs', 's', 'm', 'l', 'xl'];
    for (let i = 0; i < columnProps.length; i++) {
      const colChanges = changes[columnProps[i]];
      if (colChanges) {
        this[`${classPrefix[i]}Class`] = `showcase-container-xs-${this.getColumnSize(colChanges.currentValue)}`;
      }
    }
    if (changes['aspectRatio']) {
      const newRatio = changes['aspectRatio'].currentValue;
      const values = newRatio.split(':');
      this.ratioClass = `showcase-ratio-${values[0]}-${values[1]}`;
    }
  }
}