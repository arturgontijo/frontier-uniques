import React from 'react';

import { Graph } from 'react-d3-graph';

import {
    Menu,
    Item,
    Separator,
    Submenu,
    contextMenu
} from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';

import {
    subscribe,
    getModules,
    getMethods,
    getData,
} from '../tools/helpers';

const MENU_ID = 'contextMenuId_0'
const _FORMATTER = {
    actions: { field: 'action_type', value: 'value' },
    cost_per_action_type: { field: 'action_type', value: 'value' },
};


export default class SubstrateGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            graphData: {
                nodes: [{ id: 'root', name: 'runtime', x: 25, y: window.innerHeight / 2 }],
                links: [],
            },
            graphConfig: {
                nodeHighlightBehavior: true,
                node: {
                    color: 'lightgreen',
                    size: 200,
                    highlightStrokeColor: 'blue',
                    labelPosition: 'top',
                    labelProperty: this.nodeLabelBuilder,
                },
                link: {
                    highlightColor: 'lightblue',
                },
                height: window.innerHeight,
                width: window.innerWidth,
                d3: {
                    // alphaTarget: 0.5,
                    // gravity: -300,
                    // linkLength: 200,
                    // linkStrength: 1,
                    disableLinkForce: true,
                },
            },
            selectedNode: undefined,
            insights: {},
            contextMenuEvent: undefined,
        };

        this.graphRef = React.createRef();

        this.getNodeById = this.getNodeById.bind(this);
        this.getLinkById = this.getLinkById.bind(this);

        this.onClickNode = this.onClickNode.bind(this);
        this.onDoubleClickNode = this.onDoubleClickNode.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
        this.onRightClickNode = this.onRightClickNode.bind(this);
        this.onMouseOverNode = this.onMouseOverNode.bind(this);
        this.onClickGraph = this.onClickGraph.bind(this);
        this.onZoomChange = this.onZoomChange.bind(this);
        this.onDragChange = this.onDragChange.bind(this);

        this.showContexMenu = this.showContexMenu.bind(this);

        this.buildSubMenus = this.buildSubMenus.bind(this);
        this.buildNestedSubMenus = this.buildNestedSubMenus.bind(this);
    };

    nodeLabelBuilder(node) {
        if (node?.type) {
            const type = node.type;
            if (type === 'leaf') {
                return '';
            }
        }
        return node?.name;
    }

    async componentDidMount() {
        const { graphData } = this.state;
        await subscribe();
        const node = this.getNodeById('root');
        const modules = await getModules() || [];
        let radius = 100 * (1 + modules.length / 30);
        let deltaY = 0;
        let pace = 0;
        modules.forEach(m => {
            if (pace % 2 !== 0) deltaY++;
            graphData.nodes.push({
                ...m,
                x: node.x + radius,
                y: node.y + ((deltaY * 30) * ((-1) ** pace))
            });
            graphData.links.push({
                id: `root_${m.id}`,
                source: 'root',
                target: m.id,
            });
            pace++;
        });
        this.setState({ selectedNode: undefined });
    }

    getNodeById(nodeId) {
        return this.state.graphData.nodes.find(x => x.id === nodeId);
    }

    getLinkById(nodeId) {
        return this.state.graphData.links.find(x => x.id === nodeId);
    }

    async onClickNode(nodeId, node) {
        const { graphData } = this.state;

        let newNodeIds = [];
        if (node.type === 'module') {
            newNodeIds = await getMethods(nodeId);
        } else if (node.type === 'method') {
            let m = node.id.replace(`${node.module}_`, '');
            newNodeIds = await getData(node.module, m);
        }

        if (newNodeIds) {
            let radius = newNodeIds.length < 10 ? 120 : 120 * (1 + newNodeIds.length / 30);
            let deltaY = 0;
            let pace = 0;
            newNodeIds.forEach(item => {
                let linkId = `${nodeId}_${item.id}`;
                if (!this.getNodeById(item.id)) {
                    if (pace % 2 !== 0) deltaY++;
                    let newNode = {
                        ...item,
                        x: node.x + radius,
                        y: node.y + ((deltaY * 30) * ((-1) ** pace))
                    }
                    graphData.nodes.push(newNode);
                    pace++;
                }
                if (!this.getLinkById(linkId)) {
                    graphData.links.push({
                        id: linkId,
                        source: nodeId,
                        target: item.id
                    });
                }
            });
            this.setState({ selectedNode: node });
        }
    };

    async onDoubleClickNode(nodeId, node) {
        this.setState({ selectedNode: undefined, contextMenuEvent: undefined });
        contextMenu.hideAll()
    };

    async onClickGraph(event) {
        this.setState({ selectedNode: undefined, contextMenuEvent: undefined });
        contextMenu.hideAll()
    };

    async onZoomChange(previousZoom, newZoom) {
        this.setState({ selectedNode: undefined, contextMenuEvent: undefined });
        contextMenu.hideAll();
    };

    async onDragChange(event) {
        this.setState({ selectedNode: undefined, contextMenuEvent: undefined });
        contextMenu.hideAll()
    };

    async onClickLink(source, target) {
        this.setState({ selectedNode: undefined, contextMenuEvent: undefined });
        contextMenu.hideAll()
    };

    async onRightClickNode(event, nodeId, node) {
        if (nodeId) {
            this.setState({ selectedNode: node }, () => { this.showContexMenu(event) });
        }
    };

    async onMouseOverNode(nodeId, node) { };

    async handleItemClick({ event, props, triggerEvent, data }) { }

    showContexMenu(e) {
        const { selectedNode } = this.state;
        if (e) {
            if (selectedNode) {
                contextMenu.show({
                    id: MENU_ID,
                    event: e
                });
            }
            this.setState({ contextMenuEvent: undefined });
        }
        this.setState({ contextMenuEvent: e });
    }

    buildSubMenuItem(field, value, idx) {
        if (value && value.length > 20) {
            value = value.slice(0, 10) + ' ... ' + value.slice(-10, value.length);
        }
        return (
            <Item key={idx} onClick={this.handleItemClick}>
                {value !== undefined ? `${field}: ${value}` : `${field}`}
            </Item>
        );
    }

    buildNestedSubMenus(field, value, idx) {
        let formatter = _FORMATTER[field];
        if (Array.isArray(value) && value.length) {
            return (
                <Submenu label={field}>
                    {value.map((_subField, subIdx) => {
                        let subField = _subField;
                        let subValue = value[subField];
                        if (formatter) {
                            subField = _subField[formatter.field];
                            subValue = _subField[formatter.value];
                        }
                        return this.buildNestedSubMenus(subField, subValue, subIdx);
                    })}
                </Submenu>
            );
        } else if (typeof (value) === 'object') {
            let keys = Object.keys(value);
            return (
                <Submenu label={field}>
                    {keys.map((key, subIdx) => {
                        return this.buildNestedSubMenus(key, value[key], subIdx);
                    })}
                </Submenu>
            );
        } else if (typeof (field) === 'object') {
            let keys = Object.keys(field);
            return (
                <div>
                    {keys.map((key, subIdx) => {
                        return this.buildNestedSubMenus(key, field[key], subIdx);
                    })}
                </div>
            );
        }
        return this.buildSubMenuItem(field, value, idx);
    }

    buildSubMenus() {
        const { insights, selectedNode } = this.state;
        const data = selectedNode?.subMenuData?.data;
        return (
            <div>
                {data ?
                    <div>
                        <Separator />
                        {Object.keys(data).map((field, idx) => {
                            const value = selectedNode.subMenuData.data[field];
                            if (value === undefined || value === '') return;
                            return this.buildNestedSubMenus(field, value, idx);
                        })}
                    </div>
                    : ''
                }
            </div>
        )
    }

    render() {
        const { graphData, graphConfig, selectedNode } = this.state;
        return (
            <div onContextMenu={this.onRightClickNode}>
                {graphData.nodes.length >= 1 ?
                    <Graph
                        id='graph-id' // id is mandatory
                        ref={this.graphRef}
                        data={graphData}
                        config={graphConfig}
                        onClickGraph={this.onClickGraph}
                        onClickNode={this.onClickNode}
                        onDoubleClickNode={this.onDoubleClickNode}
                        onRightClickNode={this.onRightClickNode}
                        onMouseOverNode={this.onMouseOverNode}
                        onZoomChange={this.onZoomChange}
                    /> : undefined
                }
                <Menu id={MENU_ID}>
                    <Item onClick={this.handleItemClick}>
                        {selectedNode ? selectedNode.label : 'NodeId'}
                    </Item>
                    {this.buildSubMenus()}
                </Menu>
            </div>
        );
    }
}
