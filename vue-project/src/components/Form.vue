<template>
<div>
  <form v-if="!submitted">
    <div class="mb-3">
      <label for="description" class="form-label">Description</label>
      <textarea v-model="form.description" class="form-control mb-1" rows="2" id="description" maxlength="255"></textarea>
      <span v-if="form.description">You can still write {{ (255 - form.description.length )}} letters.</span>
      <div v-if="!descriptionIsValid" id="descriptionHelp" class="form-text error-msg">Text is required, You can't enter more than 255 characters.</div>
    </div>
    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" :value="true" v-model="form.sendConfirmation" id="sendConfirmation">
      <label class="form-check-label" for="sendConfirmation">Send confirmation</label>
      <div v-if="!confirmationIsValid" class="error-msg">Accept is required.</div>
    </div>
    <div class="mb-2 w-25">
      <select v-model="form.selectVat" class="form-select" aria-label="Default select example">
        <option disabled value="">Choose VAT</option>
        <option
            v-for="select in options"
            :key="select.id"
            :value="select.value"
          >{{ select.label }}</option>
      </select>
      <span v-if="!selectVatIsValid" class="error-msg">Select is required.</span>
    </div>

    <div class="d-flex mb-3">
      <div class="w-25">
        <label for="priceNettoEur" class="form-label">Price netto EUR</label>
              <input :disabled="!selectVatIsValid" v-model.number="form.nettoPrice" type="text" class="form-control" id="priceNettoEur">
        <span v-if="!priceIsValid" class="error-msg">Please input number</span>
      </div>
    </div>
    <div class="d-flex mb-2">
      <span>Price brutto EUR:</span><span class="ms-2" v-if="calcVat">{{ calcVat.toFixed(2) }}</span>
    </div>
    <button @click.prevent="submitForm" type="submit" class="btn btn-primary">Submit</button>
    <div v-if="visible" class="alert alert-danger mt-2 text-center" role="alert">
      Error!
    </div>
  </form>
  <div v-else>
    <div class="alert alert-success text-center mt-2" role="alert">
      Success!
    </div>
    <button @click="fillFormAgain" type="button" class="btn btn-primary">Fill the form again</button>
  </div>
</div>
</template>

<script>
import ApiService from "../ApiService";
export default {
  data() {
    return {
      form: {
        description: '',
        sendConfirmation: false,
        selectVat: '',
        nettoPrice: '',
      },
      options: [
        {id:1, label:'19%', value: 19},
        {id:2, label:'21%', value: 21},
        {id:3, label:'23%', value: 23},
        {id:4, label:'25%', value: 25},
      ],
      submitted: false,
      visible: false,
    }
  },
  computed: {
    descriptionIsValid() {
      return this.form.description
    },
    confirmationIsValid() {
      return this.form.sendConfirmation === true;
    },
    selectVatIsValid() {
      return this.form.selectVat;
    },
    priceIsValid() {
      return typeof this.form.nettoPrice === 'number';
    },
    calcVat() {
      const vat = this.form.selectVat
      const cost = this.form.nettoPrice;
      const finalPrice = (cost/100)*(vat+100)
      return finalPrice;
    }
  },
  methods: {
    submitForm() {
      const formIsValid = this.descriptionIsValid && this.confirmationIsValid && this.selectVatIsValid && this.priceIsValid;
      if (formIsValid) {
        ApiService.get().then(() => {
          this.submitted = true;
          console.log('OK');
        })
        .catch(err => {
          console.log(err)
          this.visible = true;
          setTimeout(() => {
            this.visible = !this.visible;
          }, 2000)
        })
      } else {
        alert('Correctly fill the form');
      }
    },
    fillFormAgain() {
      this.submitted = !this.submitted;
      this.form.description = '';
      this.form.nettoPrice = '';
      this.form.sendConfirmation = '';
      this.form.selectVat = '';
    }
  }
}
</script>
<style>
.error-msg {
  color: red;
}
</style>
