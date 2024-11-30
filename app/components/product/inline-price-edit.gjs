import pick from 'frontend-price-management/helpers/pick';
import constant from 'frontend-price-management/helpers/constant';
import Component from '@glimmer/component';
import { not } from 'ember-truth-helpers';
import { on } from '@ember/modifier';
import { fn, uniqueId, hash } from '@ember/helper';
import DecimalInput from '../rlv/input-field/decimal-input';
import UnitPrice from '../fmt/unit-price';
import Property from '../util/property';
import { hasMarginCalculationBasis, hasPriceOutCalculationBasis } from '../../utils/product-price';
import { enqueueTask } from 'ember-concurrency';
import TaskState from '../util/task-state';

const Margin = <template>
  <div
    class='p-4 grid grid-cols-8 gap-y-6 gap-x-4 rounded-md bg-gray-50 border
      {{if @active "border-green-300" "border-gray-200"}}'
  >
    <div class='col-span-1'>
      <input
        id='calc-base-margin{{@uuid}}'
        type='radio'
        name='price-calc-basis{{@uuid}}'
        value={{constant 'CALCULATION_BASIS.MARGIN'}}
        checked={{@active}}
        {{on 'input' (pick 'target.value' (fn @setCalculationBasis @product))}}
        class='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300'
      />
    </div>
    <div class='col-span-7 pl-2'>
      <DecimalInput
        @label='Factor'
        @value={{@product.salesOffering.unitPriceSpecification.margin}}
        @onChange={{fn @setMargin @product}}
        class='focus:ring-red-200 focus:border-red-200 block w-full border-gray-300 rounded-md sm:text-sm
          {{unless @active "disabled:bg-gray-200"}}'
        disabled={{not @active}}
      />
    </div>
  </div>
</template>;

const PurchasePrice = <template>
  <DecimalInput
    @label=''
    @leading='&euro;'
    @value={{@product.purchaseOffering.unitPriceSpecification.currencyValue}}
    @onChange={{fn @setPriceIn @product}}
    class='focus:ring-red-200 focus:border-red-200 block w-24 pl-7 border-gray-300 rounded-md sm:text-sm'
  />
</template>;

const SellingPrice = <template>
  <div
    class='relative p-4 grid grid-cols-8 gap-x-4 rounded-md bg-gray-50 border
      {{if @active "border-green-300" "border-gray-200"}}'
  >
    <div class='absolute top-0 right-0 mt-2 mr-2'>
      <input
        id='calc-base-price-out{{@uuid}}'
        type='radio'
        name='price-calc-basis{{@uuid}}'
        value={{constant 'CALCULATION_BASIS.PRICE_OUT'}}
        checked={{@active}}
        {{on 'input' (pick 'target.value' (fn @setCalculationBasis @product))}}
        class='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300'
      />
    </div>
    <div class='pb-4 col-span-8'>
      <Property @label='Prijs excl. btw'>
        <UnitPrice
          @model={{@product.salesOffering.unitPriceSpecification}}
          @showTaxIncluded={{false}}
        />
      </Property>
    </div>
    <div class='col-span-8'>
      <DecimalInput
        @label='Prijs incl. btw'
        @leading='&euro;'
        @value={{@product.salesOffering.unitPriceSpecification.currencyValue}}
        @onChange={{fn @setPriceOut @product}}
        class='focus:ring-red-200 focus:border-red-200 block w-24 pl-7 border-gray-300 rounded-md sm:text-sm
          {{unless @active "disabled:bg-gray-200"}}'
        disabled={{not @active}}
      />
    </div>
  </div>
</template>;
export default class ProductInlinePriceEditComponent extends Component {
  adjustPrice = enqueueTask(async (callback, product, value) => {
    await callback(product, value);
  });

  <template>
    {{#let (uniqueId) as |uuid|}}
      {{yield
        (hash
          PurchasePrice=(component
            PurchasePrice product=@product setPriceIn=(fn this.adjustPrice.perform @setPriceIn)
          )
          Margin=(component
            Margin
            product=@product
            uuid=uuid
            setMargin=(fn this.adjustPrice.perform @setMargin)
            setCalculationBasis=(fn this.adjustPrice.perform @setCalculationBasis)
            active=(hasMarginCalculationBasis @product.salesOffering.unitPriceSpecification)
          )
          SellingPrice=(component
            SellingPrice
            product=@product
            uuid=uuid
            setPriceOut=(fn this.adjustPrice.perform @setPriceOut)
            setCalculationBasis=(fn this.adjustPrice.perform @setCalculationBasis)
            active=(hasPriceOutCalculationBasis @product.salesOffering.unitPriceSpecification)
          )
          SavingStateIcon=(component
            TaskState state=this.adjustPrice labelSuccess='Saved' labelRunning='Saving'
          )
        )
      }}
    {{/let}}
  </template>
}
