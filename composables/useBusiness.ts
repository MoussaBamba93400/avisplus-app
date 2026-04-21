import { storeToRefs } from 'pinia'
import { useAuthStore, type Business } from '~/stores/auth'

interface BusinessPayload {
  name: string
  phone?: string | null
  address?: string | null
  city?: string | null
  postal_code?: string | null
  google_review_url?: string | null
  google_place_id?: string | null
  sms_sender?: string | null
  review_sms_template?: string | null
  review_request_delay_hours?: number | null
  minimum_rating_for_google?: number | null
  auto_send_enabled?: boolean
  is_active?: boolean
}

export const useBusiness = () => {
  const auth = useAuthStore()
  const { businesses, activeBusinessId, activeBusiness } = storeToRefs(auth)
  const api = useApi()

  const list = async () => {
    const { data } = await api.get<{ data: Business[] }>('/businesses')
    auth.setBusinesses(data)
    return data
  }

  const create = async (payload: BusinessPayload) => {
    const business = await api.post<Business>('/businesses', payload)
    await list()
    auth.setActiveBusiness(business.id)
    return business
  }

  const update = async (id: number, payload: Partial<BusinessPayload>) => {
    const business = await api.patch<Business>(`/businesses/${id}`, payload)
    await list()
    return business
  }

  const switchTo = (id: number) => auth.setActiveBusiness(id)

  return { businesses, activeBusinessId, activeBusiness, list, create, update, switchTo }
}
