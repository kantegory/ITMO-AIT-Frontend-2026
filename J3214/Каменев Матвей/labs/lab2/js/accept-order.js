document.querySelectorAll('#orders-grid .order-card a.btn').forEach((link) => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();

        const user = getCurrentUser();
        if (!user) {
            bootstrap.Modal.getOrCreateInstance(document.getElementById('loginModal')).show();
            return;
        }

        const card = link.closest('.order-card');
        const price = card.querySelector('.order-card-price');
        const href = link.getAttribute('href');

        try {
            const existing = await getMyAnnotations(`&link=${encodeURIComponent(href)}`);

            if (existing.length === 0) {
                const response = await authFetch('/600/annotations', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: user.id,
                        title: card.querySelector('.card-title').textContent,
                        type: card.querySelector('.order-card-type').textContent,
                        description: card.querySelector('.card-text').textContent,
                        cover: card.querySelector('.card-img-top').getAttribute('src'),
                        priceRub: price.dataset.priceRub ? Number(price.dataset.priceRub) : null,
                        priceSuffix: price.dataset.priceSuffix || '',
                        link: href
                    })
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
            }

            window.location.href = href;
        } catch {
            alert('Не удалось принять заказ: сервер недоступен');
        }
    });
});
