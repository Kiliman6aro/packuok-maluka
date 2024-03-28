new Vue({
    el: '#app',
    data: {
        stores: [],
        loading: true,
        groupedStores: [],
        isGrouped: false
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
                        address: this.trimAddress(store.address)
                    }));
                    this.loading = false;
                })
                .catch(error => console.error('Error fetching stores:', error));
        },
        trimAddress(address) {
            const keyword = 'м. Дніпро';
            const index = address.indexOf(keyword);
            if (index !== -1) {
                address = address.substring(index + keyword.length).trim();
            }
            address = address.replace(/^[\s.,]+/, ''); // Удаляем точку, запятую и пробелы в начале строки
            return address;
        },
        openMap(address) {
            const query = encodeURIComponent(`М. Дніпро, ${address}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        },
        toggleGrouping() {
            if(this.isGrouped){
                this.isGrouped = false;
                return;
            }
            const grouped = this.stores.reduce((acc, store) => {
                if (!acc[store.name]) {
                    acc[store.name] = { name: store.name, addresses: [store.address] };
                } else {
                    acc[store.name].addresses.push(store.address);
                }
                return acc;
            }, {});
        
            // Преобразуем объект grouped в массив и сортируем его по количеству адресов
            const sortedGroups = Object.values(grouped).sort((a, b) => b.addresses.length - a.addresses.length);
        
            this.groupedStores = sortedGroups;
            this.isGrouped = true;
        },
        ungroup() {
            this.groupedStores = [];
            this.isGrouped = false;
        }
    }
});
