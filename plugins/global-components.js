import Vue from 'vue'

// UI Components
import Container from '@/components/ui/Container'
import ImageBoxSkeleton from '@/components/ui/ImageBoxSkeleton'
import TextBoxSkeleton from '@/components/ui/TextBoxSkeleton'

// Pages Common Components
import NoResultFound from '@/components/common/NoResultFound'
import BookingHeader from '@/components/common/BookingHeader'
import SuccessScreen from '@/components/common/SuccessScreen'
import NoResultHubspotForm from '@/components/common/hubspot/NoResultHubspotForm'
import DescribeIssue from '@/components/common/DescribeIssue'

Vue.component('Container', Container)
Vue.component('ImageBoxSkeleton', ImageBoxSkeleton)
Vue.component('TextBoxSkeleton', TextBoxSkeleton)

Vue.component('NoResultFound', NoResultFound)
Vue.component('BookingHeader', BookingHeader)
Vue.component('SuccessScreen', SuccessScreen)
Vue.component('NoResultHubspotForm', NoResultHubspotForm)
Vue.component('DescribeIssue', DescribeIssue)
