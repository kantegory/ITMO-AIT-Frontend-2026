import instance from "./instance"
import TransactionsApi from "./transactions"

const transactionsApi = new TransactionsApi(instance)

export {
  transactionsApi
}