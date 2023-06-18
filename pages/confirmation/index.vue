<template>
  <div>
    <!-- <div id="response-container" /> -->
    <div v-if="statusOrder === 'success'">
      <SuccessScreen />
    </div>
    <div v-else-if="statusOrder ==='loading'">
      <div class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-secondary opacity-70 flex flex-col items-center justify-center">
        <div class="lds-facebook">
          <div /><div /><div />
        </div>
        <h2 class="text-center text-white text-2xl 2xl:text-3xl font-bold uppercase">
          We are placing your order
        </h2>
        <p class="w-full md:w-1/3 text-base 2xl:text-2xl mt-2 text-center text-white uppercase px-5">
          This may take a few seconds. Please don't close this page.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import moment from 'moment'
const paymentModule = createNamespacedHelpers('payment')
const cartModule = createNamespacedHelpers('cart')
const orderModule = createNamespacedHelpers('order')
const calendarModule = createNamespacedHelpers('calendar')
export default {
  data () {
    return {
      repairDate: null,
      customerDetail: null,
      paymentDetails: null,
      cart: null,
      insertedOrder: null,
      statusOrder: 'waiting'
    }
  },
  mounted () {
    this.placeOrder()
  },
  methods: {
    ...paymentModule.mapActions(['KLARNA_GET_ORDER']),
    ...paymentModule.mapMutations(['RESET_PAYMENT_DETAILS']),
    ...cartModule.mapMutations(['EMPTY_CART']),
    ...orderModule.mapActions(['INSERT_ORDER']),
    ...calendarModule.mapActions(['INSERT_EVENT', 'FETCH_EVENTS_BY_DATE']),

    async placeOrder () {
      if (this.getLocalStorageData()) {
        this.statusOrder = 'loading'
        if (this.$route.query.id) { // Klarna
          const resp = await this.KLARNA_GET_ORDER({ order_id: this.$route.query.id })
          if (resp) {
            if (resp.data.request.status === 'checkout_complete') {
              await this.createOrderAndInsertEvent()
              await this.sentMailToUserAndAdmin()
              this.clean()
              this.statusOrder = 'success'
            // const responseContainer = document.getElementById('response-container')
            // responseContainer.innerHTML = resp.data.request.html_snippet.replace(/\\"/g, '"').replace(/\\n/g, '')
            }
          }
        } else if (this.$route.query.status && this.$route.query.status === 'COMPLETED') { // PayPal & Stripe
          await this.createOrderAndInsertEvent()
          await this.sentMailToUserAndAdmin()
          this.clean()
          this.statusOrder = 'success'
        } else {
        // console.log('Something went wrong!')
        }
      } else {
      // handle it if user refreshes the page
        this.statusOrder = 'success'
      }
    },
    getLocalStorageData () {
      this.repairDate = localStorage.getItem('DD_REPAIR_DATE')
      this.customerDetail = localStorage.getItem('DD_CUSTOMER_DETAIL')
      this.paymentDetails = localStorage.getItem('DD_GET_PAYMENT_DETAILS')
      this.cart = localStorage.getItem('DD_CART')
      if (this.customerDetail) {
        this.customerDetail = JSON.parse(this.customerDetail)
      } else {
        return false
      }
      if (this.paymentDetails) {
        this.paymentDetails = JSON.parse(this.paymentDetails)
      } else {
        return false
      }
      if (this.cart) {
        this.cart = JSON.parse(this.cart)
      } else {
        return false
      }
      return true
    },
    async createOrder () {
      const data = {
        assigned_to: 1,
        customer: this.customerDetail,
        status: 'Waiting',
        promocode: this.cart.promocode ? this.cart.promocode : null,
        total_amount: this.cart.subTotal,
        payment_status: this.paymentDetails.paid_full ? 'Paid Full' : 'Paid ' + this.paymentDetails.advance_amount,
        payment_type: this.paymentDetails.payment_type,
        notes: '',
        repair_date: this.repairDate,
        mobile_tablet: this.cart.mobileTablet.length ? this.cart.mobileTablet : null,
        technical_support: this.cart.technicalSupport.length ? this.cart.technicalSupport : null,
        business_support: this.cart.businessSupport.length ? this.cart.businessSupport : null,
        total_time: this.cart.totalTime,
        details: {
          advance_amount: this.paymentDetails.advance_amount
        }
      }
      const resp = await this.INSERT_ORDER(data)
      return resp
    },
    async insertEventInCalendar () {
      // Mobile Devices
      let mobileDevices = ''
      if (this.insertedOrder.mobile_tablet) {
        mobileDevices = 'Mobile Devices: \n'
        this.insertedOrder.mobile_tablet.forEach((element) => {
          mobileDevices += `\t${element.subcategory.name} > ${element.brand.name} > ${element.model.name} > ${element.color.name}\n`
          mobileDevices += '\tIssues:\n'
          element.issues.forEach((item) => {
            mobileDevices += `\t\t${item.name} &#163;${item.price}\n`
          })
        })
        mobileDevices += '\n'
      }
      // Business Support
      let businessSupport = ''
      if (this.insertedOrder.business_support) {
        businessSupport = 'Business Support: \n'
        this.insertedOrder.business_support.forEach((element) => {
          businessSupport += `\tSession: ${element.session.time} > £${element.session.price}\n`
          if (element.issueDescription) {
            businessSupport += `\tIssue Description: ${element.issueDescription}`
          } else {
            businessSupport += '\tIssues:\n'
            element.issues.forEach((item) => {
              businessSupport += `\t\t${item.name}`
            })
          }
        })
        businessSupport += '\n'
      }

      // Technical Support
      let technicalSupport = ''
      if (this.insertedOrder.technical_support) {
        technicalSupport = 'Technical Support: \n'
        this.insertedOrder.technical_support.forEach((element) => {
          technicalSupport += `\tSession: ${element.session.time} > £${element.session.price}\n`
          if (element.issueDescription) {
            technicalSupport += `\tIssue Description: ${element.issueDescription}`
          } else {
            technicalSupport += '\tIssues:\n'
            element.issues.forEach((item) => {
              technicalSupport += `\t\t${item.name}`
            })
            technicalSupport += `\n\t\tAdditional Detail: ${element.selectedIssuesDescription.description || 'N/A'}`
          }
        })
        technicalSupport += '\n'
      }

      // Customer Address
      let address = `${this.customerDetail.address1 ? `${this.customerDetail.address1} ` : ''}`
      address += `${this.customerDetail.address2 ? `${this.customerDetail.address2}` : ''}`
      address += `${this.customerDetail.postcode ? `, ${this.customerDetail.postcode}` : ''}`

      const title = `Web Order # ${this.insertedOrder.id} - ${this.customerDetail.firstname} ${this.customerDetail.lastname}`
      // Calendar Description
      const desc = `<b>Order # ${this.insertedOrder.id} - Details:</b>\n` +
        `${mobileDevices}` +
        `${businessSupport}` +
        `${technicalSupport}` +
        `Total Price(including discount): £${this.cart.subTotal}\n` +
        `Paid: ${this.insertedOrder.payment_status !== 'Paid Full' ? `Paid £${this.paymentDetails.advance_amount}` : 'Paid Full'} \n` +
        `Remaining Amount: ${this.insertedOrder.payment_status === 'Paid Full' ? 'N/A' : `£${this.cart.subTotal - this.paymentDetails.advance_amount}`}\n` +
        `Discount: £${this.cart.totalPrice - this.cart.subTotal}\n` +
        `Payment Type: ${this.insertedOrder.payment_type}\n` +
        `Time allotted to repair: ${this.cart.totalTime} min\n` +
        `Promocode: ${this.cart.promocode ? this.cart.promocode.code : 'N/A'}\n\n` +
        '<b>Customer Information:</b>\n' +
        `Name: ${this.customerDetail.firstname} ${this.customerDetail.lastname}\n` +
        `Email: ${this.customerDetail.email}\n` +
        `Contact Number: ${this.customerDetail.phone ? this.customerDetail.phone : 'N/A'}\n` +
        `Technician notes on repair: ${this.insertedOrder.notes ? this.insertedOrder.notes : 'N/A'}\n` +
        `Location: ${address}\n` +
        'Special Travel Requirements:\n\n' +
        '<b>Technician to fill in if the device needed to be picked up:</b>\n' +
        'Issue:\n' +
        'Revised Quote:\n' +
        'Return Date:\n' +
        'OR:\n' +
        'Update Date:\n' +
        'Additional Bookings/Information:\n'

      const resp = await this.FETCH_EVENTS_BY_DATE({ startDateTime: this.repairDate })
      const events = resp.data.data.filter(event => event.googleEvent.creator.email === process.env.GOOGLE_SERVICE_ACCOUNT)
      // Calculate minutes of previously inserted events
      let totalMinutes = 0
      events.forEach((element) => {
        const duration = moment.duration(moment(element.googleEvent.end.dateTime).diff(moment(element.googleEvent.start.dateTime)))
        totalMinutes += duration.asMinutes()
      })
      // Set start and end datetime for current event
      const startDateTime = moment(this.repairDate).add(totalMinutes, 'm').format('YYYY-MM-DD HH:mm:ss')
      const endDateTime = moment(startDateTime).add(this.cart.totalTime, 'm').format('YYYY-MM-DD HH:mm:ss')

      const isEventInserted = await this.INSERT_EVENT({ name: title, description: desc, startDateTime, endDateTime })
      return isEventInserted
    },
    async createOrderAndInsertEvent () {
      const isOrderInserted = await this.createOrder()
      if (isOrderInserted) {
        this.insertedOrder = isOrderInserted.data.data[0]
        await this.insertEventInCalendar()
        this.markStatusCompletedForUser()
      }
    },
    markStatusCompletedForUser () {
      this.$store.dispatch('cart/SET_CUSTOMER_CART_IN_DB', { isCompleted: true })
    },
    async sentMailToUserAndAdmin () {
      let address = `${this.customerDetail.address1 ? `${this.customerDetail.address1} ` : ' '}`
      address += `${this.customerDetail.address2 ? `${this.customerDetail.address2}` : ''}`
      const payload = {
        to_mail: this.customerDetail.email,
        name: this.customerDetail.firstname + ' ' + this.customerDetail.lastname,
        order_id: '#' + this.insertedOrder.id,
        order_promo: this.cart.promocode ? this.cart.promocode.code : 'N/A',
        order_discount: '£' + (this.cart.totalPrice - this.cart.subTotal),
        order_total_price: '£' + this.cart.subTotal,
        order_paid: this.insertedOrder.payment_status !== 'Paid Full' ? `Paid £${this.paymentDetails.advance_amount}` : 'Paid Full',
        order_remaining: this.insertedOrder.payment_status === 'Paid Full' ? 'N/A' : '£' + [this.cart.subTotal - this.paymentDetails.advance_amount],
        order_location: address,
        items: this.cart.mobileTablet,
        businessSupport: this.cart.businessSupport,
        technicalSupport: this.cart.technicalSupport
      }
      const adminPayload = {
        to_mail: 'admin@devicedoctors.co.uk',
        name: this.customerDetail.firstname + ' ' + this.customerDetail.lastname,
        order_id: '#' + this.insertedOrder.id,
        order_promo: this.cart.promocode ? this.cart.promocode.code : 'N/A',
        order_discount: '£' + (this.cart.totalPrice - this.cart.subTotal),
        order_total_price: '£' + this.cart.subTotal,
        order_paid: this.insertedOrder.payment_status !== 'Paid Full' ? `Paid £${this.paymentDetails.advance_amount}` : 'Paid Full',
        order_remaining: this.insertedOrder.payment_status === 'Paid Full' ? 'N/A' : '£' + [this.cart.subTotal - this.paymentDetails.advance_amount],
        order_location: address,
        items: this.cart.mobileTablet,
        businessSupport: this.cart.businessSupport,
        technicalSupport: this.cart.technicalSupport,
        customer: {
          name: this.customerDetail.firstname + ' ' + this.customerDetail.lastname,
          phone: this.customerDetail.phone,
          email: this.customerDetail.email,
          specialRequirements: ''
        }
      }
      await this.$store.dispatch('order/SENT_CUSTOMER_MAIL', payload)
      await this.$store.dispatch('order/SENT_ADMIN_MAIL', adminPayload)
    },
    cleanLocalStorage () {
      localStorage.removeItem('DD_REPAIR_DATE')
      localStorage.removeItem('DD_CUSTOMER_DETAIL')
      localStorage.removeItem('DD_GET_PAYMENT_DETAILS')
      localStorage.removeItem('DD_CART')
    },
    cleanState () {
      this.EMPTY_CART()
      this.RESET_PAYMENT_DETAILS()
    },
    clean () {
      this.cleanLocalStorage()
      this.cleanState()
    }
  }
}
</script>

<style lang="scss" scoped>
.lds-facebook {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: #fff;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-facebook div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}
.lds-facebook div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}
.lds-facebook div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes lds-facebook {
  0% {
    top: 8px;
    height: 64px;
  }
  50%, 100% {
    top: 24px;
    height: 32px;
  }
}

</style>
