import { ApiPromise, WsProvider } from '@polkadot/api';

let _api;

const setup = async () => {
    if (!_api) {
        const wsProvider = new WsProvider(process.env.RPC_ENDPOINT);
        _api = await ApiPromise.create({ provider: wsProvider });
    }
    return _api;
}

const getModules = async (name) => {
    const api = await setup();
    const modules = JSON.parse(JSON.stringify(api.query));
    let r = [];
    for (const k of Object.keys(modules)) {
        if (name && name != k) continue;
        r.push({
            id: k,
            name: k,
            type: 'module',
            label: k,
            methods: Object.keys(modules[k]),
            size: 180,
            symbolType: 'circle',
            subMenuData: {
                label: k,
                data: {}
            }
        });
    };
    return r;
}

const getMethods = async (module) => {
    const m = await getModules(module);
    const methods = m[0].methods;
    let r = [];
    for (const k of methods) {
        r.push({
            id: `${module}_${k}`,
            label: k,
            name: k,
            type: 'method',
            module: module,
            size: 180,
            symbolType: 'circle',
            subMenuData: {
                label: k,
                data: {}
            }
        });
    };
    return r;
}

const getData = async (module, method) => {
    const api = await setup();
    let d = [];
    if (typeof api.query[module][method]?.entries === 'function') {
        d = await api.query[module][method].entries();
    } else if (typeof api.query[module][method]?.keys === 'function') {
        let keys = await api.query[module][method].keys();
        keys.forEach(async (k) => {
            const s = await api.rpc.state.getStorage(k);
            d.push([k.toHuman(), s]);
        });
    } else if (typeof api.query[module][method] === 'function') {
        d.push([await api.query[module][method](), '']);
    }

    let nodeIds = []
    let r = [];
    d.forEach(([key, data]) => {

        let k = key;
        if (typeof key?.args?.map === "function") {
            k = key?.args?.map((k) => k.toHuman());
        }
        k = k.toString();
        if (k.length > 20) k = `${k.slice(0, 10)}...${k.slice(-10, k.length)}`;

        if (typeof data.toHuman === 'function') data = data.toHuman();
        if (typeof (data) !== 'object') data = { data };

        r.push({
            id: key.args?.length ? key?.args?.map((k) => k.toHuman()) : k,
            label: k.length > 30 ? `${k.slice(0, 15)}...${k.slice(-15, k.length)}` : k,
            name: k,
            type: 'key',
            module,
            method,
            size: 180,
            symbolType: 'circle',
            subMenuData: {
                label: 'data',
                data,
            },
        });
    });
    console.log(`nodeIds -> ${JSON.stringify(nodeIds)}`)
    return r;
}

export {
    setup,
    getModules,
    getMethods,
    getData,
};
