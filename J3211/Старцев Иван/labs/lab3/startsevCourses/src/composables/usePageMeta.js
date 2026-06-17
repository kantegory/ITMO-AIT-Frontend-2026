export const usePageMeta = () => {
    const setPageMeta = (title, description) => {
        document.title = title
        if (typeof description !== 'string') {
            return
        }
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
            metaDescription.setAttribute('content', description)
        }
    }
    return {
        setPageMeta,
    }
}
