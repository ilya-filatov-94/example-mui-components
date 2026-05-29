import { ITreeNode, IintPointTreeNode } from "../types/treeTypes";

const tree = new Map() as Map<string | number, ITreeNode & IintPointTreeNode>;

tree.set('apiMeshIntPoints', {
    id: 'apiMeshIntPoints',
    parent: null,
    level: 0,
    isExpanded: true,
    childs: [],
    integrationPointName: 'Точки APi Mesh'
});

export function searchDataInFlatTree(
    tree: Map<string | number, ITreeNode & IintPointTreeNode>,
    rootIds: Array<number | string> = [], 
    searchCallback: (item: ITreeNode & IintPointTreeNode) => boolean
): Array<ITreeNode & IintPointTreeNode> {
    if (!rootIds?.length || rootIds?.length === 0 || typeof searchCallback !== 'function' || !(tree instanceof Map)) {
        return [];
    }
    
    let counterRoots = rootIds.length - 1;
    const numberOfRoots = rootIds.length - 1;
    const resultArrayData: Array<ITreeNode & IintPointTreeNode> = [];
    let isFoundValueInChilds = false;
    const parentNodesWithoutData: Record<string | number, boolean> = {};

    const nodes = [];
    const root = tree.get(rootIds[numberOfRoots - counterRoots]);

    nodes.push(root);

    while (counterRoots >= 0) {
        if (nodes.length !== 0) {
            const currentNode = nodes.pop()!;

            if (currentNode !== null) {
                resultArrayData.push(currentNode);
                const childs = currentNode?.childs;

                for (let i = 0; i < childs.length; i++) {
                    const childrenNode = tree.get(childs[i]);

                    if (childrenNode && searchCallback(childrenNode)) {
                        nodes.push(childrenNode);
                        isFoundValueInChilds = true;
                    }
                }

                if (!isFoundValueInChilds) {
                    resultArrayData.pop();
                    parentNodesWithoutData[currentNode.id] = true;
                }
            }
        } else {
            --counterRoots;

            if (counterRoots >= 0) {
                const nextRoot = tree.get(rootIds[numberOfRoots - counterRoots]);

                nodes.push(nextRoot);
                isFoundValueInChilds = false;
            }
        }
    }

    return resultArrayData.filter((item) => !parentNodesWithoutData?.[item?.id]);
}


function getVisibleNodes(
  flatTree: Map<string | number, ITreeNode & IintPointTreeNode>,
  rootIds: Array<number | string>,
  expandedMap: Map<string | number, boolean>,
  visibleIds: Set<string | number> | null
): Array<ITreeNode & IintPointTreeNode> {
  const result: Array<ITreeNode & IintPointTreeNode> = [];
  const stack: Array<ITreeNode & IintPointTreeNode> = [];

  // Добавляем корневые узлы
  for (const rootId of rootIds) {
    const rootNode = flatTree.get(rootId);
    if (rootNode) stack.push(rootNode);
  }

  while (stack.length) {
    const node = stack.pop()!;

    // Проверяем видимость по фильтру (если фильтр активен)
    if (visibleIds === null || visibleIds.has(node.id)) {
      result.push(node);

      const isExpanded = expandedMap.get(node.id) ?? node.isExpanded;
      if (isExpanded) {
        // Добавляем детей в обратном порядке, чтобы сохранить исходный порядок
        for (let i = node.childs.length - 1; i >= 0; i--) {
          const child = flatTree.get(node.childs[i]);
          if (child) stack.push(child);
        }
      }
    }
  }

  return result;
}