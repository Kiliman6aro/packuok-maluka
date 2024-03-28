new Vue({
    el: '#app',
    data: {
        stores: [],
        loading: true
    },
    mounted() {
        this.fetchStores();
    },
    methods: {
        fetchStores() {
            fetch('https://pakunok-malyuka.ioc.gov.ua/app/api/public-info/retail-outlets?pageIndex=0&active=true&online=false&sortOrder=ascend&sortField=terminalsConnected&mainLocality=%D0%9C.%D0%94%D0%9D%D0%86%D0%9F%D0%A0%D0%9E&pageSize=105&onlyConnected=true')
                .then(response => response.json())
                .then(data => {
                    this.stores = data.content.map(store => ({
                        name: store.name,
                        address: store.address
                    }));
                    this.loading = false;
                })
                .catch(error => console.error('Error fetching stores:', error));
        },
        openMap(address) {
            const query = encodeURIComponent(`М. Дніпро, ${address}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        }
    }
});
