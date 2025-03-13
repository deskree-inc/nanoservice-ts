from typing import Any, Dict
from nodes.nodes import get_nodes
from core.node_base import NodeBase
from core.types.context import Context

class Runner:
    def __init__(self, node_name: str, ctx: Dict[str, Any]):
        self.nodes = get_nodes()
        self.ctx = self.create_context(ctx)
        self.node_name = node_name

    async def run(self):
        node: NodeBase = self.node_resolver(self.node_name, self.ctx.config)
        return await node.process(self.ctx)
    
    def node_resolver(self, node_name: str, config: Dict[str, Any]) -> NodeBase:
        node: NodeBase = self.nodes[node_name]
        node.node = config.get('node')
        node.name = config.get('name')
        node.active = config.get('active', True)
        node.stop = config.get('stop', False)
        node.set_var = config.get('set_var', False)
        node.originalConfig = config
        return node
    
    def create_context(self, ctx: Dict[str, Any]) -> Context:
        context = Context()
        context.id = ctx.get('id', '')
        context.workflow_name = ctx.get('workflow_name', '')
        context.workflow_path = ctx.get('workflow_path', '')
        context.request = ctx.get('request', {})
        context.response = ctx.get('response', {})
        context.error = ctx.get('error', None)
        context.logger = ctx.get('logger', None)
        context.config = ctx.get('config', {})
        context.func = ctx.get('func', None)
        context.vars = ctx.get('vars', {})
        context.env = ctx.get('env', {})

        return context