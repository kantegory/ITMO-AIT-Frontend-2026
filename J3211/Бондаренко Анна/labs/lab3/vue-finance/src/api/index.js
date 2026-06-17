import instance from "./instance"
import FinanceApi from "./finance"

const financeApi = new FinanceApi(instance)

export {
    financeApi
}