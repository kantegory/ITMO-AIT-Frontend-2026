import instance from "@/api/instance"
import FinanceApi from "@/api/finance"

const financeApi = new FinanceApi(instance)
export { financeApi }
