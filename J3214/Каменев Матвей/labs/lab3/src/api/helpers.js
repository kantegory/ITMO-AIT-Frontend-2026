export const emptyListOnForbidden = (error) => {
  if (error.response?.status === 403) {
    return { ...error.response, data: [] }
  }

  throw error
}
